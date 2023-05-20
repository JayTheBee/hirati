import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { set } from 'mongoose';
import classes from './AuthForm.module.scss';

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Axios Call to mail
  const resetHandler = async (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get('id');
    const token = queryParams.get('token');
    console.log(e.target.confirmPass.value);
    console.log(e.target.password.value);
    const passwordPattern = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/;
    if (!passwordPattern.test(e.target.password.value)) {
      toast.error('Password requirements:\n8-20 characters, \n1-number, \n1-letter, \n1 symbol');
      return;
    }

    if (e.target.confirmPass.value === e.target.password.value) {
      console.log('accepted');
      setLoading(true);
      try {
        await axios.post(
          '/api/auth/reset',
          { id, token, password: e.target.password.value },
        );
        toast.success('Password Changed successfuly! ');
        toast.success('Redirecting to Homepage in 3 seconds');
        await new Promise((resolve) => setTimeout(resolve, 3000));
        setLoading(false);
        navigate('/');
      } catch (error) {
        setError(error.response.data.message);
        toast.error('Something went wrong');
        setLoading(false);
      }
    } else {
      toast.error('Please Enter the same Password!');
    }

    // if (e.target.forgotEmail.value == '') {
    //   toast.error('Please Enter Valid Email!');
    //   setLoading(false);
    //   return;
    // }
    // try {
    //   setLoading(true);
    //   await axios.post(
    //     '/api/auth/forgot',
    //     { email: e.target.forgotEmail.value },
    //   );
    //   toast.success('Email Sent! ');
    // } catch (error) {
    //   setError(error.response.data.message);
    //   toast.error('Something went wrong');
    // }
    // setForgot(false);
    // setLoading(false);
  };

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>RESET PASSWORD</h1>
      <form className={classes.authForm} onSubmit={resetHandler}>
        <label htmlFor="password">
          Password:
          <input
            name="password"
            id="password"
            type="password"
            placeholder="password"
            required
          />
        </label>
        <br />
        <label htmlFor="password">
          Confirm Password:
          <input
            name="confirmPass"
            id="confirmPass"
            type="password"
            placeholder="Confirm Password"
            required
          />
        </label>
        <br />
        <button type="submit" disabled={loading}>Set Password</button>

      </form>
      {error && <div className={classes.error_msg}>{error}</div>}
    </div>
  );
}

export default Login;
