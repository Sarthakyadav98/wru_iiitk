import React from 'react';

const PathwayModal = ({ show, pathwayData, selectedFaculty, onClose }) => {
  if (!show || !pathwayData) return null;

  return (
    <div className="pathway-modal" onClick={onClose}>
      <div className="pathway-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        
        <div className="pathway-header">
          <h2>Pathway to {selectedFaculty?.name}</h2>
          <p>Room: {pathwayData.room}</p>
        </div>
        
        <div className="building-info">
          <h3><i className="fas fa-building"></i> {pathwayData.building}</h3>
          <p><strong>Floor:</strong> {pathwayData.floor}</p>
        </div>
        
        <h3 style={{ marginBottom: '15px', color: '#333' }}>
          <i className="fas fa-route"></i> Step-by-step directions:
        </h3>
        
        <ol className="pathway-steps">
          {pathwayData.pathway.map((step, index) => (
            <li key={index} className="pathway-step">
              <div className="step-number">{index + 1}</div>
              <div className="step-text">{step}</div>
            </li>
          ))}
        </ol>
        
        <div style={{ marginTop: '20px', padding: '15px', background: '#f0f8ff', borderRadius: '10px' }}>
          <h4 style={{ color: '#667eea', marginBottom: '10px' }}>
            <i className="fas fa-info-circle"></i> Additional Information
          </h4>
          {selectedFaculty?.contact.phone && (
            <p><strong>Phone:</strong> {selectedFaculty.contact.phone}</p>
          )}
          {selectedFaculty?.contact.email && (
            <p><strong>Email:</strong> {selectedFaculty.contact.email}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PathwayModal;