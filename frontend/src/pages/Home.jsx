import React from 'react';
import Layout from '../components/Layout';
import Navbar from '../components/nav/Navbar';
import ClassList from '../components/class/ClassList';

function Home() {
  return (
    <Layout>
      <Navbar />
      <ClassList />
    </Layout>
  );
}
export default Home;
