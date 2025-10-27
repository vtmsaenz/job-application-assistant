// electron/windows/widgetWindow.js
const { BrowserWindow } = require('electron');
const path = require('path');

function createWidgetWindow() {
  const widgetWindow = new BrowserWindow({
    width: 300,
    height: 150,
    alwaysOnTop: true,
    frame: false,
    transparent: true,
    resizable: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../preload.js')
    }
  });

  // Position in bottom-right corner
  const { width, height } = require('electron').screen.getPrimaryDisplay().workAreaSize;
  widgetWindow.setPosition(width - 320, height - 170);

  if (process.env.NODE_ENV === 'development') {
    widgetWindow.loadURL('http://localhost:5173/#/widget');
  } else {
    widgetWindow.loadFile(path.join(__dirname, '../../dist/index.html'), {
      hash: 'widget'
    });
  }

  return widgetWindow;
}

module.exports = { createWidgetWindow };