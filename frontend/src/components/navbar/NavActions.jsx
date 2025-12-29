import React from 'react';
import { Home, Info, Settings } from 'lucide-react';
import HistoryDropdown from '../common/HistoryDropdown';

export default function NavActions({ showAbout, setShowAbout, onHistorySelect, onOpenSettings }) {
  return (
    <div className="nav-right">
      
      {/* History Dropdown */}
      <HistoryDropdown onSelectResult={onHistorySelect} />

      {/* Divider */}
      <div className="nav-divider"></div>

      {/* Home Button */}
      <div 
        className={`nav-link ${!showAbout ? 'active-btn' : ''} nav-icon-btn`}
        onClick={() => setShowAbout(false)}
        title="Dashboard"
      >
        <Home size={18} />
      </div>

      {/* About Button */}
      <div 
        className={`nav-link ${showAbout ? 'active-btn' : ''} nav-icon-btn`}
        onClick={() => setShowAbout(true)}
        title="About"
      >
        <Info size={18} />
      </div>

      {/* Settings Button */}
      <div 
        className="nav-link nav-icon-btn"
        onClick={onOpenSettings} 
        title="System Settings"
      >
        <Settings size={18} />
      </div>

    </div>
  );
}