const store = require('../dbStore');

// Login or fetch current active user
exports.login = (req, res) => {
  const { email, role } = req.body;

  let user;
  if (email) {
    user = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }
  
  if (!user && role) {
    user = store.users.find(u => u.role === role);
  }

  if (!user) {
    user = store.users[0]; // fallback tenant
  }

  res.json({
    success: true,
    user,
    token: `demo-token-${user.id}-${Date.now()}`
  });
};

exports.getUsers = (req, res) => {
  res.json({
    success: true,
    users: store.users
  });
};

exports.switchRole = (req, res) => {
  const { role } = req.body;
  const user = store.users.find(u => u.role === role) || store.users[0];
  
  res.json({
    success: true,
    user,
    token: `demo-token-${user.id}-${Date.now()}`
  });
};
