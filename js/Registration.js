const Proxy_Url = 'http://localhost:3000';
document.getElementById('registrationForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  document.getElementById('emailError').style.display = 'none';
  document.getElementById('usernameError').style.display = 'none';
  document.getElementById('passwordError').style.display = 'none';

  const email = document.getElementById('email').value;
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch(`${Proxy_Url}/customer/registration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userName: username,
        email: email,
        password: password })
    });

    const result = await response.text();

    console.log(`result status: ${response.statusText}`);
    console.log(`result text: ${result}`);

    if (response.status.valueOf() === 201) {
      alert(result);
      window.location.href = 'Login.html';
    } else {
      if (response.status.valueOf() === 400)
        {
          document.getElementById('passwordError').innerText = result;
          document.getElementById('passwordError').style.display = 'block';
        }
      else if (response.status===409) {
          document.getElementById('emailError').innerText = result;
          document.getElementById('emailError').style.display = 'block';
        }
      }
  } catch (error) {
    console.error('Error:', error);
    alert('An unexpected error occurred');
  }
});
