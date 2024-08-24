let Proxy_Url = 'http://localhost:3000';
document.addEventListener('DOMContentLoaded', function() {
  if (sessionStorage.getItem('customerId') && sessionStorage.getItem('customerName')) {
    window.location.href = 'MainPage.html';
  }

  document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    document.getElementById('emailError').style.display = 'none';
    document.getElementById('passwordError').style.display = 'none';

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch(`${Proxy_Url}/customer/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          {
            email: email,
          password: password
          })
      });

      const result = await response.text();

      if (response.status === 202) {
        const data = JSON.parse(result);
        sessionStorage.setItem('customerId', data.customerId);
        sessionStorage.setItem('customerName', data.customerName);
        window.location.href = 'MainPage.html';
      } else if (response.status === 401) {
        document.getElementById('emailError').innerText = 'Грешнен имейл или парола';
        document.getElementById('emailError').style.display = 'block';
      } else {
        alert('An unexpected error occurred');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An unexpected error occurred');
    }
  });
});
