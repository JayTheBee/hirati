import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Register from '../components/auth/Register';
import Layout from '../components/Layout';
import LandingPage from './LandingPage';
import classes from './Auth.module.scss';
import useAuth from '../hooks/useAuth';
import Banner from './Banner';

function RegisterPage() {
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
        <Register />
        <Banner />
      </div>
    </Layout>
  );
}

export default RegisterPage;
