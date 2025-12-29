import React, { useState } from 'react';
import Navbar from './components/navbar/Navbar';
import Toast from './components/common/Toast';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import SettingsModal from './components/modals/SettingsModal';
import BackgroundEffects from './components/layout/BackgroundEffects'; // ✅ New Import
import "./styles/main.css";

function App() {
  const [showAbout, setShowAbout] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [toast, setToast] = useState(null);
  const [historySelection, setHistorySelection] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  return (
    <div className="app-container">
      {/* 1. Global UI Elements */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}

      {/* ✅ Background Separated */}
      <BackgroundEffects />

      {/* 2. Navigation */}
      <Navbar 
        showAbout={showAbout} 
        setShowAbout={setShowAbout} 
        onHistorySelect={setHistorySelection} 
        onOpenSettings={() => setShowSettings(true)}
      />

      {/* 3. Page Router (Slider Logic) */}
      <div className={`slider-container ${showAbout ? 'slide-active' : ''}`}>
        <Dashboard showToast={showToast} historyLoadData={historySelection} />
        <About />
      </div>
    </div>
  );
}

export default App;