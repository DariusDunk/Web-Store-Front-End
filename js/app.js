const Proxy_Url = 'http://localhost:3000';

async function getProducts(url) {
  try {
    const response = await fetch(url);
    console.log(`Fetch url: ${url}`);
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

    let urlContents = url.split("/");

    const page = urlContents[urlContents.length - 1].substring(1);
    console.log(`current page: ${page}`);

    updatePagination(totalPages - 1, parseInt(page));
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

function updatePagination(lastPage, currentPage) {
  const paginationContainer = document.getElementById('paginationContainer');
  paginationContainer.innerHTML = ''; // Clear existing pagination

  let url = sessionStorage.getItem("product_url");

  let urlContents = url.split('/');

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

      urlContents[urlContents.length - 1] = `p${0}`;
      url = urlContents.join("/");
      getProducts(url);
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
      urlContents[urlContents.length - 1] = `p${currentPage - 1}`;
      url = urlContents.join("/");
      getProducts(url);
    });
  }
  pagination.appendChild(prevButton);

  let maxPrevPages = 0;
  let maxNextPages = 0;
  if (currentPage - 2 >= 0) {
    maxPrevPages = 2;
  } else if (currentPage - 1 >= 0) {
    maxPrevPages = 1;
  }

  if (currentPage + 2 <= lastPage) {
    maxNextPages = 2;
  } else if (currentPage + 1 <= lastPage) {
    maxNextPages = 1;
  }

  //prev 2 pages
  if (maxPrevPages) {
    for (let i = 1; i <= maxPrevPages; i++) {
      const pageButton = document.createElement('span');
      const currPageNum = parseInt(currentPage) + 1 - i;
      pageButton.textContent = currPageNum;
      pageButton.classList.add('pagination-button');
      pageButton.addEventListener('click', () => {
        urlContents[urlContents.length - 1] = `p${currentPage - i}`;
        url = urlContents.join("/");
        getProducts(url);
      });
      pagination.appendChild(pageButton);
    }
  }
  //Current Page
  const currentPageVisual = document.createElement('span');
  currentPageVisual.textContent = parseInt(currentPage) + 1;
  currentPageVisual.classList.add('pagination-button');
  currentPageVisual.classList.add('disabled');
  currentPageVisual.classList.add('pagination-button-current')
  pagination.appendChild(currentPageVisual)

  //next 2 pages
  if (maxNextPages) {
    for (let i = 1; i <= maxNextPages; i++) {
      const pageButton = document.createElement('span');
      const currPageNum = parseInt(parseInt(currentPage) + 1 + i);
      pageButton.textContent = currPageNum;
      pageButton.classList.add('pagination-button');
      pageButton.addEventListener('click', () => {
        console.log(`page num inside action listener : ${currPageNum}`);
        urlContents[urlContents.length - 1] = `p${currPageNum - 1}`;
        url = urlContents.join("/");
        getProducts(url);
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
      urlContents[urlContents.length - 1] = `p${currentPage + 1}`;
      url = urlContents.join("/");
      getProducts(url);
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
      urlContents[urlContents.length - 1] = `p${lastPage};`
      url = urlContents.join("/");
      getProducts(url);
    });
  }
  pagination.appendChild(nextDoubleButton);
  paginationContainer.appendChild(pagination);
}


document.addEventListener('DOMContentLoaded', modeHandler());

function modeHandler() {

  // Get the current URL path
  const path = window.location.pathname;
  let searchParams = new URLSearchParams(window.location.search);

  console.log("With for() ");

  for (const param of searchParams) {
    console.log(param);
  }
  console.log("Without for() ");

  const paramEntries = searchParams.entries();

  let modeQueryPair = paramEntries.next().value;
  console.log(modeQueryPair);
  const mode = modeQueryPair[0];
  const modeDetails = modeQueryPair[1];
  let pageQueryPair = paramEntries.next().value;
  console.log(pageQueryPair);
  const page = pageQueryPair[1];
  let fetchUrl = ``;

  switch (mode) {
    case "manufacturer":
      // sessionStorage.setItem("product_url",`${Proxy_Url}/product/manufacturer/${modeDetails}/p${page}`);
      fetchUrl = `${Proxy_Url}/product/manufacturer/${modeDetails}/p${page}`;
      break;
    case "category":
      // sessionStorage.setItem("product_url",);
      fetchUrl = `${Proxy_Url}/product/category/${modeDetails}/p${page}`;
      break;
    case "search":
      fetchUrl = [urlParams.get('searchTerm')];
      break;
    case "filter":
      fetchUrl = [urlParams.get('filterQuery')];
      break;
    default:
      // sessionStorage.setItem("product_url",);
      fetchUrl = `${Proxy_Url}/product/manufacturer/Gardenia/p0`;
      break;
  }
  console.log(`URL: ${fetchUrl.valueOf()}`);
  getProducts(fetchUrl);
  // console.log(`query params: ${paramVal[0]}`);
  //
  // for (const param of searchParams) {
  //   console.log(param);
  // }

  // const mode = find(searchParams.keys());


  // if (path.includes("/EComerseWebsite/Manufacturers_products.html"))
  // {
  //   // Define an array to hold the parameters needed for each mode
  //   let url = ``;
  //   const modeDetails = sessionStorage.getItem("product_page_details");
  //   // Populate the params array based on the mode
  //   switch (sessionStorage.getItem("product_page_mode")) {
  //     case "manufacturer":
  //       sessionStorage.setItem("product_url",`${Proxy_Url}/product/manufacturer/${modeDetails}/p${page}`);
  //       // url = `${Proxy_Url}/product/manufacturer/${modeDetails}/p${page}`;
  //       break;
  //     case "category":
  //       sessionStorage.setItem("product_url",`${Proxy_Url}/product/category/${modeDetails}/p${page}`);
  //       break;
  //     case "search":
  //       url = [urlParams.get('searchTerm')];
  //       break;
  //     case "filter":
  //       url = [urlParams.get('filterQuery')];
  //       break;
  //     default:
  //       sessionStorage.setItem("product_url",`${Proxy_Url}/product/manufacturer/Gardenia/p0`);
  //       break;
  //   }
  //   url = sessionStorage.getItem("product_url");
  //
  // }

}


//TODO preimenuvai na products.js ili ne6to i smeni izvikvaniqta v drugite fajlove
