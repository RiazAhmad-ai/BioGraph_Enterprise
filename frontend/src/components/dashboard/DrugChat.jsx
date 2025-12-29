import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader, Sparkles, Mic, MicOff } from 'lucide-react';
import { apiClient } from '../../api/client';

export default function DrugChat({ result, compact, setChatHistory }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  // --- Animation States ---
  const [placeholder, setPlaceholder] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  // --- Voice State ---
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // --- 1. VOICE LOGIC (Web Speech API) ---
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US'; // Auto-detect usually works well mixed

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + (prev ? ' ' : '') + transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech Error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
      setIsFocused(true); // Glow effect on
    }
  };

  // --- 2. TYPING EFFECT LOGIC (Existing) ---
  useEffect(() => {
    const texts = [
      "Ask about toxicity risks...", "Is this molecule stable?", "Explain the binding score...",
      "What are the side effects?", "Can this penetrate the BBB?", "Analyze Lipinski rules..."
    ];
    let loopNum = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;
    let timer;

    const handleType = () => {
      const i = loopNum % texts.length;
      const fullText = texts[i];
      if (isDeleting) {
        setPlaceholder(fullText.substring(0, charIndex - 1));
        charIndex--;
        typeSpeed = 40;
      } else {
        setPlaceholder(fullText.substring(0, charIndex + 1));
        charIndex++;
        typeSpeed = 80;
      }
      if (!isDeleting && charIndex === fullText.length) {
        isDeleting = true; typeSpeed = 2000;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false; loopNum++; typeSpeed = 500;
      }
      timer = setTimeout(handleType, typeSpeed);
    };
    timer = setTimeout(handleType, 500);
    return () => clearTimeout(timer);
  }, []);

  // --- 3. SEND HANDLER ---
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const question = input;
    setInput('');
    setLoading(true);

    setChatHistory(prev => [...prev, { role: 'user', content: question }]);

    try {
      const data = await apiClient.askDrugAI(question, {
        name: result.name,
        smiles: result.smiles,
        score: result.score,
        admet: result.admet,
        active_sites: result.active_sites
      });

      setChatHistory(prev => [
        ...prev, 
        { role: 'ai', content: data.answer || "Sorry, I couldn't analyze that." }
      ]);
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'ai', content: "Error connecting to AI server." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSend} 
      style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}
    >
      <div style={{
        position: 'relative', display: 'flex', alignItems: 'center', width: '100%',
        background: 'rgba(10, 10, 15, 0.6)',
        border: isFocused || isListening ? '1px solid #00f3ff' : '1px solid rgba(255,255,255,0.15)',
        boxShadow: isFocused || isListening ? '0 0 15px rgba(0, 243, 255, 0.2)' : 'none',
        borderRadius: '30px', padding: '5px 8px', transition: 'all 0.3s ease', backdropFilter: 'blur(10px)'
      }}>
        
        {/* Icon */}
        <div style={{ paddingLeft: '12px', opacity: isFocused ? 1 : 0.5 }}>
          <Sparkles size={16} color={isFocused ? "#00f3ff" : "#888"} />
        </div>

        {/* Input */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isListening ? "Listening..." : (loading ? "AI is thinking..." : placeholder)}
          disabled={loading}
          style={{
            flex: 1, background: 'transparent', border: 'none', color: '#fff',
            padding: '12px 15px', fontSize: '13px', outline: 'none', width: '100%'
          }}
        />

        {/* ✅ MIC BUTTON (New) */}
        <button
          type="button"
          onClick={toggleListening}
          className="hover-scale"
          title="Speak to AI"
          style={{
            background: isListening ? 'rgba(255, 0, 85, 0.2)' : 'transparent',
            border: isListening ? '1px solid #ff0055' : 'none',
            color: isListening ? '#ff0055' : '#888',
            width: '32px', height: '32px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', marginRight: '5px', transition: '0.3s'
          }}
        >
          {isListening ? <MicOff size={16} className="pulse-red" /> : <Mic size={16} />}
        </button>

        {/* Send Button */}
        <button 
          type="submit" 
          disabled={loading || !input.trim()}
          style={{
            background: input.trim() ? '#00f3ff' : 'rgba(255,255,255,0.1)',
            border: 'none', color: input.trim() ? '#000' : '#555',
            width: '36px', height: '36px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: input.trim() ? 'pointer' : 'default', transition: 'all 0.3s ease', marginRight: '2px'
          }}
        >
          {loading ? <Loader size={16} className="spin-loader"/> : <Send size={16} />}
        </button>
      </div>

      <style>{`
        .spin-loader { animation: spin 1s linear infinite; }
        .pulse-red { animation: pulseRed 1.5s infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes pulseRed { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
        .hover-scale:hover { transform: scale(1.1); color: #fff !important; }
      `}</style>
    </form>
  );
}