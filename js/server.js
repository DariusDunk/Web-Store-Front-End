const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Use the CORS middleware to allow cross-origin requests
app.use(cors());

// Define a sample endpoint
app.get('/endpoint', (req, res) => {
  res.json({ message: 'Hello from localhost!' });
});

app.get('/getDataFromBackend', async (req, res) => {
  try {
    const response = await fetch('http://localhost:1620/category/');
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
