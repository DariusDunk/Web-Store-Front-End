// script.js

const Proxy_Url = 'http://localhost:3000';

async function getProducts() {
  const manufacturerName = "Gardenia"; // Replace with actual manufacturer name
  const manufacturerId = "2"; // Replace with actual manufacturer ID
  const page = 0; // Replace with the actual page number as needed
  const url = `${Proxy_Url}/product/manufacturer/${manufacturerName}-${manufacturerId}/p${page}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const products = data.content;

    const productContainer = document.getElementById('productContainer');
    productContainer.innerHTML = ''; // Clear existing products
    products.forEach(product => {
      const productDiv = document.createElement('div');
      productDiv.classList.add('product');

      const productLink = document.createElement('a');
      productLink.href = `product-details.html?productCode=${product.productCode}`;

      const productImage = document.createElement('img');
      productImage.src = product.imageUrl;
      productLink.appendChild(productImage);

      const productName = document.createElement('div');
      productName.classList.add('product-name');
      productName.textContent = product.name;
      productLink.appendChild(productName);

      const ratingContainer = document.createElement('div');
      ratingContainer.classList.add('rating-container');

      let rating = 0;
      let totalStars = 0;

      if (product.rating !== 0) {
        rating = product.rating / 10;
        totalStars = Math.min(Math.ceil(rating), 5);
      }

      // Display a maximum of 5 stars

      // Full stars
      if (rating !== 0) {
        for (let i = 0; i < Math.floor(rating); i++) {
          const starIcon = document.createElement('span');
          starIcon.classList.add('star', 'full');
          ratingContainer.appendChild(starIcon);
        }

        // Half star if needed
        if (rating % 1 !== 0) {
          const starIcon = document.createElement('span');
          starIcon.classList.add('star', 'half');
          ratingContainer.appendChild(starIcon);
        }
      }
      // Empty stars to make up 5 stars
      for (let i = 0; i < 5 - totalStars; i++) {
        const starIcon = document.createElement('span');
        starIcon.classList.add('star', 'empty');
        ratingContainer.appendChild(starIcon);
      }

      // Add review count
      const reviewCount = document.createElement('span');
      reviewCount.classList.add('review-count');
      reviewCount.textContent = `(${product.reviewCount})`;
      ratingContainer.appendChild(reviewCount);

      // Append rating container
      productLink.appendChild(ratingContainer);

      // Add price elements
      if (product.originalPriceStotinki !== product.salePriceStotinki) {
        const originalPrice = document.createElement('div');
        originalPrice.classList.add('product-original-price');
        originalPrice.textContent = (product.originalPriceStotinki / 100).toFixed(2) + ' лв';
        productLink.appendChild(originalPrice);
      }

      const salePrice = document.createElement('div');
      salePrice.classList.add('product-price');
      salePrice.textContent = (product.salePriceStotinki / 100).toFixed(2) + ' лв';
      productLink.appendChild(salePrice);

      productDiv.appendChild(productLink);
      productContainer.appendChild(productDiv);
    });
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

