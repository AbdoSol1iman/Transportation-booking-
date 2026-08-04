const testRegister = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Ahmed Passenger',
        email: 'ahmed_register_test_' + Date.now() + '@example.com',
        phone: '010' + Math.floor(10000000 + Math.random() * 90000000),
        password: 'Password123',
        role: 'passenger',
      }),
    });

    const data = await res.json();
    console.log('STATUS:', res.status);
    console.log('RESPONSE:', data);
  } catch (err) {
    console.error('FETCH ERROR:', err);
  }
};

testRegister();
