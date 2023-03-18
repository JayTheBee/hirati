import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import classes from './AuthForm.module.scss';

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const login = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      await axios.post('/api/auth/login', {
        email,
        password,
      });
      navigate('/');
    } catch (error) {
      if (
        error.response && error.response.status >= 400 && error.response.status <= 500
      ) {
        setError(error.response.data.message);
        toast.error('Something went wrong');
      }
    }
  };

  const register = async () => {
    navigate('/register');
  };

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>Login</h1>
      <form className={classes.authForm} onSubmit={login}>
        <label htmlFor="email">
          Email:
          <input name="email" type="email" placeholder="email" required />
        </label>
        <br />
        <label htmlFor="password">
          Password:
          <input
            name="password"
            type="password"
            placeholder="password"
            required
          />
        </label>
        <br />
        <button type="submit">Login</button>

      </form>
      <div>
        <p>
          New here?
          <p className={classes.register} onClick={register}>Register</p>
        </p>

      </div>
      {error && <div className={classes.error_msg}>{error}</div>}
    </div>
  );
}

export default Login;
