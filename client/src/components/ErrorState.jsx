import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

const ErrorState = ({ message = 'אירעה שגיאה בטעינת הנתונים' }) => {
  return (
    <div className="error-state">
      <FaExclamationTriangle className="error-icon" />
      <p>{message}</p>
    </div>
  );
};

export default ErrorState;

