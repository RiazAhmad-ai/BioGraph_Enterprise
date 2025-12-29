import React from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, Tooltip 
} from 'recharts';

// --- 1. Scientific Tooltip (With Ideal Ranges) ---
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    // Hum "Drug Candidate" wala payload dhoond rahe hain
    const data = payload.find(p => p.name === 'Drug Candidate')?.payload;
    if (!data) return null;

    return (
      <div style={{
        background: 'rgba(5, 10, 20, 0.98)',
        border: '1px solid rgba(0, 243, 255, 0.5)',
        padding: '12px',
        borderRadius: '6px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
        minWidth: '160px'
      }}>
        <p style={{ color: '#fff', fontSize: '13px', margin: '0 0 8px 0', fontWeight: 'bold', borderBottom:'1px solid #333', paddingBottom:'4px' }}>
          {data.subject}
        </p>
        
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:'12px', marginBottom:'4px' }}>
          <span style={{color:'#888'}}>Detected:</span>
          <span style={{color:'#00f3ff', fontWeight:'bold'}}>{data.fullMark}</span>
        </div>

        <div style={{ display:'flex', justifyContent:'space-between', fontSize:'12px', marginBottom:'6px' }}>
          <span style={{color:'#888'}}>Ideal Range:</span>
          <span style={{color:'#00ff88', fontSize:'11px'}}>{data.limit}</span>
        </div>

        <div style={{ fontSize: '10px', color: '#666', fontStyle:'italic' }}>
          {data.desc}
        </div>
      </div>
    );
  }
  return null;
};

export default function AdmetChart({ admet }) {
  if (!admet) return <div style={{color:'#666', textAlign:'center', marginTop:'50px', fontSize:'12px'}}>Awaiting Molecule Data...</div>;

  // --- 2. Advanced Data Mapping (SwissADME Style) ---
  const formatData = (val, max) => {
    // Simple normalization 0-100 based on Max Limit
    if (val === undefined || val === null) return 0;
    return Math.min(100, (val / max) * 100);
  };

  const data = [
    {
      subject: 'LIPO (LogP)',
      A: formatData(admet.logp, 8),    
      fullMark: admet.logp,
      limit: '< 5.0',
      desc: 'Solubility (Lipophilicity)',
      ideal: 62.5 // Safe Limit marker
    },
    {
      subject: 'SIZE (MW)',
      A: formatData(admet.mw, 800),    
      fullMark: `${admet.mw} g/mol`,
      limit: '< 500 g/mol',
      desc: 'Molecular Weight',
      ideal: 62.5 
    },
    {
      subject: 'POLAR (TPSA)',
      A: formatData(admet.tpsa, 200),
      fullMark: `${admet.tpsa} Å²`,
      limit: '< 140 Å²',
      desc: 'Polar Surface Area',
      ideal: 70
    },
    {
      subject: 'INSOLU (HBA)',
      A: formatData(admet.hba, 15),
      fullMark: admet.hba,
      limit: '< 10 Acceptors',
      desc: 'H-Bond Acceptors',
      ideal: 66
    },
    {
      subject: 'H-DONOR (HBD)',
      A: formatData(admet.hbd, 10),
      fullMark: admet.hbd,
      limit: '< 5 Donors',
      desc: 'H-Bond Donors',
      ideal: 50
    },
    {
      subject: 'FLEX (RotB)',
      A: formatData(admet.rotatable_bonds, 15),
      fullMark: admet.rotatable_bonds,
      limit: '< 10 Bonds',
      desc: 'Rotatable Bonds',
      ideal: 66
    },
    {
      subject: 'DRUG-LIKE (QED)',
      A: (admet.qed || 0) * 100, 
      fullMark: admet.qed,
      limit: '> 0.5',
      desc: 'Drug Likeness Score',
      ideal: 50 
    },
  ];

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '300px', position: 'relative' }}>
      
      {/* Title & Status */}
      <div style={{ position: 'absolute', top: 0, left: 10, zIndex: 5 }}>
         <div style={{ fontSize: '10px', color: '#00f3ff', opacity: 0.8, letterSpacing: '1px', fontWeight:'bold' }}>
            BIOAVAILABILITY RADAR
         </div>
         <div style={{ fontSize: '9px', color: '#666', marginTop:'2px' }}>
            Violations: <span style={{ color: admet.violations > 0 ? '#ff0055' : '#00ff88' }}>{admet.violations}</span>
         </div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          
          <PolarGrid stroke="rgba(255,255,255,0.05)" />
          
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#888', fontSize: 9, fontWeight: 'bold' }} 
          />
          
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />

          {/* 1. IDEAL ZONE (The Safe Area) */}
          <Radar
            name="Safe Limit"
            dataKey="ideal"
            stroke="transparent"
            fill="#00ff88"
            fillOpacity={0.1} 
          />

          {/* 2. ACTUAL DRUG DATA */}
          <Radar
            name="Drug Candidate"
            dataKey="A"
            stroke="#00f3ff"
            strokeWidth={2}
            fill="#00f3ff"
            fillOpacity={0.25}
            isAnimationActive={true}
          />
          
          <Tooltip content={<CustomTooltip />} cursor={false} />
          
        </RadarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div style={{ 
        position:'absolute', bottom:0, width:'100%', 
        display:'flex', justifyContent:'center', gap:'15px', fontSize:'9px', color:'#666' 
      }}>
         <div style={{display:'flex', alignItems:'center', gap:'4px'}}>
            <div style={{width:'8px', height:'8px', background:'rgba(0, 255, 136, 0.2)', border:'1px solid #00ff88'}}></div>
            <span>Ideal Zone</span>
         </div>
         <div style={{display:'flex', alignItems:'center', gap:'4px'}}>
            <div style={{width:'8px', height:'8px', background:'rgba(0, 243, 255, 0.3)', border:'1px solid #00f3ff'}}></div>
            <span>Your Molecule</span>
         </div>
      </div>

    </div>
  );
}