# Demo Guide - IIIT Kottayam Faculty Room Finder (Iteration 1)

## New Features Demonstration

### 1. Corrected Building Structure
The application now correctly reflects IIIT Kottayam's actual building layout:

**Old Academic Block:**
- AA (Ground Floor) - Faculty offices and classrooms
- AB (First Floor) - Faculty offices and labs  
- AC (Second Floor) - Faculty offices and research areas

**New Academic Block:**
- BA (Ground Floor) - Faculty offices and common areas
- BB (First Floor) - Faculty offices and meeting rooms
- BC (Second Floor) - Faculty offices and labs
- BD (Third Floor) - Faculty offices and research facilities

### 2. Enhanced Location & Navigation Features

#### Distance & ETA Calculation
- **Real Distance**: Calculated in meters using coordinate system
- **Walking Speed**: Based on 1.4 m/s average walking speed
- **Dynamic Updates**: Changes based on selected starting location

#### Multiple Starting Locations
Try these starting points:
- Main Gate (Default)
- Old Academic Block Entrance
- New Academic Block Entrance
- Central Academic Block
- Library
- Cafeteria
- Administrative Block

### 3. Interactive Campus Map
- **Visual Building Layout**: See all buildings positioned on campus
- **Building Highlighting**: Destination building lights up when selected
- **Real-time Updates**: Map updates when you select different faculty
- **Responsive Design**: Works on all device sizes

### 4. Smart Route Calculation

#### Test Scenarios:

**Scenario 1: From Main Gate to AC 308**
1. Keep "Main Gate" as starting location
2. Search for "Dr. Ebin Deni Raj" (AC 308)
3. Click on his card
4. See: Distance ~40m, ETA ~1 min, Old Academic Block highlighted

**Scenario 2: From Library to BD 417**
1. Change starting location to "Library"
2. Search for "Dr Divya Sindhu Lekha" (BD 417)
3. Click on her card
4. See: Different distance/ETA, New Academic Block highlighted

**Scenario 3: Room Number Search**
1. Search directly for "AB 212"
2. Find Dr. Bakkyaraj T
3. Get directions with distance and ETA

### 5. API Testing Examples

Test the new endpoints:

```bash
# Get route with custom start location
curl -X POST http://localhost:5000/api/route \
  -H "Content-Type: application/json" \
  -d '{
    "startLocation": {"x": 25, "y": 30},
    "endRoom": "AC 308"
  }'

# Get available starting locations
curl http://localhost:5000/api/locations

# Get room with distance/ETA
curl http://localhost:5000/api/room/BD%20417
```

### 6. User Story Validation

#### ✅ User Story 1: "Tell the location of rooms inside the college"
**Implementation:**
- Room parsing identifies building (Old/New Academic Block)
- Floor information clearly displayed
- Interactive campus map shows exact building locations
- Building highlighting for visual confirmation

**Test:**
1. Search for any faculty with room number
2. See building name, floor, and visual map location
3. Verify correct building identification (AA/AB/AC vs BA/BB/BC/BD)

#### ✅ User Story 2: "Route, distance and ETA given initial location"
**Implementation:**
- Distance calculation using coordinate system
- ETA based on 1.4 m/s walking speed
- Multiple starting location options
- Dynamic route recalculation

**Test:**
1. Select different starting locations
2. Choose same destination faculty
3. Observe different distances and ETAs
4. Verify step-by-step directions update accordingly

### 7. Building-Specific Testing

**Old Academic Block Testing:**
- Search "AA", "AB", or "AC" rooms
- Verify "Old Academic Block" appears in results
- Check floor identification (Ground, First, Second)

**New Academic Block Testing:**
- Search "BA", "BB", "BC", or "BD" rooms  
- Verify "New Academic Block" appears in results
- Check floor identification (Ground, First, Second, Third)

### 8. Mobile Responsiveness
Test on different screen sizes:
- Campus map adapts to mobile screens
- Distance/ETA display stacks vertically on mobile
- Touch-friendly faculty cards and buttons

### 9. Performance Features
- **Real-time Search**: Instant filtering as you type
- **Efficient Routing**: Quick distance calculations
- **Smooth Animations**: Building highlighting and transitions
- **Error Handling**: Graceful handling of missing room data

### 10. Sample Faculty for Testing

| Faculty | Room | Building | Distance from Main Gate | ETA |
|---------|------|----------|-------------------------|-----|
| Dr. Ebin Deni Raj | AC 308 | Old Academic (2nd Floor) | ~40m | 1 min |
| Dr. Bakkyaraj T | AB 212 | Old Academic (1st Floor) | ~30m | 1 min |
| Dr. Kala S | AC 314 | Old Academic (2nd Floor) | ~42m | 1 min |
| Dr. Panchami V | AB 213 | Old Academic (1st Floor) | ~31m | 1 min |
| Dr Divya Sindhu Lekha | BD 417 | New Academic (3rd Floor) | ~120m | 2 min |

This iteration successfully implements both user story requirements with accurate building mapping, distance calculation, and comprehensive navigation features.