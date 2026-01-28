import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="not-found-container" style={{ textAlign: 'center', padding: '50px' }}>
      <h1>404</h1>
      <h2>Oops! Page not found</h2>
      <p>It looks like you went to the wrong place.</p>
      <Link to="/" className="home-link" style={{ color: '#646cff', textDecoration: 'underline' }}>
        Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;

