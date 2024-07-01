const Proxy_Url = 'http://localhost:3000';
document.addEventListener('DOMContentLoaded', function() {
  // Define the properties for the navigation panel
  const homeLink = '<a href="MainPage.html">Начало</a>';
  // Function to get query parameters
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }
  // Get the productCode from the URL
  const productCode = getQueryParam('productCode');

  // Function to fetch product information from the backend
  function fetchProductInfo(productCode) {
    const backendUrl = `${Proxy_Url}/product/${productCode}?id=6`; // Replace '12345' with the appropriate ID if needed
    fetch(backendUrl)
      .then(response => response.json())
      .then(data => {
        // Assuming the response data has a structure like { category: 'Category Name', name: 'Product Name', ... }
        const category = data.categoryName;
        const name = data.name;
        // Update the navigation text
        const updatedCategoryLink = `<a href="Manufacturers_products.html?category=${category}&p=1">${category}</a>`;
        document.getElementById('navigation-text').innerHTML = `${homeLink} / ${updatedCategoryLink} / ${name}`;
        // Update the product details section
        updateProductDetails(data);
      })
      .catch(error => {
        console.error('Error fetching product information:', error);
        // Handle error appropriately
      });
  }

  function updateProductDetails(productData) {
    // Select the product details container
    const productDetailsDiv = document.querySelector('.product-details');

    // Clear any existing content
    productDetailsDiv.innerHTML = '';

    // Create the image div and insert the first product image
    const productImageDiv = document.createElement('div');
    productImageDiv.classList.add('product-image');
    const productImage = document.createElement('img');
    if (productData.productImages.length > 0) {
      productImage.src = productData.productImages[0].imageFileName;
    }
    productImage.alt = productData.name;
    productImageDiv.appendChild(productImage);

    // Create the attributes container div
    const attributesDiv = document.createElement('div');
    attributesDiv.classList.add('product-attributes');

    // Add the basic product details
    const nameElement = document.createElement('h1');
    nameElement.textContent = productData.name;
    attributesDiv.appendChild(nameElement);

    const modelElement = document.createElement('p');
    const modelLabel = document.createElement('b');
    const modelText = document.createTextNode(productData.model);
    modelLabel.textContent = "Модел: ";
    modelElement.appendChild(modelLabel);
    modelElement.appendChild(modelText);
    attributesDiv.appendChild(modelElement);

    const manufacturerElement = document.createElement('p');
    const manufacturerLink = document.createElement('a');
    const manufacturerLabel = document.createElement('b');
    manufacturerLabel.textContent = "Производител: ";
    manufacturerElement.appendChild(manufacturerLabel);
    manufacturerLink.href = `Manufacturers_products.html?manufacturer=${productData.manufacturer}&p=1`; // Add the redirect link here
    manufacturerLink.textContent = productData.manufacturer;
    manufacturerElement.appendChild(manufacturerLink);
    attributesDiv.appendChild(manufacturerElement);

    // Iterate through the attributes list and add each attribute
    productData.attributes.forEach(attribute => {
      const attributeElement = document.createElement('p');

      // Create a bold element for the attribute name
      const boldAttributeName = document.createElement('b');
      boldAttributeName.textContent = attribute.attributeName.attributeName;

      if (attribute.attributeName.measurementUnit === null) {
        // Append the bold attribute name and the option to the paragraph element
        attributeElement.appendChild(boldAttributeName);
        attributeElement.appendChild(document.createTextNode(`: ${attribute.attributeOption}`));
      } else {
        // Append the bold attribute name, option, and measurement unit to the paragraph element
        attributeElement.appendChild(boldAttributeName);
        attributeElement.appendChild(document.createTextNode(`: ${attribute.attributeOption} ${attribute.attributeName.measurementUnit}`));
      }

      attributesDiv.appendChild(attributeElement);
    });

    // Append both divs to the main container
    productDetailsDiv.appendChild(productImageDiv);
    productDetailsDiv.appendChild(attributesDiv);
  }

  // Fetch product information if productCode is present
  if (productCode) {
    fetchProductInfo(productCode);
  } else {
    console.error('No product code found in URL');
    // Handle the case where productCode is not present in the URL
  }
});
