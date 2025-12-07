import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

const Layout = ({ children, currentPage, onNavigate }) => {
    return (
        <div className="site-layout">
            <Header />
            <div className="layout-content">
                <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
                <main className="site-main">
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default Layout;
