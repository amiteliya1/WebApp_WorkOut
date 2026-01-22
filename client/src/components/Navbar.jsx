import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaPlus } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>💪 Workout Tracker</h1>
      </div>
      <div className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <FaHome /> בית
        </NavLink>
        <NavLink to="/new" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <FaPlus /> אימון חדש
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;

