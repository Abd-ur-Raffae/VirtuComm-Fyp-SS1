import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const SignIn = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const csrftoken = document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1];
    axios.defaults.headers.common['X-CSRFToken'] = csrftoken;
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/api/login/', formData, {
        withCredentials: true,
      });

      if (response.status === 200) {
        console.log('Logged in successfully:', response.data);
        const user = {
          username: response.data.username || formData.username, // Use backend username, fallback to form
        };
        sessionStorage.setItem('user', JSON.stringify(user));
        const redirectTo = location.state?.from || '/home';
        navigate(redirectTo);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.error || 'Login failed. Please try again.');
        console.error('Login error:', error.response.data);
      } else {
        setError('Network error. Please try again later.');
        console.error('Network error:', error);
      }
    }
  };

  return (
    <div className="main">
      <link rel="stylesheet" href="/css/SignIn.css" />
      <p className="sign" align="center">Sign in</p>
      <form className="form1" onSubmit={handleSubmit}>
        <input
          className="un"
          type="text"
          name="username"
          align="center"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          className="pass"
          type="password"
          name="password"
          align="center"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="submit" align="center">
          Sign in
        </button>
        <p className="forgot" align="center">
          <a href="#">Forgot Password?</a>
        </p>
      </form>
      {error && <p className="error" align="center">{error}</p>}
      <br />
      <p className="forgot" align="center">
        <a href="/register">Don't have an account?</a>
      </p>
    </div>
  );
};

export default SignIn;