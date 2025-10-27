// src/components/Widget/CaptureWidget.jsx
import React, { useState } from 'react';
import { Target, Settings } from 'lucide-react';
import './CaptureWidget.css';

const CaptureWidget = () => {
  const [isCapturing, setIsCapturing] = useState(false);

  const handleCapture = async () => {
    setIsCapturing(true);
    try {
      // This will communicate with the extension to capture current page
      await window.electronAPI.capturePage(window.location.href);
      setTimeout(() => setIsCapturing(false), 1000);
    } catch (error) {
      console.error('Capture failed:', error);
      setIsCapturing(false);
    }
  };

  return (
    <div className="capture-widget">
      <div className="widget-content">
        <button 
          className={`capture-button ${isCapturing ? 'capturing' : ''}`}
          onClick={handleCapture}
          disabled={isCapturing}
        >
          <Target size={24} />
          <span>{isCapturing ? 'Capturing...' : 'Capture Job'}</span>
        </button>
        
        <button className="widget-settings">
          <Settings size={16} />
        </button>
      </div>
    </div>
  );
};

export default CaptureWidget;