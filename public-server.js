const express = require('express');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = 3003;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Proxy to Expo dev server
app.get('*', (req, res) => {
  // Redirect to localhost:8082 for development
  res.redirect(`http://localhost:8082${req.path}`);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 Public server running on port ${PORT}`);
  console.log(`📱 Access from mobile: http://YOUR_LOCAL_IP:${PORT}`);
  
  // Get local IP
  exec('ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk \'{print $2}\'', (error, stdout) => {
    if (!error && stdout.trim()) {
      const localIP = stdout.trim();
      console.log(`📱 Mobile access: http://${localIP}:${PORT}`);
    }
  });
});

