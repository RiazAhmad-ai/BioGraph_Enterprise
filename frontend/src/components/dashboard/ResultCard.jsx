import React from 'react';
import { BindingScore, ConfidenceScore } from '../result-card/ScoreSection';
import DrugChat from './DrugChat';

// Styles
import '../../styles/components/result-card.css';

// ✅ Accept setChatHistory prop
export default function ResultCard({ result, cardRef, isSidebarOpen, setChatHistory }) {
  if (!result) return null;

  const containerClass = `result-card ${result.status === 'ACTIVE' ? 'active' : 'inactive'} ${!isSidebarOpen ? 'sidebar-closed' : ''} result-card-container`;

  return (
    <div 
      className={containerClass} 
      style={{ borderColor: result.color }} // Keep dynamic color inline as it depends on result
      ref={cardRef}
    >
      
      {/* 1. LEFT: Binding Score */}
      <div className="result-card-section-left">
        <BindingScore result={result} />
      </div>

      {/* 2. CENTER: Chat Bar (Pass setChatHistory) */}
      <div className="result-card-section-center">
        <DrugChat result={result} compact={true} setChatHistory={setChatHistory} />
      </div>

      {/* 3. RIGHT: Confidence Score */}
      <div className="result-card-section-right">
        <ConfidenceScore result={result} />
      </div>

    </div>
  );
}