const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const Backend_Url = 'http://localhost:1620';

const http = require('http');
const url = require('url');
const {response, request} = require("express");
// Use the CORS middleware to allow cross-origin requests
app.use(cors());

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

app.use(express.json());
app.post(`/customer/addfavourite`, async (req, res)=>{
  try{
    const response = await fetch(`${Backend_Url}/customer/addfavourite`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
  });
    const responseData = await response.text();
    res.json(responseData);
  }
 catch (error) {
  console.error('Error:', error);
  res.status(500).json({ error: 'Internal server error' });
}
});

app.delete(`/customer/removefav`, async (req, res)=>{
  try {
  const response = await fetch(`${Backend_Url}/customer/removefav`,{
    method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(req.body)
  });
    const responseData = await response.text();
    res.json(responseData);
  } catch (error)
  {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.get('/product/detail/:productCode', async (req, res)=>{
  const { productCode } = req.params; // Extracting path variable
  const { id } = req.query; // Extracting query parameter

  if (!productCode || !id) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }
  try {
    // Construct the backend URL with the received path variable and query parameters
    const backendUrl = `${Backend_Url}/product/${productCode}?id=${id}`;
    const response = await fetch(backendUrl);

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    const data = await response.json();
    // Send the data received from the backend to the client

    res.json(data);
  } catch (error) {
    console.error('Error fetching data from backend:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/customer/addtocart',async  (req, res) =>{
  try{
    const response = await fetch(`${Backend_Url}/customer/addtocart`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    const responseData = await response.text();
    res.json(responseData);
  }
  catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// app.get('/product/suggest/:name', async (req, res)=>{
//   try {
//     const {queryParams} = req.params;
//     console.log(`query params??: ${queryParams}`);
//     // const searchParams = req.url;
//     // const paramEntries = searchParams.entries();
//     // const queryPair = paramEntries.next().value;
//     // const currText = queryPair[1];
//
//     console.log(`proxy url: ${Backend_Url}/product/suggest?name=${queryParams}`);
//                                               //http://localhost:1620/product/suggest?name=GD-
//     const response = await fetch(`${Backend_Url}/product/suggest?name=${queryParams}`);
//     if (response.statusCode===404) {
//       // If the response status is 404, redirect to the custom 404 page
//       res.redirect('/404.html');
//     } else if (!response.ok) {
//       throw new Error('Network response was not ok ' + response.statusText);
//     } else {
//       const data = await response.json();
//       res.json(data);
//     }
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     res.status(500).json({error: 'Failed to fetch data from the real server'});
//   }
// });

app.get('/product/suggest/:name', async (req, res)=>{
  // const { queryParams } = req.params; // Extracting path variable
  try {
    const queryParts = req.url.split("/");
    const text = queryParts[3];

    const response = await fetch(`${Backend_Url}/product/suggest?name=${text}`);

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    const data = await response.json();
    // Send the data received from the backend to the client

    res.json(data);
  } catch (error) {
    console.error('Error fetching data from backend:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

