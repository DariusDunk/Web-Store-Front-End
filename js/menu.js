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
