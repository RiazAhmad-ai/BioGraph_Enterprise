import React, { useState, useEffect } from 'react';
import { X, Save, Sliders } from 'lucide-react';

// Modular Components
import AISettings from './settings/AISettings';
import VisualSettings from './settings/VisualSettings';
import DataSettings from './settings/DataSettings';

// Styles
import '../../styles/components/modals.css';
import '../../styles/components/settings.css';

export default function SettingsModal({ onClose }) {
  const [settings, setSettings] = useState({
    threshold: 7.0, defaultView: 'surface', graphicsQuality: 'high', historyLimit: 20
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('biograph_settings');
    if (stored) setSettings(JSON.parse(stored));
  }, []);

  const handleSave = () => {
    localStorage.setItem('biograph_settings', JSON.stringify(settings));
    window.dispatchEvent(new Event('settingsUpdated'));
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 800);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sliders size={20} color="#00f3ff" />
            <h3 className="modal-title">SYSTEM CONFIGURATION</h3>
          </div>
          <button onClick={onClose} className="modal-close-btn"><X size={20} /></button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ padding: '20px 0' }}>
          <AISettings settings={settings} setSettings={setSettings} />
          <VisualSettings settings={settings} setSettings={setSettings} />
          <DataSettings settings={settings} setSettings={setSettings} />
        </div>

        {/* Footer */}
        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '15px' }}>
          <button onClick={handleSave} className="cyber-btn" style={{ padding: '10px 20px', display: 'flex', gap: '8px', alignItems: 'center' }}>
            {saved ? "SETTINGS SAVED!" : <><Save size={18} /> SAVE CHANGES</>}
          </button>
        </div>

      </div>
    </div>
  );
}