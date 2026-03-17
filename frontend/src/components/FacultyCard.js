import React from 'react';

const FacultyCard = ({ facultyMember, onClick }) => {
  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/60x60/667eea/white?text=' + 
                   facultyMember.name.split(' ').map(n => n[0]).join('');
  };

  return (
    <div className="faculty-card" onClick={() => onClick(facultyMember)}>
      <div className="faculty-header">
        <img 
          src={facultyMember.imageUrl} 
          alt={facultyMember.name}
          className="faculty-image"
          onError={handleImageError}
        />
        <div className="faculty-info">
          <h3>{facultyMember.name}</h3>
          <p>{facultyMember.designation}</p>
        </div>
      </div>
      
      {facultyMember.contact.room && (
        <div className="room-info">
          <div className="room-number">
            <i className="fas fa-map-marker-alt"></i> Room: {facultyMember.contact.room}
          </div>
        </div>
      )}
      
      <div className="contact-info">
        {facultyMember.contact.phone && (
          <div className="contact-item">
            <i className="fas fa-phone"></i>
            {facultyMember.contact.phone}
          </div>
        )}
        {facultyMember.contact.email && (
          <div className="contact-item">
            <i className="fas fa-envelope"></i>
            {facultyMember.contact.email}
          </div>
        )}
      </div>
      
      {facultyMember.areas && facultyMember.areas.length > 0 && (
        <div className="areas-info" style={{ marginTop: '10px', fontSize: '0.8rem', color: '#666' }}>
          <strong>Areas:</strong> {facultyMember.areas.slice(0, 3).join(', ')}
          {facultyMember.areas.length > 3 && '...'}
        </div>
      )}
    </div>
  );
};

export default FacultyCard;