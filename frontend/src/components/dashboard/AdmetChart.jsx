import React from 'react';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, Tooltip } from 'recharts';

// Custom Tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{
        background: 'rgba(10, 10, 20, 0.95)',
        border: `1px solid ${data.fill}`,
        padding: '12px',
        borderRadius: '8px',
        boxShadow: '0 0 15px rgba(0,0,0,0.5)',
        minWidth: '140px'
      }}>
        <p style={{ color: '#fff', fontSize: '13px', margin: '0 0 5px 0', fontWeight: 'bold' }}>
          {data.name}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: '#ccc' }}>Score:</span>
          <span style={{ color: data.fill, fontWeight: 'bold', fontSize: '14px' }}>
            {data.value} <span style={{fontSize:'10px', opacity:0.7}}>/ 10</span>
          </span>
        </div>
        <div style={{ fontSize: '10px', color: '#666', marginTop: '5px' }}>
          Raw: {data.rawVal}
        </div>
      </div>
    );
  }
  return null;
};

export default function AdmetChart({ admet }) {
  if (!admet) return <div style={{color:'#666', textAlign:'center', marginTop:'50px'}}>No Data</div>;

  // Helper to process values safely
  const getVal = (keys, isZeroToOne) => {
    let val = 0;
    let raw = "N/A";
    
    for (const key of keys) {
      const k = Object.keys(admet).find(ak => ak.toLowerCase() === key.toLowerCase());
      if (k && admet[k] !== undefined) {
        val = parseFloat(admet[k]);
        raw = val.toFixed(2);
        break;
      }
    }

    let scaled = val;
    if (isZeroToOne && val <= 1 && val > 0) scaled = val * 10;
    else if (val < 0) scaled = 0; // Negative handling
    else if (val > 10) scaled = 10;

    return { value: parseFloat(scaled.toFixed(1)), rawVal: raw };
  };

  // ✅ DATA WITH DISTINCT COLORS (Yeh "Alag" aur "Clear" look dega)
  const data = [
    { name: 'Absorption', ...getVal(['absorption', 'hia'], true), fill: '#00f3ff' }, // Cyan
    { name: 'Permeability', ...getVal(['permeability', 'bbb'], true), fill: '#bc13fe' }, // Purple
    { name: 'Lipophilicity', ...getVal(['lipophilicity', 'logp'], false), fill: '#ff0055' }, // Red/Pink
    { name: 'Solubility', ...getVal(['solubility', 'logs'], false), fill: '#ffcc00' }, // Yellow
    { name: 'Safety', ...getVal(['safety_score', 'qed'], true), fill: '#00ff88' }, // Green
    { name: 'Metabolism', ...getVal(['metabolism', 'cyp'], true), fill: '#3366ff' }, // Blue
  ];

  // Data ko sort karein taake choti rings andar aur badi bahar hon (Visual clarity ke liye)
  // ya fir fixed order rakhein. Fixed order zyada readable hai compare karne ke liye.
  
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ flex: 1, position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart 
            cx="50%" 
            cy="50%" 
            innerRadius="20%" 
            outerRadius="100%" 
            barSize={15} 
            data={data}
            startAngle={90} // Top se start hoga
            endAngle={-270} // Pura circle
          >
            {/* Background Rings (Grey tracks) */}
            <RadialBar
              minAngle={15}
              label={{ position: 'insideStart', fill: '#fff', fontSize: '10px', fontWeight: 'bold' }} // Labels andar dikhenge
              background={{ fill: 'rgba(255,255,255,0.05)' }}
              clockWise
              dataKey="value"
              cornerRadius={10} // Rounded edges
            />
            
            <Tooltip content={<CustomTooltip />} />
            
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Legend (Neeche saaf saaf likha hua) */}
      <div style={{ 
        display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '15px', 
        padding: '10px', marginTop: '-20px', zIndex: 10 
      }}>
        {data.map((item) => (
          <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.fill }}></div>
            <div style={{ fontSize: '11px', color: '#ccc' }}>
              {item.name}: <strong style={{color:'#fff'}}>{item.value}</strong>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}