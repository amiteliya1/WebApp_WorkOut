import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="not-found-container" style={{ textAlign: 'center', padding: '50px' }}>
      <h1>404</h1>
      <h2>אופס! הדף לא נמצא</h2>
      <p>נראה שהגעת למקום הלא נכון.</p>
      <Link to="/" className="home-link" style={{ color: '#646cff', textDecoration: 'underline' }}>
        חזור לדף הבית
      </Link>
    </div>
  );
};

export default NotFoundPage;

