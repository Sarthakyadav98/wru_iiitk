# Product Requirements Document (PRD)
**Project Name**: IIIT Kottayam Campus Navigation App
**Target Platform**: Web & PWA (Mobile-first browser application)
**Tech Stack**: React, TypeScript, Mapbox GL JS, Firebase (Firestore & Storage), Vite, TailwindCSS

---

## 1. Executive Summary
The goal of this project is to build a highly interactive, responsive, and precise campus navigation app for **IIIT Kottayam (Pala Campus)**. It will function seamlessly in any modern web browser and can be installed as a Progressive Web App (PWA) on iOS and Android devices. 

The application will provide Google Maps-style turn-by-turn directions, live path tracking, AR-like camera overlays for direction assistance, indoor floor navigation, and a comprehensive Point of Interest (POI) directory (e.g., academic blocks, messes, hostels, and teacher cabins).

## 2. Core Objectives
- **Accurate Campus Routing**: Overcome the lack of official Google Maps coverage within the campus by manually recording node-and-edge path graphs.
- **Accessibility**: Provide a URL-based system completely bypassing app store installations. Must work beautifully on mobile browsers with PWA capabilities.
- **Immersive Navigation**: Implement live GPS tracking alongside a device camera overlay to point users in the correct direction.
- **Maintainability**: Ensure the path graph and POIs can be easily updated or extended in the future using Firebase.

## 3. Scope and Features

### 3.1 Map View & Interaction
- Custom campus map powered by **Mapbox GL JS** for 3D/polished outdoor rendering.
- Custom stylized markers for different categories (Food, Academic, Hostels, Gates).
- Campus Center locked at Coordinates: **9.754833°N, 76.650099°E**.
- Draggable, zoomable map with user location ("Blue Dot") tracking.

### 3.2 Path Recording System ("Admin/Builder Mode")
- Secure mechanism to record the raw walking paths around the campus.
- **Start Recording** functionality utilizing `navigator.geolocation.watchPosition` (high accuracy).
- Save recorded paths and their intersections to Firebase Firestore as polylines.

### 3.3 Pathfinding & Directions (Outdoor)
- Custom pathfinding algorithm (Dijkstra or A*) operating on the recorded path graph.
- Highlight the shortest/optimal route from the user's current location to the target POI.
- Display a polyline on the map.
- Voice-assisted directions using the Web Speech API ("Turn left toward Mess").
- "Deviation detected" logic to recalculate or alert if the user strays too far from the polyline.

### 3.4 Camera Mode ("Follow the Path" AR)
- Hardware integration using `navigator.mediaDevices.getUserMedia` and `DeviceOrientationEvent`.
- Takes the device's compass bearing and compares it to the bearing of the next waypoint on the route.
- Renders directional arrows (Left, Right, Straight) over the live camera feed canvas to guide the user intuitively.

### 3.5 Indoor Navigation
- Provide 2D floor plans (images) mapped over SVG interfaces when a user reaches specific buildings.
- Render SVG routing lines across the floor plan.
- QR Code integration: Entrances to buildings will feature QR codes that users can scan to instantly open the corresponding 3D/2D indoor map.

### 3.6 POI Directory & Modal Views
- Search functionality (powered by Fuse.js) to discover specific locations (e.g., "Dr. XYZ Cabin").
- Detailed modal/bottom-sheet for each mapped place featuring:
  - Photographs of the location/door.
  - Detailed text directions (e.g., "Academic Block 1, 2nd floor, turn right from the stairs").
  - Contact details or office hours (if applicable).

### 3.7 Progressive Web App (PWA) Capabilities
- Installable natively via "Add to Home Screen".
- Offline availability for the baseline application shell and static Mapbox tiles.
- Force HTTPS (via Vercel deployment) to guarantee Geolocation and Camera API access.

---

## 4. System Architecture
- **Frontend**: Vite + React + TypeScript
- **Routing**: React Router v6
- **Global State**: Zustand
- **Data Fetching/Caching**: TanStack React Query
- **Styling**: Tailwind CSS + Custom PostCSS
- **Mapping Engine**: Mapbox GL JS (`mapbox-gl`) or `react-map-gl`
- **Backend/DB**: Firebase Firestore (NoSQL for POIs/Graph Edge data) + Firebase Storage (Images)
- **Deployment**: Vercel (Auto-HTTPS, Edge caching)

