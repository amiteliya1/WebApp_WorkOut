import React from 'react';

const Header = ({ currentPage, onNavigate }) => {
    return (
        <header className="site-header">
            <div className="header-content">
                <h1 className="site-title">WORKOUT TRACKER</h1>
                <nav className="site-nav">
                    <button
                        onClick={() => onNavigate('Home')}
                        className={`nav-btn ${currentPage === 'Home' ? 'active' : ''}`}
                    >
                        בית
                    </button>
                    <button
                        onClick={() => onNavigate('Form')}
                        className={`nav-btn ${currentPage === 'Form' ? 'active' : ''}`}
                    >
                        טופס
                    </button>
                    <button
                        onClick={() => onNavigate('Exercises')}
                        className={`nav-btn ${currentPage === 'Exercises' ? 'active' : ''}`}
                    >
                        ספריית תרגילים
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Header;
