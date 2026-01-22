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
      newErrors.title = 'כותרת חייבת להכיל לפחות 2 תווים';
    }

    if (!formData.duration || Number(formData.duration) < 1) {
      newErrors.duration = 'משך האימון חייב להיות לפחות דקה אחת';
    }

    if (!formData.date) {
      newErrors.date = 'תאריך הוא שדה חובה';
    }

    if (formData.notes && formData.notes.length > 500) {
      newErrors.notes = 'הערות לא יכולות לעלות על 500 תווים';
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
        <h2>{id ? 'ערוך אימון' : 'אימון חדש'}</h2>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="btn-icon"
          title="סגור"
        >
          <FaTimes />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="workout-form">
        <div className="form-field">
          <label htmlFor="title">כותרת האימון *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="לדוגמה: אימון חזה וכתפיים"
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <span className="form-error">{errors.title}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="duration">משך האימון (דקות) *</label>
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
          <label htmlFor="date">תאריך *</label>
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
          <label htmlFor="notes">הערות (אופציונלי)</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            maxLength="500"
            placeholder="הוסף הערות על האימון..."
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
            ביטול
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'שומר...' : id ? 'עדכן' : 'שמור'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkoutForm;

