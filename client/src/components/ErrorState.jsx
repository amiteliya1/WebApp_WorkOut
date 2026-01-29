import React from 'react';
import { FaExclamationTriangle, FaRedo } from 'react-icons/fa';

const ErrorState = ({ message = 'An error occurred while loading data', onRetry = null }) => {
  return (
    <div className="error-state" style={{ 
      textAlign: 'center', 
      padding: '40px 20px',
      color: 'var(--error, #ff4444)'
    }}>
      <FaExclamationTriangle className="error-icon" style={{ fontSize: '48px', marginBottom: '16px' }} />
      <p style={{ fontSize: '1.1rem', marginBottom: '20px' }}>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '12px',
          }}
        >
          <FaRedo /> Retry
        </button>
      )}
    </div>
  );
};

export default ErrorState;

