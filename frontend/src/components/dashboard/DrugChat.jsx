import React, { useState } from 'react';
import { Send, Loader } from 'lucide-react';
import { apiClient } from '../../api/client';

export default function DrugChat({ result, compact, setChatHistory }) { // ✅ Receive setChatHistory
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const question = input;
    setInput('');
    setLoading(true);

    // 1. User ka sawal foran add karein
    setChatHistory(prev => [...prev, { role: 'user', content: question }]);

    try {
      // 2. API Call
      const data = await apiClient.askDrugAI(question, {
        name: result.name,
        smiles: result.smiles,
        score: result.score,
        admet: result.admet,
        active_sites: result.active_sites
      });

      // 3. AI ka jawab append karein (Purana data + Naya Jawab)
      setChatHistory(prev => [
        ...prev, 
        { role: 'ai', content: data.answer || "Sorry, I couldn't analyze that." }
      ]);

    } catch (error) {
      setChatHistory(prev => [
        ...prev, 
        { role: 'ai', content: "Error connecting to AI server." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px', width: '100%' }}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={loading ? "AI is thinking..." : "Ask about this drug..."}
        disabled={loading}
        style={{
          flex: 1,
          background: 'rgba(0,0,0,0.3)',
          border: '1px solid #333',
          color: '#fff',
          padding: '10px 15px',
          borderRadius: '20px',
          outline: 'none'
        }}
      />
      <button 
        type="submit" 
        disabled={loading}
        style={{
          background: compact ? 'transparent' : '#00f3ff',
          border: compact ? '1px solid #333' : 'none',
          color: compact ? '#00f3ff' : '#000',
          width: '40px', height: '40px',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer'
        }}
      >
        {loading ? <Loader size={18} className="spin-loader"/> : <Send size={18} />}
      </button>
    </form>
  );
}