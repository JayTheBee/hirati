import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import Navbar from '../components/nav/Navbar';
import TaskList from '../components/task/TaskList';

function Home() {
  const [flag, setflag] = useState(null);
  const [user, setUser] = useState(null);
  const getUser = async () => {
    try {
      const { data } = await axios.get('/api/users/me');
      setUser(data);
      setflag(1);
      // console.log(user);
    } catch (err) {
      console.log(err);
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
      <TaskList data={user} />
    </Layout>
  );
}
export default Home;
