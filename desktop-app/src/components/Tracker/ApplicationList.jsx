// src/components/Tracker/ApplicationList.jsx
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Download, Search } from 'lucide-react';
import ApplicationForm from './ApplicationForm';
import './ApplicationList.css';

const ApplicationList = ({ project }) => {
  const { addApplication } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApps = project.applications.filter(app => {
    const company = app.data.company || '';
    const position = app.data.position || '';
    return company.toLowerCase().includes(searchTerm.toLowerCase()) ||
           position.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleAddApplication = async (data) => {
    await addApplication(project.id, data);
    setIsAdding(false);
  };

  const handleExport = async () => {
    // Would open save dialog in real implementation
    await window.electronAPI.exportExcel(project.id, '/path/to/export.xlsx');
  };

  if (isAdding) {
    return (
      <ApplicationForm
        project={project}
        onSave={handleAddApplication}
        onCancel={() => setIsAdding(false)}
      />
    );
  }

  return (
    <div className="application-list">
      <div className="list-header">
        <h1>{project.name}</h1>
        <div className="list-actions">
          <button className="btn-secondary" onClick={handleExport}>
            <Download size={18} />
            Export
          </button>
          <button className="btn-primary" onClick={() => setIsAdding(true)}>
            <Plus size={18} />
            Add Application
          </button>
        </div>
      </div>

      <div className="list-filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="applications-table">
        <table>
          <thead>
            <tr>
              {project.fields.map(field => (
                <th key={field}>{field}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredApps.length === 0 ? (
              <tr>
                <td colSpan={project.fields.length} className="empty-row">
                  No applications yet. Click "Add Application" to get started!
                </td>
              </tr>
            ) : (
              filteredApps.map(app => (
                <tr key={app.id}>
                  {project.fields.map(field => {
                    const mapping = Object.keys(project.fieldMappings).find(
                      key => project.fieldMappings[key] === field
                    );
                    const value = mapping ? app.data[mapping] : app.data[field] || '';
                    return <td key={field}>{value}</td>;
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicationList;