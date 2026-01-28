import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';

const WorkoutForm = ({ onSubmit, initialData = null, loading = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    duration: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        duration: initialData.duration || '',
        date: initialData.date
          ? new Date(initialData.date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        notes: initialData.notes || '',
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};

    if (!formData.title || formData.title.trim().length < 2) {
      newErrors.title = 'Title must contain at least 2 characters';
    }

    if (!formData.duration || Number(formData.duration) < 1) {
      newErrors.duration = 'Workout duration must be at least 1 minute';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (formData.notes && formData.notes.length > 500) {
      newErrors.notes = 'Notes cannot exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="workout-form-container">
      <div className="form-header">
        <h2>{id ? 'Edit Workout' : 'New Workout'}</h2>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="btn-icon"
          title="Close"
        >
          <FaTimes />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="workout-form">
        <div className="form-field">
          <label htmlFor="title">Workout Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Example: Chest and Shoulders Workout"
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <span className="form-error">{errors.title}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="duration">Workout Duration (minutes) *</label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            min="1"
            placeholder="60"
            className={errors.duration ? 'error' : ''}
          />
          {errors.duration && (
            <span className="form-error">{errors.duration}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="date">Date *</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={errors.date ? 'error' : ''}
          />
          {errors.date && <span className="form-error">{errors.date}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="notes">Notes (Optional)</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            maxLength="500"
            placeholder="Add notes about the workout..."
            className={errors.notes ? 'error' : ''}
          />
          <div className="char-count">
            {formData.notes.length}/500
          </div>
          {errors.notes && <span className="form-error">{errors.notes}</span>}
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : id ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkoutForm;

