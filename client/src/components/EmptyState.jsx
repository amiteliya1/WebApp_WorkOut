import React from 'react';
import { Link } from 'react-router-dom';
import { FaDumbbell } from 'react-icons/fa';

const EmptyState = () => {
  return (
    <div className="empty-state">
      <FaDumbbell className="empty-icon" />
      <h3>אין אימונים עדיין</h3>
      <p>התחל ליצור אימונים חדשים</p>
      <Link to="/new" className="btn-primary">
        צור אימון חדש
      </Link>
    </div>
  );
};

export default EmptyState;

