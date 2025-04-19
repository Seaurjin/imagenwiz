const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Serve our test page at the root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'simple-test-page.html'));
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Simple test server running at http://0.0.0.0:${port}`);
});