import React from "react";
import "./sessionExpiry.css"; // Assuming you will add some basic styling

const SessionExpiryModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Session Expired</h2>
        <p>Your session has expired.</p>
        <div className="modal-actions">
          {/* <button className="extend-btn" onClick={onExtendSession}>
            Extend Session
          </button> */}
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionExpiryModal;
