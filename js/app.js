// script.js
async function fetchData() {
  try {
    const response = await fetch('http://localhost:3000/getDataFromBackend'); // Replace with your endpoint URL
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    const data = await response.json();
    displayData(data);
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
