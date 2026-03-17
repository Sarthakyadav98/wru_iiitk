const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Import faculty data
const { faculties } = require('./data/faculty');

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'IIIT Kottayam Faculty Room Finder API' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get all faculty
app.get('/api/faculty', (req, res) => {
  res.json(faculties);
});

// Search faculty by name
app.get('/api/faculty/search', (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Search query is required' });
  }
  
  const results = faculties.filter(faculty => 
    faculty.name.toLowerCase().includes(q.toLowerCase()) ||
    faculty.designation.toLowerCase().includes(q.toLowerCase()) ||
    (faculty.contact.room && faculty.contact.room.toLowerCase().includes(q.toLowerCase()))
  );
  
  res.json(results);
});

// Get faculty by ID
app.get('/api/faculty/:id', (req, res) => {
  const faculty = faculties.find(f => f.id === req.params.id);
  if (!faculty) {
    return res.status(404).json({ error: 'Faculty not found' });
  }
  res.json(faculty);
});

// Get room location and pathway
app.get('/api/room/:roomNumber', (req, res) => {
  const { roomNumber } = req.params;
  const faculty = faculties.find(f => f.contact.room === roomNumber);
  
  if (!faculty) {
    return res.status(404).json({ error: 'Room not found' });
  }
  
  // Parse room number to determine building and floor
  const roomInfo = parseRoomNumber(roomNumber);
  const pathway = generatePathway(roomInfo);
  
  // Calculate distance and ETA from main gate
  const mainGate = { x: 0, y: 0 };
  const distance = calculateDistance(mainGate, roomInfo.coordinates);
  const eta = calculateETA(distance);
  
  res.json({
    faculty: faculty,
    room: roomNumber,
    building: roomInfo.building,
    floor: roomInfo.floor,
    coordinates: roomInfo.coordinates,
    distance: Math.round(distance),
    eta: eta,
    pathway: pathway
  });
});

// Helper function to parse room number
function parseRoomNumber(roomNumber) {
  if (!roomNumber) return { building: 'Unknown', floor: 'Unknown', room: roomNumber };
  
  const buildingMap = {
    'AA': 'Old Academic Block (Ground Floor)',
    'AB': 'Old Academic Block (First Floor)', 
    'AC': 'Old Academic Block (Second Floor)',
    'BA': 'New Academic Block (Ground Floor)',
    'BB': 'New Academic Block (First Floor)',
    'BC': 'New Academic Block (Second Floor)',
    'BD': 'New Academic Block (Third Floor)',
    'CAB': 'Central Academic Block'
  };
  
  const floorMap = {
    'AA': 'Ground Floor',
    'AB': 'First Floor',
    'AC': 'Second Floor', 
    'BA': 'Ground Floor',
    'BB': 'First Floor',
    'BC': 'Second Floor',
    'BD': 'Third Floor'
  };
  
  // Extract building code and room number
  const match = roomNumber.match(/^([A-Z]+)\s*(\d+)/);
  if (match) {
    const buildingCode = match[1];
    const roomNum = match[2];
    
    return {
      building: buildingMap[buildingCode] || `Building ${buildingCode}`,
      buildingCode: buildingCode,
      floor: floorMap[buildingCode] || 'Unknown Floor',
      floorNumber: getFloorNumber(buildingCode),
      room: roomNumber,
      coordinates: getBuildingCoordinates(buildingCode)
    };
  }
  
  return { building: 'Unknown Building', floor: 'Unknown Floor', room: roomNumber };
}

// Helper function to get floor number for calculations
function getFloorNumber(buildingCode) {
  const floorNumbers = {
    'AA': 0, 'BA': 0,  // Ground floors
    'AB': 1, 'BB': 1,  // First floors
    'AC': 2, 'BC': 2,  // Second floors
    'BD': 3           // Third floor
  };
  return floorNumbers[buildingCode] || 0;
}

// Helper function to get building coordinates (mock coordinates for demo)
function getBuildingCoordinates(buildingCode) {
  const coordinates = {
    'AA': { lat: 9.5915, lng: 76.5221, x: 0, y: 0 },      // Old Academic Block
    'AB': { lat: 9.5915, lng: 76.5221, x: 0, y: 20 },     // Old Academic Block - 1st floor
    'AC': { lat: 9.5915, lng: 76.5221, x: 0, y: 40 },     // Old Academic Block - 2nd floor
    'BA': { lat: 9.5920, lng: 76.5225, x: 100, y: 0 },    // New Academic Block
    'BB': { lat: 9.5920, lng: 76.5225, x: 100, y: 20 },   // New Academic Block - 1st floor
    'BC': { lat: 9.5920, lng: 76.5225, x: 100, y: 40 },   // New Academic Block - 2nd floor
    'BD': { lat: 9.5920, lng: 76.5225, x: 100, y: 60 },   // New Academic Block - 3rd floor
    'CAB': { lat: 9.5918, lng: 76.5223, x: 50, y: 0 }     // Central Academic Block
  };
  return coordinates[buildingCode] || { lat: 9.5915, lng: 76.5221, x: 0, y: 0 };
}

// Helper function to get ordinal suffix
function getOrdinalSuffix(num) {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
}

