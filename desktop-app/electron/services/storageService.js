// electron/services/storageService.js
const Store = require('electron-store');
const { v4: uuidv4 } = require('uuid');

const store = new Store({
  defaults: {
    projects: [],
    templates: [],
    settings: {
      theme: 'light',
      autoSave: true
    }
  }
});

class StorageService {
  // ============ Projects ============
  
  async createProject(projectData) {
    const projects = store.get('projects', []);
    const newProject = {
      id: uuidv4(),
      name: projectData.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fields: projectData.fields || [],
      fieldMappings: projectData.fieldMappings || {},
      filePath: projectData.filePath || null,
      applications: []
    };
    
    projects.push(newProject);
    store.set('projects', projects);
    return newProject;
  }

  async getProjects() {
    return store.get('projects', []);
  }

  async getProjectById(projectId) {
    const projects = store.get('projects', []);
    return projects.find(p => p.id === projectId);
  }

  async updateProject(projectId, updates) {
    const projects = store.get('projects', []);
    const index = projects.findIndex(p => p.id === projectId);
    
    if (index === -1) {
      throw new Error('Project not found');
    }
    
    projects[index] = {
      ...projects[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    store.set('projects', projects);
    return projects[index];
  }

  async deleteProject(projectId) {
    const projects = store.get('projects', []);
    const filtered = projects.filter(p => p.id !== projectId);
    store.set('projects', filtered);
    return { success: true };
  }

  // ============ Applications ============
  
  async addApplication(projectId, applicationData) {
    const projects = store.get('projects', []);
    const project = projects.find(p => p.id === projectId);
    
    if (!project) {
      throw new Error('Project not found');
    }
    
    const newApplication = {
      id: uuidv4(),
      data: applicationData,
      capturedAt: new Date().toISOString(),
      source: applicationData.url || null
    };
    
    project.applications.push(newApplication);
    project.updatedAt = new Date().toISOString();
    
    store.set('projects', projects);
    return newApplication;
  }

  async updateApplication(projectId, applicationId, updates) {
    const projects = store.get('projects', []);
    const project = projects.find(p => p.id === projectId);
    
    if (!project) {
      throw new Error('Project not found');
    }
    
    const appIndex = project.applications.findIndex(a => a.id === applicationId);
    if (appIndex === -1) {
      throw new Error('Application not found');
    }
    
    project.applications[appIndex] = {
      ...project.applications[appIndex],
      data: {
        ...project.applications[appIndex].data,
        ...updates
      }
    };
    
    project.updatedAt = new Date().toISOString();
    store.set('projects', projects);
    return project.applications[appIndex];
  }

  async deleteApplication(projectId, applicationId) {
    const projects = store.get('projects', []);
    const project = projects.find(p => p.id === projectId);
    
    if (!project) {
      throw new Error('Project not found');
    }
    
    project.applications = project.applications.filter(a => a.id !== applicationId);
    project.updatedAt = new Date().toISOString();
    
    store.set('projects', projects);
    return { success: true };
  }

  // ============ Templates ============
  
  async createTemplate(templateData) {
    const templates = store.get('templates', []);
    const newTemplate = {
      id: uuidv4(),
      jobTitle: templateData.jobTitle,
      category: templateData.category || 'General',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      questions: templateData.questions || []
    };
    
    templates.push(newTemplate);
    store.set('templates', templates);
    return newTemplate;
  }

  async getTemplates() {
    return store.get('templates', []);
  }

  async getTemplateByJobTitle(jobTitle) {
    const templates = store.get('templates', []);
    return templates.find(t => 
      t.jobTitle.toLowerCase() === jobTitle.toLowerCase()
    );
  }

  async updateTemplate(templateId, updates) {
    const templates = store.get('templates', []);
    const index = templates.findIndex(t => t.id === templateId);
    
    if (index === -1) {
      throw new Error('Template not found');
    }
    
    templates[index] = {
      ...templates[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    store.set('templates', templates);
    return templates[index];
  }

  async deleteTemplate(templateId) {
    const templates = store.get('templates', []);
    const filtered = templates.filter(t => t.id !== templateId);
    store.set('templates', filtered);
    return { success: true };
  }

  // ============ Settings ============
  
  async getSettings() {
    return store.get('settings');
  }

  async updateSettings(updates) {
    const settings = store.get('settings');
    const newSettings = { ...settings, ...updates };
    store.set('settings', newSettings);
    return newSettings;
  }
}

module.exports = new StorageService();