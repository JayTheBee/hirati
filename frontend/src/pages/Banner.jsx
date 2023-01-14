import React from 'react';
import pic from '../resource/robot.png';
import classes from '../components/auth/AuthForm.module.scss';

function banner() {
  return (
    <img src={pic} alt="robot" className={classes.banner} />
  );
}

export default banner;
