import React from 'react';
import { FaHome, FaDumbbell, FaClipboardList, FaTimes } from 'react-icons/fa';

const Sidebar = ({ currentPage, onNavigate, isOpen, onClose }) => {
    // Helper to handle navigation and close sidebar on mobile
    const handleNavClick = (page) => {
        onNavigate(page);
        if (onClose) onClose();
    };

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
             {/* Mobile Close Button (Only visible on mobile) */}
             <button 
                className="mobile-close-btn" 
                onClick={onClose}
            >
                <FaTimes />
            </button>

            <nav className="sidebar-nav">
                <button
                    onClick={() => handleNavClick('Home')}
                    className={`sidebar-btn ${currentPage === 'Home' ? 'active' : ''}`}
                    title="בית"
                >
                    <span>בית</span>
                    <FaHome />
                </button>
                <button
                    onClick={() => handleNavClick('Form')}
                    className={`sidebar-btn ${currentPage === 'Form' ? 'active' : ''}`}
                >
                    <span>בניית תוכנית</span>
                    <FaClipboardList />
                </button>
                <button
                    onClick={() => handleNavClick('Exercises')}
                    className={`sidebar-btn ${currentPage === 'Exercises' ? 'active' : ''}`}
                >
                    <span>ספריית תרגילים</span>
                    <FaDumbbell />
                </button>
            </nav>
        </aside>
    );
};

export default Sidebar;
