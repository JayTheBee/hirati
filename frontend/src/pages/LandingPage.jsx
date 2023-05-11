import React from 'react';
import { useNavigate } from 'react-router-dom';
import pic from '../resource/logo.png';
import classes from './Auth.module.scss';

function LandingPage() {
  const navigate = useNavigate();
  const handleHome = () => {
    navigate('/auth');
  };
  return (
    <div>
      <nav className={classes.nav}>
        <img
          src={pic}
          alt="logo"
        />
        <div>

          <h1 onClick={handleHome}>HIRATI</h1>
          <h2 className={classes.tag}>Your Automated Coding Partner</h2>
        </div>
      </nav>
    </div>
  );
}

export default LandingPage;
