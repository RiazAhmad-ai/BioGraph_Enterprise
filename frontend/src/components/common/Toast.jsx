import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import '../../styles/components/toast.css';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const styles = {
    info: { bg: 'rgba(0, 243, 255, 0.1)', border: '#00f3ff', icon: <Info size={18} color="#00f3ff" /> },
    success: { bg: 'rgba(0, 255, 100, 0.1)', border: '#00ff64', icon: <CheckCircle size={18} color="#00ff64" /> },
    error: { bg: 'rgba(255, 0, 85, 0.1)', border: '#ff0055', icon: <AlertCircle size={18} color="#ff0055" /> },
  };

  const style = styles[type] || styles.info;

  return (
    <div className="toast-container" style={{ border: `1px solid ${style.border}`, backgroundColor: style.bg }}>
      {style.icon}
      <span className="toast-message">{message}</span>
      <button onClick={onClose} className="toast-close-btn">
        <X size={14} />
      </button>
    </div>
  );
};

export default Toast;