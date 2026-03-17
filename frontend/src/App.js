import React, { useState, useEffect } from 'react';
import CampusMap from './components/CampusMap';
import './App.css';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [faculty, setFaculty] = useState([]);
  const [filteredFaculty, setFilteredFaculty] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [pathwayData, setPathwayData] = useState(null);
  const [showPathway, setShowPathway] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [selectedStartLocation, setSelectedStartLocation] = useState(null);

  useEffect(() => {
    fetchFaculty();
    fetchCurrentLocation();
    fetchAvailableLocations();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredFaculty(faculty);
    } else {
      const filtered = faculty.filter(f => 
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (f.contact.room && f.contact.room.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (f.areas && f.areas.some(area => area.toLowerCase().includes(searchTerm.toLowerCase())))
      );
      setFilteredFaculty(filtered);
    }
  }, [searchTerm, faculty]);

  const fetchFaculty = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/faculty`);
      const data = await response.json();
      setFaculty(data);
      setFilteredFaculty(data);
    } catch (error) {
      console.error('Error fetching faculty:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentLocation = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/location/current`);
      const data = await response.json();
      setCurrentLocation(data);
    } catch (error) {
      console.error('Error fetching current location:', error);
    }
  };

  const fetchAvailableLocations = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/locations`);
      const data = await response.json();
      setAvailableLocations(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const handleFacultyClick = async (facultyMember) => {
    if (!facultyMember.contact.room) {
      alert('Room information not available for this faculty member.');
      return;
    }

    setSelectedFaculty(facultyMember);
    
    try {
      if (selectedStartLocation) {
        // Use route calculation with custom start location
        const response = await fetch(`${API_BASE_URL}/route`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            startLocation: selectedStartLocation.coordinates,
            endRoom: facultyMember.contact.room
          })
        });
        const data = await response.json();
        setPathwayData(data.route);
      } else {
        // Use default room lookup
        const response = await fetch(`${API_BASE_URL}/room/${facultyMember.contact.room}`);
        const data = await response.json();
        setPathwayData(data);
      }
      setShowPathway(true);
    } catch (error) {
      console.error('Error fetching pathway:', error);
      alert('Error fetching pathway information.');
    }
  };

  const closePathway = () => {
    setShowPathway(false);
    setPathwayData(null);
    setSelectedFaculty(null);
  };

  const FacultyCard = ({ facultyMember }) => (
    <div className="faculty-card" onClick={() => handleFacultyClick(facultyMember)}>
      <div className="faculty-header">
        <img 
          src={facultyMember.imageUrl} 
          alt={facultyMember.name}
          className="faculty-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/60x60/667eea/white?text=' + 
                           facultyMember.name.split(' ').map(n => n[0]).join('');
          }}
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

  const PathwayModal = () => {
    if (!showPathway || !pathwayData) return null;

    return (
      <div className="pathway-modal" onClick={closePathway}>
        <div className="pathway-content" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={closePathway}>
            <i className="fas fa-times"></i>
          </button>
          
          <div className="pathway-header">
            <h2>Route to {selectedFaculty?.name}</h2>
            <p>Room: {pathwayData.room}</p>
          </div>
          
          <div className="route-info">
            <div className="building-info">
              <h3><i className="fas fa-building"></i> {pathwayData.building}</h3>
              <p><strong>Floor:</strong> {pathwayData.floor}</p>
            </div>
            
            <div className="distance-eta">
              <div className="distance-info">
                <i className="fas fa-ruler"></i>
                <span>Distance: {pathwayData.distance}m</span>
              </div>
              <div className="eta-info">
                <i className="fas fa-clock"></i>
                <span>ETA: {pathwayData.eta} min</span>
              </div>
            </div>
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

  return (
    <div className="app">
      <div className="container">
        <div className="header">
          <h1><i className="fas fa-university"></i> IIIT Kottayam</h1>
          <p>Faculty Room Finder & Navigation System</p>
        </div>
        
        <div className="search-section">
          <div className="location-selector">
            <label htmlFor="start-location">Starting Location:</label>
            <select 
              id="start-location"
              value={selectedStartLocation?.id || ''}
              onChange={(e) => {
                const location = availableLocations.find(loc => loc.id === e.target.value);
                setSelectedStartLocation(location);
              }}
              className="location-select"
            >
              <option value="">Main Gate (Default)</option>
              {availableLocations.map(location => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="search-box">
            <input
              type="text"
              className="search-input"
              placeholder="Search by faculty name, designation, room number, or research area..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="fas fa-search search-icon"></i>
          </div>
          
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            Click on any faculty card to get directions with distance and ETA
          </p>
        </div>
        
        <CampusMap 
          highlightRoom={selectedFaculty?.contact.room} 
          onBuildingClick={(building) => {
            console.log('Building clicked:', building);
          }}
        />
        
        {loading ? (
          <div className="loading">
            <i className="fas fa-spinner"></i>
            <p>Loading faculty data...</p>
          </div>
        ) : filteredFaculty.length === 0 ? (
          <div className="no-results">
            <i className="fas fa-search"></i>
            <h3>No faculty found</h3>
            <p>Try adjusting your search terms</p>
          </div>
        ) : (
          <div className="faculty-grid">
            {filteredFaculty.map((facultyMember) => (
              <FacultyCard key={facultyMember.id} facultyMember={facultyMember} />
            ))}
          </div>
        )}
        
        <PathwayModal />
      </div>
    </div>
  );
}

export default App;