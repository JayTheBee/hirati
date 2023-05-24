import React, { useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Reset from '../components/auth/Reset';
import Layout from '../components/Layout';
import LandingPage from './LandingPage';
import classes from './Auth.module.scss';
import useAuth from '../hooks/useAuth';
import Banner from './Banner';

function ResetPage() {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const checkIfValid = async () => {
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get('id');
    const token = queryParams.get('token');
    try {
      await axios.post(
        '/api/auth/reset',
        { id, token },
      );
    } catch (error) {
      navigate('/');
    }
  };

  useLayoutEffect(() => {
    if (auth) {
      navigate('/');
    }
  }, [auth, navigate]);

  useEffect(() => {
    checkIfValid();
  }, []);
  return (
    <Layout>
      <LandingPage />
      <div className={classes.form_container}>
        <Banner />
        <Reset />
      </div>
    </Layout>
  );
}

export default ResetPage;
