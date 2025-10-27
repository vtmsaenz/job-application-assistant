// src/context/AppContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load initial data
  useEffect(() => {
    loadProjects();
    loadTemplates();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await window.electronAPI.getProjects();
      setProjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const data = await window.electronAPI.getTemplates();
      setTemplates(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const createProject = async (projectData) => {
    try {
      const newProject = await window.electronAPI.createProject(projectData);
      setProjects([...projects, newProject]);
      return newProject;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateProject = async (projectId, updates) => {
    try {
      const updated = await window.electronAPI.updateProject(projectId, updates);
      setProjects(projects.map(p => p.id === projectId ? updated : p));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteProject = async (projectId) => {
    try {
      await window.electronAPI.deleteProject(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const addApplication = async (projectId, applicationData) => {
    try {
      const newApp = await window.electronAPI.addApplication(projectId, applicationData);
      await loadProjects(); // Reload to get updated project
      return newApp;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const createTemplate = async (templateData) => {
    try {
      const newTemplate = await window.electronAPI.createTemplate(templateData);
      setTemplates([...templates, newTemplate]);
      return newTemplate;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateTemplate = async (templateId, updates) => {
    try {
      const updated = await window.electronAPI.updateTemplate(templateId, updates);
      setTemplates(templates.map(t => t.id === templateId ? updated : t));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteTemplate = async (templateId) => {
    try {
      await window.electronAPI.deleteTemplate(templateId);
      setTemplates(templates.filter(t => t.id !== templateId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    projects,
    templates,
    currentProject,
    loading,
    error,
    setCurrentProject,
    loadProjects,
    loadTemplates,
    createProject,
    updateProject,
    deleteProject,
    addApplication,
    createTemplate,
    updateTemplate,
    deleteTemplate
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};