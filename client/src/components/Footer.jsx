import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaInstagram, FaTwitter, FaFacebook, FaGithub } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    const { user, deleteAccount } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleDeleteAccount = async () => {
        const confirmation = window.confirm(
            'Delete your account and all workouts?\n\nThis cannot be undone.'
        );

        if (!confirmation) {
            return;
        }

        try {
            setLoading(true);
            const result = await deleteAccount();

            if (result.success) {
                alert(`Account deleted. Goodbye!`);
                navigate('/login');
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <footer className="site-footer">
            <div className="footer-container">
                {/* About Section */}
                <div className="footer-section footer-about">
                    <h3 className="footer-brand">Workout Tracker</h3>
                    <p className="footer-tagline">
                        Track your progress, build your strength, and achieve your fitness goals.
                        Your journey to a healthier you starts here.
                    </p>
                </div>

                {/* Quick Links */}
                <div className="footer-section">
                    <h4 className="footer-heading">Quick Links</h4>
                    <ul className="footer-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/form">Build Program</Link></li>
                        <li><Link to="/exercises">Exercise Library</Link></li>
                    </ul>
                </div>

                {/* Resources */}
                <div className="footer-section">
                    <h4 className="footer-heading">Resources</h4>
                    <ul className="footer-links">
                        <li><a href="#tutorials">Tutorials</a></li>
                        <li><a href="#support">Support</a></li>
                        <li><a href="#faq">FAQ</a></li>
                    </ul>
                </div>

                {/* Follow Us */}
                <div className="footer-section">
                    <h4 className="footer-heading">Follow Us</h4>
                    <div className="social-links">
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <FaInstagram />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                            <FaTwitter />
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <FaFacebook />
                        </a>
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                            <FaGithub />
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom">
                <p className="footer-copyright">
                    © 2026 Workout Tracker. All rights reserved.
                </p>
                <div className="footer-legal">
                    <a href="#privacy">Privacy Policy</a>
                    <a href="#terms">Terms of Service</a>
                    <a href="#cookies">Cookie Policy</a>
                    {user && (
                        <button
                            onClick={handleDeleteAccount}
                            disabled={loading}
                            className="delete-account-link"
                        >
                            {loading ? 'Deleting...' : 'Delete Account'}
                        </button>
                    )}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