---

## 5. Phased Implementation Plan / Tasks Breakdown

### Phase 1: Project Initialization & Groundwork
- [ ] Initialize Vite React-TS project (`iiitk-nav`).
- [ ] Setup Tailwind CSS and essential UI dependencies.
- [ ] Configure ESLint, Prettier, and absolute imports.
- [ ] Integrate React Router and create dummy screens (Map, Search, Admin).
- [ ] Initialize Firebase project, create Firestore db structure, and setup Firebase JS SDK.
- [ ] Deploy initial shell to Vercel to establish the HTTPS URL.

### Phase 2: Mapbox Integration & State Management
- [ ] Obtain Mapbox API key and configure `<Map>` base component.
- [ ] Set exact bounds, zoom level, and center coordinates for IIIT Kottayam.
- [ ] Implement Zustand stores for User Location, Map State, and active POI.
- [ ] Build the "Current Location" marker utilizing Browser Geolocation API.

### Phase 3: POIs and Data Schema Implementation
- [ ] Define TypeScript Interfaces/Types for `POI`, `RouteSegment`, and `Node`.
- [ ] Create UI for Map Markers (Food, Academic, Hostel).
- [ ] Build POI Detail Bottom-Sheet/Modal (Image, Title, Description).
- [ ] Implement Search Bar using `fuse.js` to filter POIs from Firebase.

### Phase 4: Path Recording System ("Builder" Mode)
- [ ] Create protected "Record Route" screen.
- [ ] Implement `watchPosition` logic collecting `{lat, lng}` coordinates at a specific distance interval.
- [ ] UI to Start, Stop, and Save the recorded polyline to Firebase Firestore.
- [ ] Record ground truth data across the actual campus (Field Work).

### Phase 5: Routing & Directions Engine
- [ ] Fetch the complete graph (nodes & polylines) on app load using TanStack Query.
- [ ] Implement Dijkstra/A* algorithm in a TypeScript utility service.
- [ ] Create UI to select "Destination" and compute the path.
- [ ] Render the calculated route as a Mapbox GeoJSON LineString (highlighted path).
- [ ] Snap user's real-time position to the closest point on the active path segment.
- [ ] Implement Text-to-Speech (Web Speech API) for step-by-step turn instructions.

### Phase 6: Camera Tracking mode (AR)
- [ ] Create the "Camera View" route.
- [ ] Request permissions and render `<video>` background via `getUserMedia`.
- [ ] Sync `DeviceOrientationEvent` (Alpha/Heading) to calculate directional diff against the target coordinate.
- [ ] Overlay Canvas arrows guiding the user Left/Right/Straight based on heading data.

### Phase 7: Indoor Mapping
- [ ] Design SVG wrappers that render over static floor plan images.
- [ ] Link outdoor entry nodes to indoor floor nodes.
- [ ] Implement QR Code scanning logic (using a lightweight library like `html5-qrcode`) to instantly deep-link to an indoor coordinate.

### Phase 8: PWA, Polish, and Launch
- [ ] Setup `vite-plugin-pwa` for manifest and service workers.
- [ ] Add app icons (iOS splash screens, Android adaptive icons).
- [ ] Test Geolocation precision heavily on mobile data directly on campus.
- [ ] Finalize UI/UX polish (loading states, error handling when GPS is denied).

---

## 6. Known Risks & Challenges
- **GPS Drift**: Browser GPS relies on OS level APIs and can occasionally drift. A snapping algorithm is required to lock the user to known paths visually.
- **Compass Calibration**: Mobile browser compass (`DeviceOrientationEvent`) can sometimes be inaccurate; prompt users occasionally to calibrate their phone by moving it in an "8" shape.
- **Device Support/Permissions**: Users absolutely must grant Location & Camera permissions. We need elegant fallback UI if access is denied.

---

## 7. Next Steps for Development
1. Run `npx create-vite@latest iiitk-nav --template react-ts` inside `/wru_iiitk`.
2. Move into Phase 1 to establish the scaffolding.
3. Configure Mapbox.
