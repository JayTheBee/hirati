import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import classes from './AuthForm.module.scss';

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [forgot, setForgot] = useState(false);
  const [loading, setLoading] = useState(false);

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

  // Axios Call to mail
  const forgotHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (e.target.forgotEmail.value == '') {
      toast.error('Please Enter Valid Email!');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      await axios.post(
        '/api/auth/forgot',
        { email: e.target.forgotEmail.value },
      );
      toast.success('Email Sent! ');
    } catch (error) {
      setError(error.response.data.message);
      toast.error('Something went wrong');
    }
    setForgot(false);
    setLoading(false);
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
        </p>
        <p className={classes.register} onClick={register}>Register</p>
        <p className={classes.register} onClick={() => setForgot(!forgot)}>Forgot Password?</p>
        {forgot && (
          <form className=" d-flex  align-content-center forgot justify-content-center" onSubmit={forgotHandler}>
            <input className="round rounded p-3 fs-4" name="forgotEmail" id="forgotEmail" type="email" style={{ border: '0px', borderRadius: '10px' }} placeholder="Enter Email" />
            <button className="bg-success rounded-start text-white p-4" style={{ border: '0px', borderRadius: '10px' }} type="submit" disabled={loading}>Send</button>
          </form>
        )}

      </div>
      {error && <div className={classes.error_msg}>{error}</div>}
    </div>
  );
}

export default Login;
