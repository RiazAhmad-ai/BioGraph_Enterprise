import React, { useState } from 'react';
import { History, ChevronDown, Trash2, Clock, Search } from 'lucide-react';
import { useHistory } from '../../hooks/useHistory'; // ✅ Adjusted Path (one level deeper now?)

// Styles
import '../../styles/components/history.css';

export default function HistoryDropdown({ onSelectResult }) {
  const [isOpen, setIsOpen] = useState(false);
  const { history, clearHistory } = useHistory();

  const handleSelect = (item) => {
    onSelectResult(item);
    setIsOpen(false);
  };

  return (
    <div className="history-dropdown-wrapper">
      {/* Toggle Button */}
      <div
        className="nav-link history-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Recent Scans"
      >
        <History size={18} />
        <ChevronDown
          size={12}
          className="history-chevron"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop to close on click outside */}
          <div className="history-backdrop" onClick={() => setIsOpen(false)}></div>

          <div className="glass-panel history-menu">

            {/* Header */}
            <div className="history-header">
              <span className="history-title">RECENT ACTIVITY</span>
              {history.length > 0 && (
                <button onClick={clearHistory} className="history-clear-btn" title="Clear History">
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            {/* List */}
            <div className="history-list">
              {history.length === 0 ? (
                <div className="history-empty">
                  <History size={24} className="history-empty-icon" />
                  <div>No recent scans</div>
                </div>
              ) : (
                history.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelect(item)}
                    className="history-item"
                  >
                    <div className="history-icon-box" style={{
                      background: item.color === '#00f3ff' ? 'rgba(0, 243, 255, 0.1)' : 'rgba(255, 0, 85, 0.1)',
                      border: `1px solid ${item.color}40`
                    }}>
                       {item.status === 'ACTIVE' ? <Search size={14} color={item.color} /> : <Clock size={14} color={item.color} />}
                    </div>
                    <div className="history-details">
                      <div className="history-name">{item.name}</div>
                      <div className="history-meta">
                         <span>Score: {item.score}</span>
                         <span style={{ color: item.color }}>{item.status}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </>
      )}
    </div>
  );
}