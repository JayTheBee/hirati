import React, { useState, useEffect} from 'react';
import Layout from '../components/Layout';
import Navbar from '../components/nav/Navbar';
import Points from '../components/points/points';
import axios from 'axios';
function points() {
    const [user, setUser] = useState(null);
    const [flag, setflag] = useState(null);
    const getUser = async () => {
      try {
        const { data } = await axios.get('/api/users/me');
        setUser(data);
        setflag(1);
        if (user != null) {
          localStorage.setItem('user', JSON.stringify(user));
        }
      } catch (err) {
      }
    };
    useEffect(() => {
      getUser();
    }, []);
    useEffect(() => {
      getUser();
    }, [flag]);
    return (
      <Layout>
        <Navbar data={user} />
        <Points data={user} />
      </Layout>
    );
}
export default points;
