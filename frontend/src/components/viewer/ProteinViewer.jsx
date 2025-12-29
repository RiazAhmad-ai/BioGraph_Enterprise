import React, { useEffect, useRef, useState } from 'react';
import * as $3Dmol from '3dmol/build/3Dmol.js';
import { Loader } from 'lucide-react';

import ViewerControls from './ViewerControls';

// Styles
import '../../styles/components/viewer.css';

export default function ProteinViewer({ pdbId, onClose }) {
  const viewerRef = useRef(null);
  const viewer = useRef(null);

  const [loading, setLoading] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [error, setError] = useState(null);
  
  // Load Default Setting
  const [viewMode, setViewMode] = useState(() => {
    try { return JSON.parse(localStorage.getItem('biograph_settings') || '{}').defaultView || 'surface'; } 
    catch { return 'surface'; }
  });

  // Apply View Style
  const applyView = (mode) => {
    if (!viewer.current) return;
    const v = viewer.current;
    const settings = JSON.parse(localStorage.getItem('biograph_settings') || '{}');
    const isHighQuality = settings.graphicsQuality !== 'low';

    v.removeAllSurfaces(); v.removeAllLabels(); v.setStyle({}, {});

    if (mode === 'cartoon') v.setStyle({}, { cartoon: { color: 'spectrum', thickness: isHighQuality ? 1.2 : 0.8 } });
    if (mode === 'surface') {
      v.setStyle({}, { cartoon: { color: 'spectrum', thickness: 0.7 } });
      v.addSurface($3Dmol.SurfaceType.VDW, { opacity: 0.35, color: '#ccf6ff', quality: isHighQuality ? 2 : 0 }); 
    }
    if (mode === 'ligand') {
      v.setStyle({}, { line: { color: '#555', opacity: 0.3 } });
      v.setStyle({ hetflag: true }, { stick: { colorscheme: 'magentaCarbon', radius: 0.45 } });
      v.addSurface($3Dmol.SurfaceType.VDW, { opacity: 0.6, color: 'orange' }, { within: { distance: 6, sel: { hetflag: true } } });
      v.zoomTo({ hetflag: true });
    } else v.zoomTo();

    v.render();
  };

  // Initialize Viewer
  useEffect(() => {
    if (!viewerRef.current || !pdbId) return;
    const controller = new AbortController();
    const settings = JSON.parse(localStorage.getItem('biograph_settings') || '{}');

    viewerRef.current.innerHTML = '';
    viewer.current = $3Dmol.createViewer(viewerRef.current, { backgroundColor: '#050505', antialias: settings.graphicsQuality !== 'low' });

    fetch(`https://files.rcsb.org/download/${pdbId}.pdb`, { signal: controller.signal })
      .then(res => { if(!res.ok) throw new Error('PDB not found'); return res.text(); })
      .then(data => {
        if (!viewer.current) return;
        viewer.current.addModel(data, 'pdb');
        viewer.current.setStyle({ resn: 'HOH' }, { hidden: true });
        applyView(viewMode);
        setLoading(false);
      })
      .catch(err => { if(err.name !== 'AbortError') { console.error(err); setError(err.message); setLoading(false); } });

    return () => { controller.abort(); if(viewer.current) { viewer.current.clear(); viewer.current = null; } };
  }, [pdbId, viewMode]);

  // Actions
  const toggleSpin = () => { if(viewer.current) { isSpinning ? viewer.current.spin(false) : viewer.current.spin('y', 0.1); setIsSpinning(!isSpinning); } };
  const resetView = () => viewer.current?.zoomTo();
  const capture = () => { if(viewer.current) { const a = document.createElement('a'); a.href = viewer.current.pngURI(); a.download = `${pdbId}.png`; a.click(); } };

  return (
    <div className="viewer-overlay">
      <div className="viewer-modal">
        {/* Canvas Area */}
        <div className="viewer-canvas-wrap">
          {loading && <div className="viewer-loader"><Loader className="spin-loader" size={32} /></div>}
          {error && <div className="viewer-error">{error}</div>}
          <div ref={viewerRef} className="viewer-canvas" />
        </div>

        {/* Controls Side Panel */}
        <ViewerControls 
          pdbId={pdbId} viewMode={viewMode} setViewMode={setViewMode} applyView={applyView}
          toggleSpin={toggleSpin} isSpinning={isSpinning} resetView={resetView} capture={capture} onClose={onClose}
        />
      </div>
    </div>
  );
}