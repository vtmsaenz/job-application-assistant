// electron/main.js
const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const path = require('path');
const Store = require('electron-store');
const { createMainWindow } = require('./windows/mainWindow');
const { createWidgetWindow } = require('./windows/widgetWindow');
const excelService = require('./services/excelService');
const storageService = require('./services/storageService');

const store = new Store();
let mainWindow;
let widgetWindow;

// Initialize app
app.whenReady().then(() => {
  mainWindow = createMainWindow();
  
  // Register global shortcut for widget
  globalShortcut.register('CommandOrControl+Shift+J', () => {
    if (!widgetWindow) {
      widgetWindow = createWidgetWindow();
    } else {
      widgetWindow.show();
    }
  });

  // IPC Handlers
  setupIpcHandlers();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

function setupIpcHandlers() {
  // Project Management
  ipcMain.handle('create-project', async (event, projectData) => {
    return await storageService.createProject(projectData);
  });

  ipcMain.handle('get-projects', async () => {
    return await storageService.getProjects();
  });

  ipcMain.handle('update-project', async (event, projectId, updates) => {
    return await storageService.updateProject(projectId, updates);
  });

  ipcMain.handle('delete-project', async (event, projectId) => {
    return await storageService.deleteProject(projectId);
  });

  // Excel Operations
  ipcMain.handle('import-excel', async (event, filePath) => {
    return await excelService.importExcel(filePath);
  });

  ipcMain.handle('export-excel', async (event, projectId, filePath) => {
    return await excelService.exportExcel(projectId, filePath);
  });

  ipcMain.handle('detect-fields', async (event, filePath) => {
    return await excelService.detectFields(filePath);
  });

  // Application Tracking
  ipcMain.handle('add-application', async (event, projectId, applicationData) => {
    return await storageService.addApplication(projectId, applicationData);
  });

  ipcMain.handle('update-application', async (event, projectId, applicationId, updates) => {
    return await storageService.updateApplication(projectId, applicationId, updates);
  });

  ipcMain.handle('delete-application', async (event, projectId, applicationId) => {
    return await storageService.deleteApplication(projectId, applicationId);
  });

  // Template Management
  ipcMain.handle('create-template', async (event, templateData) => {
    return await storageService.createTemplate(templateData);
  });

  ipcMain.handle('get-templates', async () => {
    return await storageService.getTemplates();
  });

  ipcMain.handle('get-template-by-job-title', async (event, jobTitle) => {
    return await storageService.getTemplateByJobTitle(jobTitle);
  });

  ipcMain.handle('update-template', async (event, templateId, updates) => {
    return await storageService.updateTemplate(templateId, updates);
  });

  ipcMain.handle('delete-template', async (event, templateId) => {
    return await storageService.deleteTemplate(templateId);
  });

  // Widget Actions
  ipcMain.handle('toggle-widget', () => {
    if (!widgetWindow) {
      widgetWindow = createWidgetWindow();
    } else {
      widgetWindow.isVisible() ? widgetWindow.hide() : widgetWindow.show();
    }
  });

  ipcMain.handle('capture-page', async (event, url) => {
    // This will be implemented with extension communication
    // For now, just send to main window
    if (mainWindow) {
      mainWindow.webContents.send('page-captured', { url, timestamp: Date.now() });
    }
    return { success: true };
  });
}