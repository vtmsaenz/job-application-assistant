// browser-extension/background/background.js
// Service worker for Chrome Extension

let desktopAppConnected = false;
let nativePort = null;

// Connect to desktop app via native messaging
function connectToDesktopApp() {
  try {
    nativePort = chrome.runtime.connectNative('com.jobtracker.nativemessaging');
    
    nativePort.onMessage.addListener((message) => {
      console.log('Received from desktop app:', message);
      handleDesktopMessage(message);
    });

    nativePort.onDisconnect.addListener(() => {
      console.log('Disconnected from desktop app');
      desktopAppConnected = false;
      nativePort = null;
    });

    desktopAppConnected = true;
  } catch (error) {
    console.error('Failed to connect to desktop app:', error);
    desktopAppConnected = false;
  }
}

// Handle messages from desktop app
function handleDesktopMessage(message) {
  switch (message.type) {
    case 'TEMPLATES_RESPONSE':
      // Store templates for content script to use
      chrome.storage.local.set({ templates: message.data });
      break;
    
    case 'FILL_FORM':
      // Send fill command to active tab
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'fillForm',
            data: message.data
          });
        }
      });
      break;
  }
}

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'captureJob':
      handleJobCapture(request.data, sender.tab);
      sendResponse({ success: true });
      break;
    
    case 'requestTemplates':
      requestTemplatesFromDesktop(request.jobTitle);
      sendResponse({ success: true });
      break;
    
    case 'saveApplication':
      saveApplicationToDesktop(request.data);
      sendResponse({ success: true });
      break;
    
    case 'checkConnection':
      sendResponse({ connected: desktopAppConnected });
      break;
  }
  return true;
});

// Capture job posting data
function handleJobCapture(data, tab) {
  if (!desktopAppConnected) {
    connectToDesktopApp();
  }
  
  const capturedData = {
    type: 'JOB_CAPTURED',
    data: {
      url: tab.url,
      title: tab.title,
      ...data,
      capturedAt: new Date().toISOString()
    }
  };
  
  if (nativePort) {
    nativePort.postMessage(capturedData);
  } else {
    console.error('Desktop app not connected');
  }
}

// Request templates from desktop app
function requestTemplatesFromDesktop(jobTitle) {
  if (!desktopAppConnected) {
    connectToDesktopApp();
  }
  
  if (nativePort) {
    nativePort.postMessage({
      type: 'REQUEST_TEMPLATES',
      jobTitle: jobTitle
    });
  }
}

// Save application to desktop
function saveApplicationToDesktop(data) {
  if (!desktopAppConnected) {
    connectToDesktopApp();
  }
  
  if (nativePort) {
    nativePort.postMessage({
      type: 'SAVE_APPLICATION',
      data: data
    });
  }
}

// Try to connect on install
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
  connectToDesktopApp();
});