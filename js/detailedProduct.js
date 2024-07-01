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
    const backendUrl = `${Proxy_Url}/product/${productCode}?id=6`; //TODO session storage for id
    fetch(backendUrl)
      .then(response => response.json())
      .then(data => {
        // Assuming the response data has a structure like { category: 'Category Name', name: 'Product Name', ... }
        const category = data.categoryName;
        const name = data.name;

        // Update the navigation text
        const updatedCategoryLink = `<a href="Products.html?category=${category}&p=1">${category}</a>`;
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
    document.title = productData.name;
    // Create the image div and insert the first product image
    const productImageDiv = document.createElement('div');
    productImageDiv.classList.add('product-image');
    const productImage = document.createElement('img');
    if (productData.productImages.length > 0) {
      productImage.src = productData.productImages[0].imageFileName;
    }
    productImage.alt = productData.name;
    productImageDiv.appendChild(productImage);

    // Create a container for the attributes and description
    const detailsContainerDiv = document.createElement('div');
    detailsContainerDiv.classList.add('details-container');

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
    manufacturerLink.href = `Products.html?manufacturer=${productData.manufacturer}&p=1`; // Add the redirect link here
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

    // Create the description container div
    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('product-description');

    // Split the product description by "\n" and add each part as a paragraph
    const descriptionParts = productData.productDescription.split('\n');
    descriptionParts.forEach(part => {
      const paragraphElement = document.createElement('p');
      paragraphElement.textContent = part;
      descriptionDiv.appendChild(paragraphElement);
    });

    // Append the attributes and description divs to the details container
    detailsContainerDiv.appendChild(attributesDiv);
    detailsContainerDiv.appendChild(descriptionDiv);

    // Create the buttons container div
    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('product-buttons');

    // Create the favorites button
    const favoritesButton = document.createElement('button');
    favoritesButton.classList.add('favorites-button');
    favoritesButton.innerHTML = '<i class="unfilled-heart-icon"></i> Добави в любими';

    // Create the cart button
    const cartButton = document.createElement('button');
    cartButton.classList.add('cart-button');
    cartButton.innerHTML = '<i class="cart-icon"></i> Добави към количката';

    // Append buttons to the buttons container
    buttonsDiv.appendChild(favoritesButton);
    buttonsDiv.appendChild(cartButton);

    // Append the buttons container to the details container
    detailsContainerDiv.appendChild(buttonsDiv);

    // Append the image div and the details container to the main container
    productDetailsDiv.appendChild(productImageDiv);
    productDetailsDiv.appendChild(detailsContainerDiv);

    // Event listeners and fetch POST request handling
    favoritesButton.addEventListener('click', async () => {
      let response;
      let requestBody = JSON.stringify({
        customerId: 6,
        productCode: productData.productCode
      });
      if (favoritesButton.classList.contains('active')) {
        response = await fetch(`${Proxy_Url}/customer/removefav`, {
          method: 'DELETE',
          body: requestBody,
          headers: {'Content-Type': 'application/json'}
        });
      } else {
        response = await fetch(`${Proxy_Url}/customer/addfavourite`, {
            method: 'POST',
            body: requestBody,
            headers: {'Content-Type': 'application/json'}
          }
        )
      }
      const message = await response.text();
      alert(message);
      if (response.ok) {
        if (favoritesButton.classList.contains('active')) {
          favoritesButton.classList.remove('active');
          favoritesButton.innerHTML = '<i class="unfilled-heart-icon"></i> Добави в любими';
        }
       else {
          favoritesButton.classList.add('active');
          favoritesButton.innerHTML = '<i class="filled-heart-icon"></i> Премахни от любими';
      }
    }
    });

    cartButton.addEventListener('click', async () => {
      let productQuantity;
      if (cartButton.classList.contains('active'))
      {
        productQuantity=0;
      }
      else
      {
        productQuantity=1;
      }
      const response = await fetch(`${Proxy_Url}/customer/addtocart`, {
        method: 'POST',
        body: JSON.stringify({
          customerProductPairRequest: {
            customerId: 6,
            productCode: productData.productCode,
          },
          quantity: productQuantity
        }),
        headers: {'Content-Type': 'application/json'}
      });
      const message = await response.text();
      alert(message);

      if (response.ok) {
        if (cartButton.classList.contains('active')) {
          cartButton.classList.remove('active');
          // cartButton.style.backgroundColor = '';
          cartButton.innerHTML = '<i class="cart-icon"></i> Добави към количката';
        } else {
          cartButton.classList.add('active');
          // cartButton.style.backgroundColor = 'green';
          cartButton.innerHTML = '<i class="cart-icon"></i> Премахни от количката';
        }
      }
    });

    if (productData.inFavourites) {
      favoritesButton.classList.add('active');
      favoritesButton.innerHTML = '<i class="filled-heart-icon"></i> Премахни от любими';
    }

    // Initial state check for the cart button
    if (productData.inCart) {
      cartButton.classList.add('active');
      // cartButton.style.backgroundColor = 'green';
      cartButton.innerHTML = '<i class="cart-icon"></i> Премахни от количката';
    }
  }

  // Fetch product information if productCode is present
  if (productCode) {
    fetchProductInfo(productCode);
  } else {
    console.error('No product code found in URL');
    // Handle the case where productCode is not present in the URL
  }
});
