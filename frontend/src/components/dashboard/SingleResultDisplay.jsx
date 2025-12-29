import React, { useEffect, useRef, useState } from 'react';
import { MessageSquare, Sparkles, User, Bot, Activity, Box, Volume2, VolumeX } from 'lucide-react';
import { apiClient } from '../../api/client';
import AdmetChart from './AdmetChart';
import AiExplanation from './AiExplanation';

export default function SingleResultDisplay({ result, chatHistory }) {
  const chatEndRef = useRef(null);
  
  // ✅ Track karega ke kaunsa message abhi bol raha hai (by Index)
  const [speakingIndex, setSpeakingIndex] = useState(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // ✅ SMART SPEAK FUNCTION
  const speakText = (text, index) => {
    if ('speechSynthesis' in window) {
      // Pehle agar kuch chal raha hai to band karein
      window.speechSynthesis.cancel(); 

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0; 
      utterance.pitch = 1.0;
      
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => v.lang.includes('en') && !v.name.includes('Google')); 
      if (preferred) utterance.voice = preferred;
      
      // ✅ Event Listeners
      utterance.onstart = () => setSpeakingIndex(index); // Icon ko Stop bana do
      utterance.onend = () => setSpeakingIndex(null);    // Wapis Speaker bana do
      utterance.onerror = () => setSpeakingIndex(null);  // Error aaye to bhi reset

      window.speechSynthesis.speak(utterance);
    }
  };

  // ✅ STOP FUNCTION
  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null); // State reset
    }
  };

  // Cleanup on unmount (agar user tab change kare to awaz band ho)
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  if (!result) return null;

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
             
             {/* Chat Container */}
             <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                {/* Header Label (No Extra Button Here) */}
                <div style={{ 
                    display: 'flex', alignItems: 'center', gap: '6px', 
                    color: '#00f3ff', fontSize: '11px', fontWeight: 'bold', 
                    letterSpacing: '1px', opacity: 0.8, marginBottom: '10px' 
                }}>
                    <MessageSquare size={14} /> AI ASSISTANT
                </div>

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
                            {/* Message Header Row */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                                {/* Left: Name & Icon */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: msg.role === 'user' ? '#00f3ff' : '#888', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                    {msg.role === 'user' ? <User size={10}/> : <Bot size={10}/>} 
                                    {msg.role === 'user' ? 'YOU' : 'BIOGRAPH AI'} 
                                </div>

                                {/* ✅ DYNAMIC BUTTON: Speaker <-> Stop */}
                                {msg.role === 'ai' && (
                                  speakingIndex === index ? (
                                      // 🛑 STOP BUTTON (Active State)
                                      <button 
                                        onClick={stopSpeech}
                                        title="Stop Speaking"
                                        className="pulse-red"
                                        style={{ 
                                            background: 'rgba(255, 0, 85, 0.2)', 
                                            border: '1px solid #ff0055', 
                                            color: '#ff0055', 
                                            cursor: 'pointer', 
                                            padding: '4px',
                                            borderRadius: '50%', // Round button
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            width: '24px', height: '24px'
                                        }}
                                      >
                                        <VolumeX size={12} />
                                      </button>
                                  ) : (
                                      // 🔊 SPEAKER BUTTON (Default State)
                                      <button 
                                        onClick={() => speakText(msg.content, index)}
                                        title="Read Aloud"
                                        className="hover-glow-icon"
                                        style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', padding: 0 }}
                                      >
                                        <Volume2 size={12} />
                                      </button>
                                  )
                                )}
                            </div>

                            {/* Message Content */}
                            {msg.content}
                        </div>
                    ))
                ) : (
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.4, minHeight: '200px' }}>
                        <Sparkles size={40} style={{ marginBottom: '15px', color: '#00f3ff' }} />
                        <div style={{ textAlign: 'center', fontSize: '14px' }}>
                           ASK BIOGRAPH AI<br/>
                           <span style={{ fontSize: '12px' }}>Use voice or text to chat.</span>
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
                   <AdmetChart admet={result.admet} color={result.color} />
                </div>
             </div>
          </div>

      </div>
      
      {/* Styles for Hover & Pulse */}
      <style>{`
        .hover-glow-icon:hover { color: #00f3ff; filter: drop-shadow(0 0 5px #00f3ff); transition: 0.3s; }
        .pulse-red { animation: pulseRed 1.5s infinite; }
        @keyframes pulseRed { 0% { box-shadow: 0 0 0 0 rgba(255, 0, 85, 0.4); } 70% { box-shadow: 0 0 0 6px rgba(255, 0, 85, 0); } 100% { box-shadow: 0 0 0 0 rgba(255, 0, 85, 0); } }
      `}</style>
    </div>
  );
}