// Helper function to generate pathway instructions
function generatePathway(roomInfo, startLocation = null) {
  const { building, buildingCode, floorNumber, room } = roomInfo;
  
  const pathways = {
    'AA': [
      'Enter the main campus through the main gate',
      'Walk straight towards the Old Academic Block',
      'Enter the Old Academic Block from the main entrance',
      'You are on the Ground Floor - navigate to room ' + room,
      'Follow the room number signs along the corridor'
    ],
    'AB': [
      'Enter the main campus through the main gate',
      'Walk straight towards the Old Academic Block',
      'Enter the Old Academic Block from the main entrance',
      'Take the stairs to the First Floor',
      'Navigate to room ' + room + ' following the room number signs'
    ],
    'AC': [
      'Enter the main campus through the main gate',
      'Walk straight towards the Old Academic Block',
      'Enter the Old Academic Block from the main entrance',
      'Take the stairs to the Second Floor',
      'Navigate to room ' + room + ' following the room number signs'
    ],
    'BA': [
      'Enter the main campus through the main gate',
      'Walk towards the New Academic Block (right side of campus)',
      'Enter the New Academic Block from the main entrance',
      'You are on the Ground Floor - navigate to room ' + room,
      'Follow the room number signs along the corridor'
    ],
    'BB': [
      'Enter the main campus through the main gate',
      'Walk towards the New Academic Block (right side of campus)',
      'Enter the New Academic Block from the main entrance',
      'Take the stairs to the First Floor',
      'Navigate to room ' + room + ' following the room number signs'
    ],
    'BC': [
      'Enter the main campus through the main gate',
      'Walk towards the New Academic Block (right side of campus)',
      'Enter the New Academic Block from the main entrance',
      'Take the stairs to the Second Floor',
      'Navigate to room ' + room + ' following the room number signs'
    ],
    'BD': [
      'Enter the main campus through the main gate',
      'Walk towards the New Academic Block (right side of campus)',
      'Enter the New Academic Block from the main entrance',
      'Take the stairs to the Third Floor',
      'Navigate to room ' + room + ' following the room number signs'
    ],
    'CAB': [
      'Enter the main campus through the main gate',
      'Walk towards the Central Academic Block (center of campus)',
      'Enter CAB from the main entrance',
      'Navigate to room ' + room + ' following the room number signs'
    ]
  };
  
  return pathways[buildingCode] || [
    'Enter the main campus through the main gate',
    `Ask for directions to ${building}`,
    `Navigate to room ${room}`
  ];
}

// Calculate distance between two points (in meters)
function calculateDistance(point1, point2) {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// Calculate ETA based on distance (assuming walking speed of 1.4 m/s)
function calculateETA(distance) {
  const walkingSpeed = 1.4; // meters per second
  const timeInSeconds = distance / walkingSpeed;
  const minutes = Math.ceil(timeInSeconds / 60);
  return minutes;
}

// New route calculation endpoint
app.post('/api/route', (req, res) => {
  const { startLocation, endRoom } = req.body;
  
  if (!endRoom) {
    return res.status(400).json({ error: 'End room is required' });
  }
  
  const faculty = faculties.find(f => f.contact.room === endRoom);
  if (!faculty) {
    return res.status(404).json({ error: 'Room not found' });
  }
  
  const roomInfo = parseRoomNumber(endRoom);
  const pathway = generatePathway(roomInfo, startLocation);
  
  // Calculate distance and ETA
  const startCoords = startLocation || { x: 0, y: 0 }; // Default to main gate
  const endCoords = roomInfo.coordinates;
  const distance = calculateDistance(startCoords, endCoords);
  const eta = calculateETA(distance);
  
  res.json({
    faculty: faculty,
    route: {
      start: startLocation || 'Main Gate',
      end: endRoom,
      building: roomInfo.building,
      floor: roomInfo.floor,
      distance: Math.round(distance),
      eta: eta,
      pathway: pathway
    }
  });
});

// Get current location (mock endpoint for demo)
app.get('/api/location/current', (req, res) => {
  // In a real app, this would use GPS or indoor positioning
  res.json({
    location: 'Main Gate',
    coordinates: { x: 0, y: 0, lat: 9.5915, lng: 76.5221 },
    accuracy: 5
  });
});

// Get all available locations/landmarks
app.get('/api/locations', (req, res) => {
  const locations = [
    { id: 'main-gate', name: 'Main Gate', coordinates: { x: 0, y: 0 } },
    { id: 'old-academic', name: 'Old Academic Block Entrance', coordinates: { x: 0, y: 10 } },
    { id: 'new-academic', name: 'New Academic Block Entrance', coordinates: { x: 100, y: 10 } },
    { id: 'central-academic', name: 'Central Academic Block', coordinates: { x: 50, y: 5 } },
    { id: 'library', name: 'Library', coordinates: { x: 25, y: 30 } },
    { id: 'cafeteria', name: 'Cafeteria', coordinates: { x: 75, y: 25 } },
    { id: 'admin-block', name: 'Administrative Block', coordinates: { x: 30, y: 50 } }
  ];
  
  res.json(locations);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});