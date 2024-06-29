const Proxy_Url = 'http://localhost:3000';

async function getProducts(page=0) {
  const manufacturerName = "Gardenia"; // Replace with actual manufacturer name

  if (typeof page!='number'){
    page=0;
  }

  const url = `${Proxy_Url}/product/manufacturer/${manufacturerName}/p${page}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const products = data.content;
    const totalPages = data.page.totalPages;

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
    updatePagination(totalPages-1, page);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

function updatePagination(lastPage, currentPage) {
  const paginationContainer = document.getElementById('paginationContainer');
  paginationContainer.innerHTML = ''; // Clear existing pagination

  const pagination = document.createElement('div');
  pagination.classList.add('pagination');

  // First page button
  const prevDoubleButton = document.createElement('span');
  prevDoubleButton.innerHTML = '&lt;&lt;';
  prevDoubleButton.classList.add('pagination-button');
  if (currentPage === 0) {
    prevDoubleButton.classList.add('disabled');
  } else {
    prevDoubleButton.addEventListener('click', () => {
      getProducts(0);
    });
  }
  pagination.appendChild(prevDoubleButton);

  // Previous page button
  const prevButton = document.createElement('span');
  prevButton.innerHTML = '&lt;';
  prevButton.classList.add('pagination-button');
  if (currentPage === 0) {
    prevButton.classList.add('disabled');
  } else {
    prevButton.addEventListener('click', () => {
      getProducts(currentPage - 1);
    });
  }
  pagination.appendChild(prevButton);

  let maxPrevPages = 0;
  let maxNextPages = 0;
  if (currentPage-2>=0){
    maxPrevPages = 2;
  }
  else if (currentPage-1>=0)
  {
    maxPrevPages = 1;
  }

  if (currentPage+2<=lastPage){
    maxNextPages = 2;
  }
  else if (currentPage+1<=lastPage){
    maxNextPages = 1;
  }

  //prev 2 pages
  if (maxPrevPages) {
    for (let i = 1; i <= maxPrevPages; i++) {
      const pageButton = document.createElement('span');
      pageButton.textContent = currentPage + 1 - i;
      pageButton.classList.add('pagination-button');
      pageButton.addEventListener('click', () => {
        getProducts(currentPage - i);
      });

      pagination.appendChild(pageButton);
    }
  }

    //Current Page
  const currentPageVisual = document.createElement('span');
  currentPageVisual.textContent = currentPage+1;
  currentPageVisual.classList.add('pagination-button');
  currentPageVisual.classList.add('disabled');
  currentPageVisual.classList.add('pagination-button-current')
  pagination.appendChild(currentPageVisual)

  //next 2 pages
  if (maxNextPages) {
    for (let i = 1; i <= maxNextPages; i++) {
      const pageButton = document.createElement('span');
      pageButton.textContent = currentPage+1 + i;
      pageButton.classList.add('pagination-button');
      pageButton.addEventListener('click', () => {
          getProducts(currentPage+i);
        });

      pagination.appendChild(pageButton);
    }
  }

  // Next page button
  const nextButton = document.createElement('span');
  nextButton.innerHTML = '&gt;';
  nextButton.classList.add('pagination-button');
  if (currentPage === lastPage) {
    nextButton.classList.add('disabled');
  } else {
    nextButton.addEventListener('click', () => {
      getProducts(currentPage + 1);
    });
  }
  pagination.appendChild(nextButton);

  // Next double arrow button
  const nextDoubleButton = document.createElement('span');
  nextDoubleButton.innerHTML = '&gt;&gt;';
  nextDoubleButton.classList.add('pagination-button');
  if (currentPage === lastPage) {
    nextDoubleButton.classList.add('disabled');
  } else {
    nextDoubleButton.addEventListener('click', () => {
      getProducts(lastPage);
    });
  }
  pagination.appendChild(nextDoubleButton);
  paginationContainer.appendChild(pagination);
}

function loadProducts(mode,params) {
  let apiUrl = '';
  switch (mode) {
    case 'manufacturer':
       apiUrl = `${Proxy_Url}/product/manufacturer/${params[0]}/p${params[1]}`;
      break;
    case 'category':
      const categoryId = urlParams.get('categoryId');
      apiUrl = `/api/products?category=${categoryId}`;
      break;
    case 'search':
      const searchTerm = urlParams.get('searchTerm');
      apiUrl = `/api/products?search=${searchTerm}`;
      break;
    case 'filter':
      const filterQuery = urlParams.get('filterQuery');
      apiUrl = `/api/products?filter=${filterQuery}`;
      break;
    default:
      apiUrl = `${Proxy_Url}/product/manufacturer/${params[0]}/p${params[1]}`;
      break;
  }

  fetch(apiUrl)
    .then(response => response.json())
    .then(products => displayProducts(products))
    .catch(error => console.error('Error loading products:', error));
}
