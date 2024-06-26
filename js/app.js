// script.js

const Proxy_Url = 'http://localhost:3000';
async function fetchData() {
  try {
    const response = await fetch('http://localhost:3000/getDataFromBackend'); // Replace with your endpoint URL
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    const data = await response.json();
    displayStructured(data);
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

function displayData(data) {
  const resultContainer = document.getElementById('resultContainer');

  // Assuming the data is an array of objects
  data.forEach(item => {
    const div = document.createElement('div');
    div.textContent = JSON.stringify(item); // Convert item to string for display purposes
    resultContainer.appendChild(div);
  });
}

function displayStructured(data) {
  const extractedData = data.map(({ id, categoryName }) => ({ id, categoryName }));

  const container = document.getElementById('resultContainer');

  extractedData.forEach(item => {
    // Create a div element to hold the data
    const itemDiv = document.createElement('div');

    // Create a paragraph for the ID
    const idPara = document.createElement('p');
    idPara.textContent = `ID: ${item.id}`;

    // Create a paragraph for the name
    const namePara = document.createElement('p');
    namePara.textContent = `Name: ${item.categoryName}`;

    // Append paragraphs to the div
    itemDiv.appendChild(idPara);
    itemDiv.appendChild(namePara);

    // Append the div to the container
    container.appendChild(itemDiv);
  });
}


async function pathVariableFetch(manufacturerName, manufacturerId,page) {
  try {
    const response = await fetch(`http://localhost:3000/product/manufacturer/${manufacturerName}-${manufacturerId}/p${page}`); // Replace with your endpoint URL

    if (response.status === 404) {
      // Handle 404 error: Redirect to 404 page
      window.location.href = '/404.html';
      }
    else
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    else
    {
      const data = await response.json();
      displayPage(data);
    }
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

function displayPage(data) {
  const resultContainer = document.getElementById('resultContainer');
  resultContainer.innerHTML = ''; // Clear previous results

  if (data && data.content && Array.isArray(data.content)) {
    // Assuming data.content is an array of objects
    data.content.forEach(item => {
      const div = document.createElement('div');
      div.textContent = JSON.stringify(item); // Convert item to string for display purposes
      resultContainer.appendChild(div);
    });

    // Display pagination info if needed
    const paginationInfo = document.createElement('div');
    paginationInfo.textContent = `Page: ${data.page.number + 1} of ${data.page.totalPages}, Total items: ${data.page.totalElements}`;
    resultContainer.appendChild(paginationInfo);
  } else {
    // Handle cases where data.content is not an array
    const div = document.createElement('div');
    div.textContent = 'No content available';
    resultContainer.appendChild(div);
  }
}
