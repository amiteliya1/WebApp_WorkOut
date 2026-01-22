import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, currentPage, onNavigate }) => {
    return (
        <div className="site-layout">
            <Header currentPage={currentPage} onNavigate={onNavigate} />
            <main className="site-main">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
