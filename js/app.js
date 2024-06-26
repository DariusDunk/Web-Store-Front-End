// script.js
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
