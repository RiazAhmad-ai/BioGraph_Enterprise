import React from 'react';
import { X } from 'lucide-react';

// ✅ MODULAR IMPORTS
import MolecularProperties from '../analysis-modal/MolecularProperties';
import SafetyAnalysis from '../analysis-modal/SafetyAnalysis';
import SafetyVerdict from '../analysis-modal/SafetyVerdict';

// Styles
import '../../styles/components/modals.css';

export default function AnalysisModal({ result, onClose }) {
  if (!result || !result.admet) return null;

  return (
    <div className="modal-overlay">

      {/* Glass Modal Box */}
      <div
        className="modal-box"
        style={{
            border: `1px solid ${result.color}`,
            boxShadow: `0 0 60px ${result.color}30`
        }}
      >

        {/* Header */}
        <div className="modal-header">
          <div>
            <div className="modal-subtitle">DETAILED ANALYSIS</div>
            <h2 className="modal-title">{result.name}</h2>
          </div>
          <button onClick={onClose} className="modal-close-btn hover-text-white">
            <X size={28} />
          </button>
        </div>

        {/* Content Grid */}
        <div className="modal-grid">

          {/* Section 1: Physical Properties */}
          <MolecularProperties admet={result.admet} />

          {/* Section 2: Safety & Rules */}
          <SafetyAnalysis admet={result.admet} />

        </div>

        {/* Final Verdict Box */}
        <SafetyVerdict admet={result.admet} />

      </div>
    </div>
  );
}