// src/components/Tracker/ApplicationForm.jsx
import React, { useState } from 'react';
import './ApplicationForm.css';

const ApplicationForm = ({ project, onSave, onCancel }) => {
  const [formData, setFormData] = useState({});

  const handleChange = (standardField, value) => {
    setFormData({
      ...formData,
      [standardField]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="application-form">
      <div className="form-header">
        <h2>Add New Application</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {Object.entries(project.fieldMappings).map(([standardField, displayField]) => (
            <div key={standardField} className="form-group">
              <label>{displayField}</label>
              {standardField === 'notes' ? (
                <textarea
                  value={formData[standardField] || ''}
                  onChange={(e) => handleChange(standardField, e.target.value)}
                  className="form-textarea"
                  rows={4}
                />
              ) : standardField === 'date' ? (
                <input
                  type="date"
                  value={formData[standardField] || ''}
                  onChange={(e) => handleChange(standardField, e.target.value)}
                  className="form-input"
                />
              ) : standardField === 'status' ? (
                <select
                  value={formData[standardField] || ''}
                  onChange={(e) => handleChange(standardField, e.target.value)}
                  className="form-input"
                >
                  <option value="">Select status</option>
                  <option value="Applied">Applied</option>
                  <option value="Interviewing">Interviewing</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Withdrawn">Withdrawn</option>
                </select>
              ) : (
                <input
                  type="text"
                  value={formData[standardField] || ''}
                  onChange={(e) => handleChange(standardField, e.target.value)}
                  className="form-input"
                />
              )}
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Save Application
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;