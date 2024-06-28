const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const Backend_Url = 'http://localhost:1620';

// Use the CORS middleware to allow cross-origin requests
app.use(cors());

// Define a sample endpoint
app.get('/endpoint', (req, res) => {
  res.json({ message: 'Hello from localhost!' });
});

app.get('/product/manufacturer/:manufacturerName-:manufacturerId/p:page', async (req, res) => {
  const { manufacturerName, manufacturerId, page} = req.params;

  if (isNaN(parseInt(manufacturerId)) || isNaN(parseInt(page))) {
    res.status(400).json({ error: 'Invalid parameters: id and page must be integers.' });
    return;
  }

  try {
    const response = await fetch(`${Backend_Url}/product/manufacturer/${manufacturerName}-${manufacturerId}/p${page}`);
    if (response.status === 404) {
      // If the response status is 404, redirect to the custom 404 page
      res.redirect('/404.html');
    }
    else
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    else
    {
      const data = await response.json();
      res.json(data);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data from the real server' });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
