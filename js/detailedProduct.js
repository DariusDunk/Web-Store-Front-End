document.addEventListener('DOMContentLoaded', function() {
  // Define the properties for the navigation panel
  const homeLink = '<a href="MainPage.html">Начало</a>';
  const searchParams = new URLSearchParams(window.location.search);//TODO delete
  console.log("query params:");

  for (const param of searchParams) {
    console.log(param);
  }
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
    console.log(`BackendURL: ${backendUrl}`);
    fetch(backendUrl)
      .then(response => response.json())
      .then(data => {
        // Assuming the response data has a structure like { category: 'Category Name', name: 'Product Name', ... }
        const category = data.categoryName;
        const name = data.name;

        // Update the navigation text
        const updatedCategoryLink = `<a href="Manufacturers_products.html?category=${category}&p=0">${category}</a>`;
        document.getElementById('navigation-text').innerHTML = `${homeLink} / ${updatedCategoryLink} / ${name}`;
        // Update the product details section
        updateProductDetails(data);
      })
      .catch(error => {
        console.error('Error fetching product information:', error);
        // Handle error appropriately
      });
  }

  // Function to update the product details section
  function updateProductDetails(productData) {
    // Example of updating product details, you can customize this
    const productDetailsDiv = document.querySelector('.product-details');
    productDetailsDiv.innerHTML = `
            <h1>${productData.name}</h1>
            <p>Category: ${productData.category}</p>
            <p>Description: ${productData.description}</p>
            <p>Price: $${productData.price}</p>
            <!-- Add more product information as needed -->
        `;
  }

  // Fetch product information if productCode is present
  if (productCode) {
    fetchProductInfo(productCode);
  } else {
    console.error('No product code found in URL');
    // Handle the case where productCode is not present in the URL
  }
});
