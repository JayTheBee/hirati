import axios from 'axios';
import toast from 'react-hot-toast';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from './AuthForm.module.scss';

function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [disabled, setDisabled] = useState(false);
  const register = async (e) => {
    e.preventDefault();
    const user = {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
      role: e.target.role.value,
    };
    try {
      await axios.post('/api/auth/register', user);
      console.log(user.role);
      toast.success('Registered successfully');
      setMsg('Please Verify your account using Registered Email');
    } catch (error) {
      if (
        error.response && error.response.status >= 400 && error.response.status <= 500
      ) {
        setError(error.response.data.message);
        toast.error('Something went wrong');
      }
    }
  };
  const handleHome = () => {
    navigate('/auth');
  };
  return (
    <div className={classes.login}>
      <h1 className={classes.title}>Register</h1>
      <form className={classes.authForm} onSubmit={register}>
        <label htmlFor="name">
          Full Name:
          <input name="name" type="text" placeholder="Full Name" required />
        </label>
        <label htmlFor="email">
          Email:
          <input name="email" type="email" placeholder="Email" required />
        </label>
        <br />
        <label htmlFor="Password">
          Password:
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
          />
        </label>
        <br />

        <label> User Role </label>
        <div>
          <label>
            <input
              // onChange={}
              type="radio"
              value="student"
              checked
              name="role"
            />
            Student
          </label>
        </div>
        <div>
          <label>
            <input
              // onChange={}
              type="radio"
              value="teacher"
              name="role"
            />
            Teacher
          </label>
        </div>

        <button type="submit">Register</button>
      </form>
      {error && <div className={classes.error_msg}>{error}</div>}
      {msg && <div className={classes.sucess_msg}>{msg}</div>}
      <div>
        <p className={classes.flex}>
          Return to
          <p className={classes.register} onClick={handleHome}>Login</p>
        </p>

      </div>
    </div>
  );
}

export default Register;
