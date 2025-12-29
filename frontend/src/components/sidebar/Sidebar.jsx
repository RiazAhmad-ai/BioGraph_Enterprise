import React from 'react';
import { Database, Upload, FlaskConical, ChevronsLeft, ChevronsRight, Zap } from 'lucide-react';
import ManualMode from './ManualMode';
import AutoMode from './AutoMode';
import UploadMode from './UploadMode';

import '../../styles/components/sidebar.css';

export default function Sidebar({
  activeTab, setActiveTab, target, setTarget, smiles, setSmiles, 
  selectedFile, setSelectedFile, fileInputRef, handleFileSelect, 
  handleScan, loading, isSidebarOpen, setIsSidebarOpen
}) {
  
  // -- COLLAPSED VIEW --
  if (!isSidebarOpen) {
    return (
      <div className="glass-panel panel-left collapsed sidebar-collapsed">
        <div className="sidebar-toggle-btn" onClick={() => setIsSidebarOpen(true)}><ChevronsRight size={24} /></div>
        <div className={`sidebar-icon-btn ${activeTab === 'manual' ? 'active' : ''}`} onClick={() => { setActiveTab('manual'); setIsSidebarOpen(true); }}><FlaskConical size={24} /></div>
        <div className={`sidebar-icon-btn ${activeTab === 'auto' ? 'active' : ''}`} onClick={() => { setActiveTab('auto'); setIsSidebarOpen(true); }}><Database size={24} /></div>
        <div className={`sidebar-icon-btn ${activeTab === 'upload' ? 'active' : ''}`} onClick={() => { setActiveTab('upload'); setIsSidebarOpen(true); }}><Upload size={24} /></div>
      </div>
    );
  }

  // -- EXPANDED VIEW --
  return (
    <div className="glass-panel panel-left sidebar-expanded">
      <div className="panel-header sidebar-header">
        <div className="sidebar-header-content">
          <Database size={20} color="#00f3ff" />
          <h3 className="panel-title">INPUT CONFIG</h3>
        </div>
        <div className="mobile-hide sidebar-close-btn" onClick={() => setIsSidebarOpen(false)}><ChevronsLeft size={20} color="#666" /></div>
      </div>

      <div className="sidebar-body">
        {/* TABS */}
        <div className="tab-group sidebar-tabs">
          <button className={`tab-btn ${activeTab === 'manual' ? 'active' : ''}`} onClick={() => setActiveTab('manual')}>MANUAL</button>
          <button className={`tab-btn ${activeTab === 'auto' ? 'active' : ''}`} onClick={() => setActiveTab('auto')}>AUTO DB</button>
          <button className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`} onClick={() => setActiveTab('upload')}>UPLOAD</button>
        </div>

        {/* MODE CONTENT - Clean Switch Logic */}
        {activeTab === 'manual' && <ManualMode target={target} setTarget={setTarget} smiles={smiles} setSmiles={setSmiles} />}
        {activeTab === 'auto' && <AutoMode target={target} setTarget={setTarget} />}
        {activeTab === 'upload' && <UploadMode target={target} setTarget={setTarget} fileInputRef={fileInputRef} handleFileSelect={handleFileSelect} selectedFile={selectedFile} setSelectedFile={setSelectedFile} />}
      
      </div>

      {/* FOOTER BUTTON */}
      <div className="sidebar-footer">
        <button className="cyber-btn sidebar-action-btn" onClick={handleScan} disabled={loading}>
          <div className="btn-content">
            {loading ? <span className="animate-spin btn-content-wrapper"><Zap size={20} /></span> : <Zap size={20} />}
            {loading ? "PROCESSING..." : (activeTab === 'manual' ? "INITIATE ANALYSIS" : "START PROCESS")}
          </div>
        </button>
      </div>

    </div>
  );
}