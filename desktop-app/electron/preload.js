// electron/preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Projects
  createProject: (data) => ipcRenderer.invoke('create-project', data),
  getProjects: () => ipcRenderer.invoke('get-projects'),
  updateProject: (id, updates) => ipcRenderer.invoke('update-project', id, updates),
  deleteProject: (id) => ipcRenderer.invoke('delete-project', id),

  // Excel
  importExcel: (filePath) => ipcRenderer.invoke('import-excel', filePath),
  exportExcel: (projectId, filePath) => ipcRenderer.invoke('export-excel', projectId, filePath),
  detectFields: (filePath) => ipcRenderer.invoke('detect-fields', filePath),

  // Applications
  addApplication: (projectId, data) => ipcRenderer.invoke('add-application', projectId, data),
  updateApplication: (projectId, appId, updates) => ipcRenderer.invoke('update-application', projectId, appId, updates),
  deleteApplication: (projectId, appId) => ipcRenderer.invoke('delete-application', projectId, appId),

  // Templates
  createTemplate: (data) => ipcRenderer.invoke('create-template', data),
  getTemplates: () => ipcRenderer.invoke('get-templates'),
  getTemplateByJobTitle: (jobTitle) => ipcRenderer.invoke('get-template-by-job-title', jobTitle),
  updateTemplate: (id, updates) => ipcRenderer.invoke('update-template', id, updates),
  deleteTemplate: (id) => ipcRenderer.invoke('delete-template', id),

  // Widget
  toggleWidget: () => ipcRenderer.invoke('toggle-widget'),
  capturePage: (url) => ipcRenderer.invoke('capture-page', url),

  // Events
  onPageCaptured: (callback) => ipcRenderer.on('page-captured', (event, data) => callback(data)),
  removePageCapturedListener: () => ipcRenderer.removeAllListeners('page-captured')
});