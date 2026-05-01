// import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import styles from './MainLayout.module.css';

const MainLayout = () => {
  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.contentArea}>
        {/* Outlet adalah tempat di mana halaman (Dashboard, dll) akan dirender */}
        <Outlet /> 
      </main>
    </div>
  );
};

export default MainLayout;