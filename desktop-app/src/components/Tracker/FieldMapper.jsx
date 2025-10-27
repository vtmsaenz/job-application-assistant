// src/components/Tracker/FieldMapper.jsx
import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import './FieldMapper.css';

const FieldMapper = ({ fields, mappings, onMappingsChange, onFieldsChange }) => {
  const standardFields = [
    { key: 'company', label: 'Company Name', required: true },
    { key: 'position', label: 'Job Position', required: true },
    { key: 'date', label: 'Date Applied', required: false },
    { key: 'status', label: 'Application Status', required: false },
    { key: 'url', label: 'Job URL', required: false },
    { key: 'location', label: 'Location', required: false },
    { key: 'salary', label: 'Salary', required: false },
    { key: 'notes', label: 'Notes', required: false }
  ];

  const handleMappingChange = (standardKey, fieldValue) => {
    onMappingsChange({
      ...mappings,
      [standardKey]: fieldValue
    });
  };

  const isMapped = (standardKey) => {
    return mappings[standardKey] && mappings[standardKey] !== '';
  };

  const requiredMapped = standardFields
    .filter(f => f.required)
    .every(f => isMapped(f.key));

  return (
    <div className="field-mapper">
      <h2>Map Your Fields</h2>
      <p className="mapper-description">
        Match your spreadsheet columns to our standard fields. 
        We've made some suggestions, but you can adjust them below.
      </p>

      <div className="mapping-status">
        {requiredMapped ? (
          <div className="status-good">
            <CheckCircle size={18} />
            <span>All required fields mapped</span>
          </div>
        ) : (
          <div className="status-warning">
            <AlertCircle size={18} />
            <span>Please map all required fields</span>
          </div>
        )}
      </div>

      <div className="mappings-list">
        {standardFields.map(standardField => (
          <div key={standardField.key} className="mapping-row">
            <div className="field-info">
              <label>
                {standardField.label}
                {standardField.required && <span className="required">*</span>}
              </label>
            </div>
            <select
              className="field-select"
              value={mappings[standardField.key] || ''}
              onChange={(e) => handleMappingChange(standardField.key, e.target.value)}
            >
              <option value="">-- Select field --</option>
              {fields.map(field => (
                <option key={field} value={field}>
                  {field}
                </option>
              ))}
            </select>
            {isMapped(standardField.key) && (
              <CheckCircle size={18} className="mapped-icon" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FieldMapper;