import React from 'react';
import { AiTwotoneHeart } from 'react-icons/ai';
import pic from '../resource/robot.png';
import classes from '../components/auth/AuthForm.module.scss';

function banner() {
  return (
    <>
      <img src={pic} alt="robot" className={classes.banner} />
      <div className={classes.floatingText}>
        <span className={classes.first}>Hello!</span>
        <span className={classes.second}>
          {'  '}
          Anon
          <AiTwotoneHeart />
        </span>
      </div>
    </>
  );
}

export default banner;
