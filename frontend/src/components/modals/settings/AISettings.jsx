import React from 'react';
import { Zap } from 'lucide-react';

export default function AISettings({ settings, setSettings }) {
  return (
    <div className="setting-section">
      <div className="label-group">
        <Zap size={16} color="#bc13fe" />
        <span className="setting-label">AI Sensitivity (pKd Threshold)</span>
      </div>
      <div className="control-row">
        <input 
          type="range" min="5" max="10" step="0.1" 
          value={settings.threshold} 
          onChange={(e) => setSettings({...settings, threshold: parseFloat(e.target.value)})}
          style={{ width: '100%', accentColor: '#bc13fe' }}
        />
        <span className="value-badge">{settings.threshold}</span>
      </div>
      <p className="setting-hint">Drugs with score above {settings.threshold} will be marked ACTIVE.</p>
    </div>
  );
}