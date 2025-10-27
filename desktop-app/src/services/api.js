// src/services/api.js
// Wrapper around Electron API for easier use in components

export const api = {
  // Projects
  projects: {
    getAll: () => window.electronAPI.getProjects(),
    create: (data) => window.electronAPI.createProject(data),
    update: (id, updates) => window.electronAPI.updateProject(id, updates),
    delete: (id) => window.electronAPI.deleteProject(id)
  },

  // Excel
  excel: {
    import: (filePath) => window.electronAPI.importExcel(filePath),
    export: (projectId, filePath) => window.electronAPI.exportExcel(projectId, filePath),
    detectFields: (filePath) => window.electronAPI.detectFields(filePath)
  },

  // Applications
  applications: {
    add: (projectId, data) => window.electronAPI.addApplication(projectId, data),
    update: (projectId, appId, updates) => 
      window.electronAPI.updateApplication(projectId, appId, updates),
    delete: (projectId, appId) => 
      window.electronAPI.deleteApplication(projectId, appId)
  },

  // Templates
  templates: {
    getAll: () => window.electronAPI.getTemplates(),
    getByJobTitle: (jobTitle) => window.electronAPI.getTemplateByJobTitle(jobTitle),
    create: (data) => window.electronAPI.createTemplate(data),
    update: (id, updates) => window.electronAPI.updateTemplate(id, updates),
    delete: (id) => window.electronAPI.deleteTemplate(id)
  },

  // Widget
  widget: {
    toggle: () => window.electronAPI.toggleWidget(),
    capturePage: (url) => window.electronAPI.capturePage(url)
  },

  // Events
  events: {
    onPageCaptured: (callback) => window.electronAPI.onPageCaptured(callback),
    removePageCapturedListener: () => window.electronAPI.removePageCapturedListener()
  }
};

export default api;