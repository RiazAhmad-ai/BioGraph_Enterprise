import React, { useEffect, useRef } from 'react';
import { MessageSquare, Sparkles, User, Bot, Activity, Box } from 'lucide-react';
import { apiClient } from '../../api/client';
import AdmetChart from './AdmetChart';
import AiExplanation from './AiExplanation';

export default function SingleResultDisplay({ result, chatHistory }) { // ✅ Receive chatHistory
  const chatEndRef = useRef(null);
  
  if (!result) return null;

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // 1. GLOBAL STYLE CONFIGURATION
  const styles = {
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr', 
      gridTemplateRows: 'minmax(400px, 1fr) minmax(400px, 1fr)', 
      gap: '25px', 
      padding: '25px',
      width: '100%',
      height: '100%',
      boxSizing: 'border-box',
    },
    panel: {
      background: 'rgba(255, 255, 255, 0.03)',
      border: `1px solid ${result.color}20`,
      borderRadius: '24px', 
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden', 
      position: 'relative',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(5px)',
    },
    label: (isLeft = false) => ({
      position: 'absolute',
      top: '15px',
      [isLeft ? 'left' : 'right']: '20px', 
      color: isLeft ? '#00f3ff' : result.color,
      fontSize: '11px',
      fontWeight: 'bold',
      letterSpacing: '1px',
      opacity: 0.8,
      zIndex: 10,
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    })
  };

  return (
    <div className="fade-in-text" style={{ width: '100%', height: '100%', overflowY: 'auto' }}>

      {/* MAIN SYMMETRIC GRID */}
      <div style={styles.gridContainer}>
          
          {/* --- PANEL 1: AI ANALYSIS (Top Left) --- */}
          <div style={styles.panel}>
             <div style={{ flex: 1, overflow: 'hidden' }}>
                <AiExplanation result={result} />
             </div>
          </div>

          {/* --- PANEL 2: CHEMICAL STRUCTURE (Top Right) --- */}
          <div style={styles.panel}>
            <div style={styles.label()}>
              <Box size={14}/> 2D STRUCTURE
            </div>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <img 
                  src={apiClient.getImageUrl(result.smiles)} 
                  alt="Structure"
                  style={{ 
                    width: '90%', 
                    maxHeight: '250px', 
                    objectFit: 'contain', 
                    filter: `invert(1) brightness(2) drop-shadow(0 0 15px ${result.color})`,
                    marginBottom: '15px'
                  }}
              />
              <div style={{ 
                  color: '#888', fontSize: '11px', fontFamily: 'monospace', 
                  textAlign: 'center', wordBreak: 'break-all', maxWidth: '90%', 
                  background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '8px'
              }}>
                  {result.smiles}
              </div>
            </div>
          </div>

          {/* --- PANEL 3: AI CHAT ASSISTANT (Bottom Left) --- */}
          <div style={styles.panel}>
             <div style={styles.label(true)}>
                 <MessageSquare size={14} /> AI ASSISTANT
             </div>

             <div style={{ flex: 1, padding: '50px 20px 20px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                {chatHistory && chatHistory.length > 0 ? (
                    chatHistory.map((msg, index) => (
                        <div key={index} style={{
                            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '85%',
                            background: msg.role === 'user' ? 'rgba(0, 243, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                            border: msg.role === 'user' ? '1px solid rgba(0, 243, 255, 0.3)' : '1px solid #333',
                            borderRadius: '12px',
                            padding: '12px',
                            color: '#e0e0e0',
                            fontSize: '13px',
                            lineHeight: '1.5'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', fontSize: '10px', color: msg.role === 'user' ? '#00f3ff' : '#888', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                {msg.role === 'user' ? <User size={10}/> : <Bot size={10}/>} 
                                {msg.role === 'user' ? 'YOU' : 'AI DOCTOR'}
                            </div>
                            {msg.content}
                        </div>
                    ))
                ) : (
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.4 }}>
                        <Sparkles size={40} style={{ marginBottom: '15px', color: '#00f3ff' }} />
                        <div style={{ textAlign: 'center', fontSize: '14px' }}>
                           ASK AI DOCTOR<br/>
                           <span style={{ fontSize: '12px' }}>Use the bottom bar to chat.</span>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
             </div>
          </div>

          {/* --- PANEL 4: ADMET RADAR CHART (Bottom Right) --- */}
          <div style={styles.panel}>
             <div style={styles.label()}>
                 <Activity size={14} /> ADMET RADAR CHART
             </div>

             <div style={{ 
               flex: 1, 
               display: 'flex', 
               alignItems: 'center', 
               justifyContent: 'center', 
               padding: '20px',
               overflow: 'hidden'
             }}>
                <div style={{ width: '100%', height: '100%', display:'flex', justifyContent:'center', alignItems:'center' }}>
                   {/* ✅ New Authentic Radar Chart */}
                   <AdmetChart admet={result.admet} color={result.color} />
                </div>
             </div>
          </div>

      </div>
    </div>
  );
}