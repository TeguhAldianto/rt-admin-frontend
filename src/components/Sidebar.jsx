// import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>RT ADMIN</div>
      
      <nav>
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}
        >
          Dashboard
        </NavLink>
        <NavLink 
          to="/houses" 
          className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}
        >
          Data Rumah
        </NavLink>
        <NavLink 
          to="/occupants" 
          className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}
        >
          Data Warga
        </NavLink>
        <NavLink 
          to="/payments" 
          className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}
        >
          Iuran Bulanan
        </NavLink>
        <NavLink 
          to="/expenses" 
          className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}
        >
          Pengeluaran
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;