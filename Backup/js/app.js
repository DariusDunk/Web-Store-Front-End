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

document.addEventListener("DOMContentLoaded", () => {
  getProducts();
});

// function getProducts() {
//   const manufacturerName = "exampleName"; // Replace with actual manufacturer name
//   const manufacturerId = 123; // Replace with actual manufacturer ID
//   const page = 1; // Replace with actual page number
//
//   fetch(`http://localhost:3000/product/manufacturer/${manufacturerName}-${manufacturerId}/p${page}`)
//     .then((response) => response.json())
//     .then((data) => displayProducts(data.content))
//     .catch((error) => console.error("Error fetching products:", error));
// }

function displayProducts(products) {
  const container = document.querySelector(".products-container");
  container.innerHTML = ""; // Clear previous products

  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");

    const productLink = document.createElement("a");
    productLink.href = `product/${product.productCode}`; // Replace with actual product page link
    productLink.style.textDecoration = "none";
    productLink.style.color = "inherit";

    const img = document.createElement("img");
    img.src = product.imageUrl;
    img.alt = product.name;

    const name = document.createElement("div");
    name.classList.add("product-name");
    name.textContent = product.name;

    const price = document.createElement("div");
    price.classList.add("product-price");
    if (product.originalPriceStotinki !== product.salePriceStotinki) {
      const originalPrice = document.createElement("div");
      originalPrice.classList.add("product-original-price");
      originalPrice.textContent = (product.originalPriceStotinki / 100).toFixed(2) + " лв.";
      price.appendChild(originalPrice);
    }
    price.appendChild(document.createTextNode((product.salePriceStotinki / 100).toFixed(2) + " лв."));

    productLink.appendChild(img);
    productLink.appendChild(name);
    productLink.appendChild(price);

    productDiv.appendChild(productLink);
    container.appendChild(productDiv);
  });
}

async function getProducts() {
  const manufacturerName = "Gardenia"; // Replace with actual manufacturer name
  const manufacturerId = "2"; // Replace with actual manufacturer ID
  const page = 0; // Replace with the actual page number as needed
  const url = `http://localhost:3000/product/manufacturer/${manufacturerName}-${manufacturerId}/p${page}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const products = data.content;

    const productContainer = document.getElementById('productContainer');
    productContainer.innerHTML = ''; // Clear existing products

    products.forEach(product => {
      const productDiv = document.createElement('div');
      productDiv.classList.add('product');

      const productImage = document.createElement('img');
      productImage.src = product.imageUrl;
      productDiv.appendChild(productImage);

      const productName = document.createElement('div');
      productName.classList.add('product-name');
      productName.textContent = product.name;
      productDiv.appendChild(productName);

      if (product.originalPriceStotinki !== product.salePriceStotinki) {
        const originalPrice = document.createElement('div');
        originalPrice.classList.add('product-original-price');
        originalPrice.textContent = (product.originalPriceStotinki / 100).toFixed(2) + ' лв';
        productDiv.appendChild(originalPrice);
      }

      const salePrice = document.createElement('div');
      salePrice.classList.add('product-price');
      salePrice.textContent = (product.salePriceStotinki / 100).toFixed(2) + ' лв';
      productDiv.appendChild(salePrice);

      productDiv.addEventListener('click', () => {
        // Add your functionality here when a product is clicked
        console.log(`Product ${product.productCode} clicked`);
      });

      productContainer.appendChild(productDiv);
    });
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}
