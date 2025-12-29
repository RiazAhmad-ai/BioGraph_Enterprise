import React from 'react';
import { BrainCircuit, Sparkles, FileText, Shield, Activity, Target } from 'lucide-react';

// ✅ FIX: Helper Component Moved OUTSIDE
const Section = ({ icon: Icon, title, content, color }) => (
  <div style={{ marginBottom: '15px', animation: 'fadeIn 0.5s ease-in' }}>
    <div style={{ 
      display: 'flex', alignItems: 'center', gap: '8px', 
      marginBottom: '5px', color: color, fontSize: '11px', 
      fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' 
    }}>
      <Icon size={12} /> {title}
    </div>
    <div style={{ 
      fontSize: '12px', color: '#e0e0e0', lineHeight: '1.5', 
      background: 'rgba(0,0,0,0.2)', padding: '10px', 
      borderRadius: '8px', borderLeft: `2px solid ${color}` 
    }}>
      {content || "N/A"}
    </div>
  </div>
);

export default function AiExplanation({ result }) {
  // ✅ Direct Derivation (No State, No Effect)
  const explanation = result?.ai_explanation;

  if (!explanation) return (
    <div style={{ padding: '20px', color: '#666', fontSize: '12px', textAlign: 'center' }}>
      Waiting for AI Analysis...
    </div>
  );

  // Logic: Handle String vs Object
  const displayedData = typeof explanation === 'object' 
    ? explanation 
    : { summary: explanation };

  return (
    <div style={{ 
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: '15px',
      background: 'linear-gradient(135deg, rgba(188, 19, 254, 0.05), rgba(0, 243, 255, 0.05))',
      borderLeft: '4px solid #00f3ff', 
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 243, 255, 0.1)',
      boxSizing: 'border-box',
      overflow: 'hidden' 
    }}>
      
      {/* Header Section */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '15px',
        borderBottom: '1px solid rgba(0, 243, 255, 0.2)',
        paddingBottom: '10px',
        flexShrink: 0 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BrainCircuit size={20} color="#00f3ff" />
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#fff', letterSpacing: '1px' }}>
            BIOGRAPH INTELLIGENCE
            </span>
        </div>
        <Sparkles size={14} color="#bc13fe" className="animate-pulse" />
      </div>

      {/* Content Area (Scrollable) */}
      <div className="custom-scroll" style={{ 
        flex: 1, 
        width: '100%',           
        overflowY: 'auto',       
        paddingRight: '5px'
      }}>
        
        {/* 1. Executive Summary */}
        {displayedData.summary && (
          <Section icon={FileText} title="Executive Summary" content={displayedData.summary} color="#00f3ff" />
        )}

        {/* 2. Mechanism */}
        {displayedData.mechanism && (
          <Section icon={Activity} title="Mechanism of Action" content={displayedData.mechanism} color="#bc13fe" />
        )}

        {/* 3. Safety Analysis */}
        {displayedData.safety_analysis && (
          <Section icon={Shield} title="Safety Profile (ADMET)" content={displayedData.safety_analysis} color="#ff0055" />
        )}

        {/* 4. Conclusion / Clinical Potential */}
        {(displayedData.conclusion || displayedData.clinical_potential) && (
          <Section icon={Target} title="Final Verdict" content={displayedData.conclusion || displayedData.clinical_potential} color="#00ff88" />
        )}

      </div>
      
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(0, 243, 255, 0.3); borderRadius: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(0, 243, 255, 0.6); }
      `}</style>
    </div>
  );
}