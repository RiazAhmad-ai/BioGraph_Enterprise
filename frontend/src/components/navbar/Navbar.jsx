import React from 'react';

// ✅ MODULAR IMPORTS
import BrandLogo from './BrandLogo';
import NavTagline from './NavTagline';
import NavActions from './NavActions';

// Styles
import '../../styles/components/navbar.css';

const Navbar = ({ showAbout, setShowAbout, onHistorySelect, onOpenSettings }) => {
  return (
    <nav className="glass-nav navbar-container">
      
      {/* 1. Left: Brand Logo */}
      <BrandLogo onClick={() => setShowAbout(false)} />
      
      {/* 2. Center: Tagline */}
      <NavTagline />
      
      {/* 3. Right: Actions */}
      <NavActions 
        showAbout={showAbout} 
        setShowAbout={setShowAbout} 
        onHistorySelect={onHistorySelect} 
        onOpenSettings={onOpenSettings} 
      />

    </nav>
  );
};

export default Navbar;