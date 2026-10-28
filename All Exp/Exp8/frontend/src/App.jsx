
import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

const API_URL = 'http://localhost:8080/api/posts';

// Display timestamps in Indian Standard Time.
const formatScheduledTime = (timestamp) => {
  if (!timestamp) {
    return 'Time not available';
  }

  // The backend should return an ISO timestamp containing Z or a timezone offset.
  // Do not guess the timezone if the backend returns an ambiguous timestamp.
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return 'Invalid scheduled time';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  }).format(date);
};

function App() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch scheduled posts from Spring Boot.
  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Failed to fetch posts: HTTP ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error('The backend did not return a list of posts.');
      }

      setPosts(data);
      setError('');
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err.message || 'Unable to connect to the backend.');
    }
  }, []);

  // Fetch immediately and then poll every 3 seconds.
  useEffect(() => {
    fetchPosts();

    const intervalId = setInterval(() => {
      fetchPosts();
    }, 3000);

    return () => clearInterval(intervalId);
  }, [fetchPosts]);

  // Schedule a new post.
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!content.trim() || !scheduleTime) {
      setError('Please enter post content and select a schedule time.');
      return;
    }

    // datetime-local supplies a local date/time without a timezone.
    // JavaScript interprets this value in the browser's local timezone.
    const selectedDate = new Date(scheduleTime);

    if (Number.isNaN(selectedDate.getTime())) {
      setError('Please select a valid schedule time.');
      return;
    }

    if (selectedDate.getTime() <= Date.now()) {
      setError('Please select a future schedule time.');
      return;
    }

    // Convert the selected instant to UTC for the API request.
    const scheduledTimeUTC = selectedDate.toISOString();

    console.log('Selected local time:', scheduleTime);
    console.log('Sending UTC timestamp:', scheduledTimeUTC);
    console.log(
      'Browser timezone:',
      Intl.DateTimeFormat().resolvedOptions().timeZone
    );
    console.log(
      'Scheduled time in IST:',
      formatScheduledTime(scheduledTimeUTC)
    );

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
          scheduledTime: scheduledTimeUTC,
        }),
      });

      if (!response.ok) {
        const responseText = await response.text();

        throw new Error(
          `Scheduling failed (HTTP ${response.status})` +
          (responseText ? `: ${responseText}` : '')
        );
      }

      setContent('');
      setScheduleTime('');

      // Refresh the list after successfully scheduling.
      await fetchPosts();
    } catch (err) {
      console.error('Error scheduling post:', err);
      setError(err.message || 'Unable to schedule the post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Kafka Event-Driven Publisher</h1>
        <p>
          Schedule your posts and watch the Kafka pipeline in action!
        </p>
        <p>All scheduled times are displayed in India Standard Time (IST).</p>
      </header>

      <main className="main-content">
        <section className="form-section">
          <h2>Schedule a New Post</h2>

          <form onSubmit={handleSubmit} className="post-form">
            <div className="form-group">
              <label htmlFor="post-content">Post Content:</label>

              <textarea
                id="post-content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="What's on your mind?"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="schedule-time">
                Schedule Time (your local time):
              </label>

              <input
                id="schedule-time"
                type="datetime-local"
                value={scheduleTime}
                onChange={(event) => setScheduleTime(event.target.value)}
                required
              />
            </div>

            {scheduleTime && (
              <div className="time-preview">
                <strong>Selected time:</strong>{' '}
                {formatScheduledTime(new Date(scheduleTime).toISOString())}
                <br />
                <small>
                  The API receives this time as a UTC timestamp.
                </small>
              </div>
            )}

            {error && (
              <div className="error-message" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Scheduling...' : 'Schedule Post'}
            </button>
          </form>
        </section>

        <section className="posts-section">
          <h2>Scheduled Posts</h2>

          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}

          <div className="posts-grid">
            {posts.length === 0 ? (
              <p className="no-posts">
                No posts scheduled yet.
              </p>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className={`post-card status-${String(
                    post.status || 'unknown'
                  ).toLowerCase()}`}
                >
                  <div className="post-header">
                    <span className="post-id">
                      ID: {post.id}
                    </span>

                    <span className="post-status">
                      {post.status || 'UNKNOWN'}
                    </span>
                  </div>

                  <div className="post-content">
                    {post.content}
                  </div>

                  <div className="post-time">
                    <strong>Scheduled:</strong>{' '}
                    {formatScheduledTime(post.scheduledTime)}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;