import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaUserAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import classes from './Navbar.module.scss';

export default function Navbar(userData) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const getUser = async () => {
    try {
      if (userData.data) { setUser(userData.data); }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUser();
  }, [userData]);

  const handleLogout = async () => {
    try {
      await axios.get('/api/auth/logout');
      setUser(null);
      localStorage.removeItem('user');
      toast.success('Logged out successfully');
      navigate('/auth');
    } catch (err) {
      console.log(err);
    }
  };
  const handlePlayground = () => {
    navigate('/playground');
  };

  const home = () => {
    navigate('/');
  };

  if (!user) return null;

  return (
    <header role={user.role}>
      <div className={classes.userInfo}>
        <div className={classes.flex1}>
          <Link to="/edit-profile">
            <FaUserAlt className={classes.userIcon} />
            <p className={classes.editBtn}>Edit</p>
          </Link>
        </div>
        <div className={classes.flex2}>
          <h1 className={classes.name}>{user.name}</h1>
          <p className={classes.email}>{user.email}</p>
          <p className={classes.role}>{user.role}</p>

        </div>

      </div>
      <nav>

        <button className={classes.Playground} type="button" onClick={home}>
          Home
        </button>

        <button className={classes.Playground} type="button" onClick={handlePlayground}>
          Codepen
        </button>
        <button type="button" className={classes.logout} onClick={handleLogout}>
          logout
        </button>
        <div />

      </nav>

    </header>
  );
}
