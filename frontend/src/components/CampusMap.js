import React from 'react';
import './CampusMap.css';

const CampusMap = ({ highlightRoom, onBuildingClick }) => {
  const buildings = [
    {
      id: 'old-academic',
      name: 'Old Academic Block',
      floors: ['AA (Ground)', 'AB (First)', 'AC (Second)'],
      position: { top: '30%', left: '20%' },
      color: '#667eea'
    },
    {
      id: 'new-academic', 
      name: 'New Academic Block',
      floors: ['BA (Ground)', 'BB (First)', 'BC (Second)', 'BD (Third)'],
      position: { top: '30%', right: '20%' },
      color: '#764ba2'
    },
    {
      id: 'central-academic',
      name: 'Central Academic Block',
      floors: ['CAB'],
      position: { top: '50%', left: '45%' },
      color: '#48bb78'
    }
  ];

  const landmarks = [
    { name: 'Main Gate', position: { bottom: '10%', left: '45%' }, icon: 'fas fa-door-open' },
    { name: 'Library', position: { top: '20%', left: '35%' }, icon: 'fas fa-book' },
    { name: 'Cafeteria', position: { top: '60%', right: '35%' }, icon: 'fas fa-utensils' },
    { name: 'Admin Block', position: { top: '70%', left: '25%' }, icon: 'fas fa-building' }
  ];

  const getHighlightedBuilding = () => {
    if (!highlightRoom) return null;
    const buildingCode = highlightRoom.match(/^([A-Z]+)/)?.[1];
    if (['AA', 'AB', 'AC'].includes(buildingCode)) return 'old-academic';
    if (['BA', 'BB', 'BC', 'BD'].includes(buildingCode)) return 'new-academic';
    if (buildingCode === 'CAB') return 'central-academic';
    return null;
  };

  const highlightedBuilding = getHighlightedBuilding();

  return (
    <div className="campus-map">
      <div className="map-container">
        <h3 className="map-title">
          <i className="fas fa-map"></i> Campus Map
        </h3>
        
        <div className="map-area">
          {/* Buildings */}
          {buildings.map(building => (
            <div
              key={building.id}
              className={`building ${highlightedBuilding === building.id ? 'highlighted' : ''}`}
              style={{
                ...building.position,
                borderColor: building.color,
                backgroundColor: highlightedBuilding === building.id ? building.color + '20' : 'white'
              }}
              onClick={() => onBuildingClick && onBuildingClick(building)}
            >
              <div className="building-name">{building.name}</div>
              <div className="building-floors">
                {building.floors.map(floor => (
                  <div key={floor} className="floor-label">{floor}</div>
                ))}
              </div>
            </div>
          ))}
          
          {/* Landmarks */}
          {landmarks.map(landmark => (
            <div
              key={landmark.name}
              className="landmark"
              style={landmark.position}
            >
              <i className={landmark.icon}></i>
              <span>{landmark.name}</span>
            </div>
          ))}
          
          {/* Highlighted room indicator */}
          {highlightRoom && (
            <div className="room-indicator">
              <i className="fas fa-map-pin"></i>
              <span>Room: {highlightRoom}</span>
            </div>
          )}
        </div>
        
        <div className="map-legend">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#667eea' }}></div>
            <span>Old Academic Block</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#764ba2' }}></div>
            <span>New Academic Block</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#48bb78' }}></div>
            <span>Central Academic Block</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampusMap;