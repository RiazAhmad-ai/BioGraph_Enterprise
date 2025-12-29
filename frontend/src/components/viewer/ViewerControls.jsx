import React from 'react';
import { X, Box, Layers, Activity, Eye, RotateCw, Camera, Image } from 'lucide-react';

// ✅ FIX: Component ke bahar define kiya (ab yeh re-create nahi hoga)
const Btn = ({ children, active, danger, onClick }) => (
  <button 
    className={`viewer-btn ${active ? 'active' : ''} ${danger ? 'danger' : ''}`} 
    onClick={onClick}
  >
    {children}
  </button>
);

export default function ViewerControls({ pdbId, viewMode, setViewMode, applyView, toggleSpin, isSpinning, resetView, capture, onClose }) {
  
  return (
    <div className="viewer-panel">
      <div className="viewer-title"><Box size={16} /> {pdbId.toUpperCase()} - STRUCTURE</div>

      <Btn active={viewMode === 'surface'} onClick={() => { setViewMode('surface'); applyView('surface'); }}>
        <Activity size={16} /> Glass Surface
      </Btn>

      <Btn active={viewMode === 'cartoon'} onClick={() => { setViewMode('cartoon'); applyView('cartoon'); }}>
        <Layers size={16} /> Ribbon Style
      </Btn>

      <Btn active={viewMode === 'ligand'} onClick={() => { setViewMode('ligand'); applyView('ligand'); }}>
        <Eye size={16} /> Active Sites
      </Btn>

      {/* Divider - Only visible on Desktop via CSS if needed, or remove for grid layout safety */}
      <div className="desktop-divider" style={{height:'1px', background:'#333', margin:'5px 0', gridColumn: '1 / -1'}}></div>

      <Btn onClick={toggleSpin}><RotateCw size={16} /> {isSpinning ? 'Stop Spin' : 'Auto Spin'}</Btn>
      <Btn onClick={resetView}><Camera size={16} /> Reset Cam</Btn>
      <Btn onClick={capture}><Image size={16} /> Screenshot</Btn>

      {/* Spacer for Desktop Flex (Mobile will ignore this due to Grid) */}
      <div style={{ flex: 1 }} className="mobile-hidden" />

      <Btn danger onClick={onClose}><X size={16} /> Close Viewer</Btn>
    </div>
  );
}