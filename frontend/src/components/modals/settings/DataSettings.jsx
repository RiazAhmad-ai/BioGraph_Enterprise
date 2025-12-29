import React from 'react';
import { Database, RefreshCw } from 'lucide-react';

export default function DataSettings({ settings, setSettings }) {
  return (
    <div className="setting-section">
      <div className="label-group">
        <Database size={16} color="#ff0055" />
        <span className="setting-label">Data Management</span>
      </div>
      <div className="flex-row">
        <span className="setting-sublabel">History Limit</span>
        <select 
          value={settings.historyLimit}
          onChange={(e) => setSettings({...settings, historyLimit: parseInt(e.target.value)})}
          className="select-input"
        >
          <option value="10">Last 10 Scans</option>
          <option value="20">Last 20 Scans</option>
          <option value="50">Last 50 Scans</option>
        </select>
      </div>
      
      <button 
        onClick={() => { localStorage.removeItem('biograph_history'); window.dispatchEvent(new Event('historyUpdated')); }}
        className="danger-btn"
      >
        <RefreshCw size={14} /> Clear All History
      </button>
    </div>
  );
}