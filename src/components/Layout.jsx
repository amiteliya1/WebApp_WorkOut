import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

const Layout = ({ children, currentPage, onNavigate }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className="site-layout">
            {/* Header with Navigation */}
            <Header 
                onToggleSidebar={toggleSidebar} 
                currentPage={currentPage} 
                onNavigate={onNavigate}
            />

            {/* Mobile Sidebar (Drawer) - Only visible when toggled on mobile */}
            <div 
                className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`}
                onClick={closeSidebar}
            />

            <div className={`mobile-sidebar-wrapper ${isSidebarOpen ? 'open' : ''}`}>
                <Sidebar 
                    currentPage={currentPage} 
                    onNavigate={onNavigate} 
                    isOpen={isSidebarOpen} 
                    onClose={closeSidebar}
                />
            </div>

            {/* Main Content Wrapper */}
            <div className="main-container">
                <main className="site-main">
                    {children}
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default Layout;
