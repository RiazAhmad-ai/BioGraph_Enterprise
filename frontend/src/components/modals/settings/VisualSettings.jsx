import React from 'react';
import { Monitor } from 'lucide-react';

export default function VisualSettings({ settings, setSettings }) {
  return (
    <div className="setting-section">
      <div className="label-group">
        <Monitor size={16} color="#00f3ff" />
        <span className="setting-label">3D Visualization Defaults</span>
      </div>
      
      <div className="flex-row">
        <span className="setting-sublabel">Default View Mode</span>
        <select 
          value={settings.defaultView}
          onChange={(e) => setSettings({...settings, defaultView: e.target.value})}
          className="select-input"
        >
          <option value="surface">Glass Surface (High-Tech)</option>
          <option value="cartoon">Ribbon (Standard)</option>
          <option value="ligand">Active Site Focus</option>
        </select>
      </div>

      <div className="flex-row" style={{ marginTop: '10px' }}>
        <span className="setting-sublabel">Graphics Quality</span>
        <div className="toggle-group">
          <button 
            className={`toggle-btn ${settings.graphicsQuality === 'low' ? 'active' : ''}`}
            onClick={() => setSettings({...settings, graphicsQuality: 'low'})}
          >Low (Fast)</button>
          <button 
            className={`toggle-btn ${settings.graphicsQuality === 'high' ? 'active' : ''}`}
            onClick={() => setSettings({...settings, graphicsQuality: 'high'})}
          >High (Best)</button>
        </div>
      </div>
    </div>
  );
}