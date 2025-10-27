// src/App.jsx
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Dashboard from './components/Dashboard/Dashboard';
import ProjectSetup from './components/Tracker/ProjectSetup';
import TemplateManager from './components/Templates/TemplateManager';
import CaptureWidget from './components/Widget/CaptureWidget';
import Sidebar from './components/Common/Sidebar';
import Header from './components/Common/Header';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Main Application Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="projects/new" element={<ProjectSetup />} />
            <Route path="projects/:id" element={<ProjectSetup />} />
            <Route path="templates" element={<TemplateManager />} />
          </Route>
          
          {/* Widget Route (separate window) */}
          <Route path="/widget" element={<CaptureWidget />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

function MainLayout() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="content-area">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects/new" element={<ProjectSetup />} />
            <Route path="/projects/:id" element={<ProjectSetup />} />
            <Route path="/templates" element={<TemplateManager />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;