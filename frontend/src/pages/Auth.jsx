import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/auth/Login';
// import Register from '../components/auth/Register';
import Layout from '../components/Layout';
import useAuth from '../hooks/useAuth';
import classes from './Auth.module.scss';
import LandingPage from './LandingPage';
import Banner from './Banner';

function Auth() {
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth) {
      navigate('/');
    }
  }, [auth, navigate]);

  return (
    <Layout>
      <LandingPage />

      <div className={classes.form_container}>
        <Banner />
        <Login />
      </div>
    </Layout>
  );
}

export default Auth;
