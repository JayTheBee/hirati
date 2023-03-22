import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import Navbar from '../components/nav/Navbar';
import TaskList from '../components/task/TaskList';

function Home() {
  const [tasklist, setTaskList] = useState(null);
  const [flag, setflag] = useState(null);
  const params = useParams();
  const location = useLocation();

  const getTasks = async () => {
    try {
      const { data } = await axios.get(`/api/tasks/${params.id}`);
      if (data) {
        setTaskList(
          data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
        );
      }
      setflag(1);
      console.log(tasklist);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getTasks();
  }, [flag]);

  return (
    <Layout>
      <Navbar />
      <TaskList data={tasklist} />
    </Layout>
  );
}
export default Home;
