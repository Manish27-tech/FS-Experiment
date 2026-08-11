const usersDB = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
  { id: 2, username: 'editor', password: 'editor123', role: 'editor' },
  { id: 3, username: 'viewer', password: 'viewer123', role: 'viewer' }
];
const SECRET_KEY = 'mySuperSecretKey123';

export const mockLoginAPI = (username, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = usersDB.find(u => u.username === username && u.password === password);
      if (!user) return reject({ message: 'Invalid username or password' });
      
      // Generate Fake JWT
      const payload = { userId: user.id, username: user.username, role: user.role, exp: Date.now() + 3600000 };
      const token = btoa(JSON.stringify(payload)) + '.' + btoa(SECRET_KEY); 
      
      resolve({ token, user: { id: user.id, username: user.username, role: user.role } });
    }, 500);
  });
};