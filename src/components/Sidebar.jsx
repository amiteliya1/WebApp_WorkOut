import React from 'react';
import { FaHome } from 'react-icons/fa';

const Sidebar = ({ currentPage, onNavigate }) => {
    return (
        <aside className="sidebar">
            <nav className="sidebar-nav">
                <button
                    onClick={() => onNavigate('Home')}
                    className={`sidebar-btn ${currentPage === 'Home' ? 'active' : ''}`}
                    title="בית"
                >
                    <FaHome />
                </button>
                <button
                    onClick={() => onNavigate('Form')}
                    className={`sidebar-btn ${currentPage === 'Form' ? 'active' : ''}`}
                >
                    בניית תוכנית
                </button>
                <button
                    onClick={() => onNavigate('Exercises')}
                    className={`sidebar-btn ${currentPage === 'Exercises' ? 'active' : ''}`}
                >
                    ספריית תרגילים
                </button>
            </nav>
        </aside>
    );
};

export default Sidebar;

