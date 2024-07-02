document.addEventListener('DOMContentLoaded', function categoryNames() {
  const categoryMenu = document.getElementById('category-menu');

  fetch(`${Proxy_Url}/category/names`) // Replace with your API endpoint
    .then(response => response.json())
    .then(data => {
      data.forEach(item => {
        const a = document.createElement('a');
        // a.href = item; // Adjust based on your API response
        a.href = `Products.html?category=${item}&p=1`; // Adjust based on your API response
        a.textContent = item; // Adjust based on your API response
        categoryMenu.appendChild(a);
      });
    })
    .catch(error => {
      console.error('Error fetching menu items:', error);
    });
});
function toggleDropdown() {
  const dropdown = document.getElementById('userDropdown');
  dropdown.classList.toggle('show');
}
window.onclick = function(event) {
  if (!event.target.matches('.profile-container') && !event.target.matches('.username') && !event.target.matches('.profile-image')) {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown.classList.contains('show')) {
      dropdown.classList.remove('show');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const searchBar = document.getElementById('search_bar');
  const searchDropdown = document.getElementById('search_dropdown');
  const searchButton = document.getElementById('search_button');

  searchBar.addEventListener('input', async () => {
    const query = searchBar.value.trim();
    if (query.length >= 3) {
      try {
        const searchBarValue = searchBar.value.valueOf();
        // const response = await fetch(`${Proxy_Url}/product/suggest?name=${(searchBar.value)}`);
        console.log(`fetch url: ${Proxy_Url}/product/suggest/${searchBarValue}`);
        const response = await fetch(`${Proxy_Url}/product/suggest/${searchBarValue}`);
        const result = await response.json();

        if (result.length > 0) {
          searchDropdown.innerHTML = '';
          result.forEach(item => {
            const div = document.createElement('div');
            div.className = 'search_dropdown-item';
            div.textContent = item;
            searchDropdown.appendChild(div);
          });
          searchDropdown.style.display = 'block';
        } else {
          searchDropdown.style.display = 'none';
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
        searchDropdown.style.display = 'none';
      }
    } else {
      searchDropdown.style.display = 'none';
    }
  });
  document.addEventListener('click', (event) => {
    if (!searchBar.contains(event.target)) {
      searchBar.blur();
      searchDropdown.style.display = 'none';
    }
  });
  searchDropdown.addEventListener('click', (event) => {
    event.stopPropagation();
    searchBar.value = event.target.textContent;//TODO add redirect to product detailed
    searchStart(searchBar);
    searchDropdown.style.display = 'none';
  });

  searchButton.addEventListener('click', async()  => {
    searchStart(searchBar);
  });

});

function searchStart(searchBar) {
  const searchBarText = searchBar.value.valueOf();
  window.location.href = `Products.html?search=${encodeURIComponent(searchBarText)}&page=0`;
}
