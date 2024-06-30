const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const Backend_Url = 'http://localhost:1620';

const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  console.log('Path:', pathname);
  console.log('Query Parameters:', query);

  // Handle your logic here, e.g., ignoring _ijt and _ij_reload
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, world!\n');
});




// Use the CORS middleware to allow cross-origin requests
app.use(cors());

// Define a sample endpoint
app.get('/endpoint', (req, res) => {
  res.json({ message: 'Hello from localhost!' });
});

app.get('/product/manufacturer/:manufacturerName/p:page', async (req, res) => {
  const { manufacturerName, page} = req.params;

  try {
    const response = await fetch(`${Backend_Url}/product/manufacturer/${manufacturerName}/p${page}`);
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

app.get('/category/names', async (req, res)=> {

  try {
    const response = await fetch(`${Backend_Url}/category/names`);
    if (response.status === 404) {
      // If the response status is 404, redirect to the custom 404 page
      res.redirect('/404.html');
    } else if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    } else {
      const data = await response.json();
      res.json(data);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({error: 'Failed to fetch data from the real server'});
  }

});

app.get('/product/category/:categoryName/p:page', async (req, res) => {
  const {categoryName, page} = req.params;

  try {
    const response = await fetch(`${Backend_Url}/product/category/${categoryName}/p${page}`);
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


