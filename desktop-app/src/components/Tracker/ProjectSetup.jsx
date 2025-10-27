// src/components/Tracker/ProjectSetup.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import FieldMapper from './FieldMapper';
import ApplicationList from './ApplicationList';
import { Upload, Plus } from 'lucide-react';
import './ProjectSetup.css';

const ProjectSetup = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, createProject, updateProject } = useApp();
  
  const [step, setStep] = useState(1); // 1: Setup, 2: Field Mapping, 3: Applications
  const [projectName, setProjectName] = useState('');
  const [importType, setImportType] = useState(null); // 'excel' or 'create'
  const [excelData, setExcelData] = useState(null);
  const [fields, setFields] = useState([]);
  const [fieldMappings, setFieldMappings] = useState({});
  const [currentProject, setCurrentProject] = useState(null);

  useEffect(() => {
    if (id) {
      const project = projects.find(p => p.id === id);
      if (project) {
        setCurrentProject(project);
        setStep(3); // Go straight to application list
      }
    }
  }, [id, projects]);

  const handleImportExcel = async () => {
    // This would open a file dialog in real implementation
    // For now, we'll simulate it
    try {
      // In real app: const filePath = await dialog.showOpenDialog();
      const filePath = '/path/to/excel.xlsx';
      const data = await window.electronAPI.detectFields(filePath);
      
      setExcelData(data);
      setFields(data.headers);
      setFieldMappings(data.suggestedMappings);
      setStep(2);
    } catch (error) {
      console.error('Failed to import Excel:', error);
      alert('Excel import failed. Please try again or create a new project.');
    }
  };

  const handleCreateNew = () => {
    const defaultFields = [
      'Company',
      'Position',
      'Date Applied',
      'Status',
      'Job URL',
      'Location',
      'Notes'
    ];
    
    setFields(defaultFields);
    setFieldMappings({
      company: 'Company',
      position: 'Position',
      date: 'Date Applied',
      status: 'Status',
      url: 'Job URL',
      location: 'Location',
      notes: 'Notes'
    });
    setImportType('create');
    setStep(2);
  };

  const handleSaveProject = async () => {
    if (!projectName.trim()) {
      alert('Please enter a project name');
      return;
    }

    try {
      const projectData = {
        name: projectName,
        fields,
        fieldMappings,
        filePath: excelData?.filePath || null
      };

      const newProject = await createProject(projectData);
      setCurrentProject(newProject);
      setStep(3);
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Failed to create project. Please try again.');
    }
  };

  if (step === 3 && currentProject) {
    return <ApplicationList project={currentProject} />;
  }

  return (
    <div className="project-setup">
      <div className="setup-header">
        <h1>{id ? 'Edit Project' : 'Create New Project'}</h1>
      </div>

      {step === 1 && (
        <div className="setup-step">
          <div className="step-content">
            <h2>Let's set up your project</h2>
            
            <div className="form-group">
              <label>Project Name</label>
              <input
                type="text"
                placeholder="e.g., Q1 2025 Job Hunt"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="import-options">
              <h3>How would you like to start?</h3>
              
              <div className="option-cards">
                <button 
                  className="option-card"
                  onClick={handleImportExcel}
                >
                  <Upload size={32} />
                  <h4>Import Excel</h4>
                  <p>Import an existing Excel or Numbers file</p>
                </button>

                <button 
                  className="option-card"
                  onClick={handleCreateNew}
                >
                  <Plus size={32} />
                  <h4>Start Fresh</h4>
                  <p>Create a new tracking spreadsheet</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="setup-step">
          <FieldMapper
            fields={fields}
            mappings={fieldMappings}
            onMappingsChange={setFieldMappings}
            onFieldsChange={setFields}
          />
          
          <div className="step-actions">
            <button 
              className="btn-secondary"
              onClick={() => setStep(1)}
            >
              Back
            </button>
            <button 
              className="btn-primary"
              onClick={handleSaveProject}
              disabled={!projectName}
            >
              Create Project
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectSetup;