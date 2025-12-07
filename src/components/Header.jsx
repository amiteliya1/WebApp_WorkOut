import React from 'react';
import { FaBars, FaHome, FaDumbbell, FaClipboardList } from 'react-icons/fa';

const Header = ({ onToggleSidebar, currentPage, onNavigate }) => {
    return (
        <header className="site-header">
            <div className="header-content">
                {/* Mobile Hamburger (Visible only on mobile) */}
                <button 
                    className="header-hamburger" 
                    onClick={onToggleSidebar}
                    aria-label="Toggle Menu"
                >
                    <FaBars />
                </button>

                {/* Desktop Navigation (Visible only on desktop) */}
                <nav className="desktop-nav">
                    <button 
                        onClick={() => onNavigate('Home')}
                        className={`nav-link ${currentPage === 'Home' ? 'active' : ''}`}
                    >
                        <FaHome /> בית
                    </button>
                    <button 
                        onClick={() => onNavigate('Form')}
                        className={`nav-link ${currentPage === 'Form' ? 'active' : ''}`}
                    >
                        <FaClipboardList /> בניית תוכנית
                    </button>
                    <button 
                        onClick={() => onNavigate('Exercises')}
                        className={`nav-link ${currentPage === 'Exercises' ? 'active' : ''}`}
                    >
                        <FaDumbbell /> ספריית תרגילים
                    </button>
                </nav>

                {/* Logo */}
                <h1 className="site-title">WORKOUT TRACKER</h1>
            </div>
        </header>
    );
};

export default Header;
