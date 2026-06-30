# PROJECT CABEUS - Architectural Plan

This document outlines the foundation for building the **AI-Powered Lunar Resource Intelligence Platform**. The architecture is designed to be cinematic, performant, and production-ready, blending modern web technologies with scientific visualization.

## 1. Folder Structure
A monorepo-style structure separating the frontend and backend, ensuring clean modularity.

```text
project_cabeus/
├── frontend/
│   ├── public/
│   │   └── assets/              # Moon textures, normal maps, icons
│   ├── src/
│   │   ├── api/                 # Axios clients and React Query hooks
│   │   ├── assets/              # Global CSS, Tailwind base
│   │   ├── components/
│   │   │   ├── common/          # Reusable UI (Buttons, Cards, Modals)
│   │   │   ├── layout/          # Sidebar, Topbar, Dashboard Shell
│   │   │   ├── 3d/              # React Three Fiber components (Moon, Particles)
│   │   │   └── map/             # Leaflet/MapLibre map components
│   │   ├── features/            # Feature-specific components (SAR Upload, Simulation)
│   │   ├── hooks/               # Custom React hooks
│   │   ├── pages/               # Route components (Landing, Dashboard, etc.)
│   │   ├── store/               # Zustand state slices
│   │   ├── types/               # TypeScript interfaces
│   │   └── utils/               # Helpers, formatting, math
│   ├── index.html
│   ├── vite.config.ts
│   └── tailwind.config.js
└── backend/
    ├── app/
    │   ├── api/                 # API routers (endpoints)
    │   ├── core/                # Config, security, logging
    │   ├── models/              # Pydantic schemas, DB models
    │   ├── services/            # Business logic (PyTorch integration, image processing)
    │   ├── ai/                  # PyTorch models and weights
    │   └── utils/               # Helper functions
    ├── requirements.txt
    └── main.py
```

## 2. Complete Application Architecture
- **Frontend Layer:** React (Vite) + TypeScript for type safety. TailwindCSS for styling. React Three Fiber for 3D elements. Framer Motion for cinematic transitions.
- **Backend Layer:** FastAPI for high-performance async REST/WebSocket endpoints.
- **AI Processing Layer:** PyTorch models loaded in memory via FastAPI for fast inference on Chandrayaan-2 SAR data. OpenCV for image preprocessing.
- **Visualization Layer:** MapLibre/Leaflet for the lunar surface map with GeoJSON overlays for heatmaps and landing sites.

## 3. Component Hierarchy
```text
App
 ├── AnimatePresence (Framer Motion Route Transitions)
 ├── Routes
 │   ├── LandingPage
 │   │   ├── Scene3D (Canvas)
 │   │   │   ├── Moon
 │   │   │   ├── StarField
 │   │   │   └── LightingSetup
 │   │   ├── HeroOverlay
 │   │   └── ActionButtons
 │   └── DashboardLayout
 │       ├── SidebarNavigation
 │       ├── Topbar (Mission Status)
 │       └── Outlet (Page Content)
 │           ├── DashboardOverview
 │           ├── SARUploadView
 │           │   ├── DragDropZone
 │           │   └── ProcessingTimeline
 │           ├── AnalysisResultsView
 │           │   ├── ImageStages (Original -> Enhanced -> Heatmap)
 │           │   └── SiteIntelligencePanel
 │           ├── MissionSimulationView
 │           │   ├── VirtualRoverMap
 │           │   └── TelemetryPanel
 │           └── ReportGeneratorView
```

## 4. Routing Structure
- `/` - **Cinematic Landing Page:** 3D Moon and entry points.
- `/dashboard` - **Mission Control Overview:** High-level metrics and active missions.
- `/dashboard/sar-analysis` - **SAR Upload:** Drag-and-drop interface with processing timelines.
- `/dashboard/results` - **Results & Intelligence:** Heatmaps, segmentation, and landing site AI explainability.
- `/dashboard/simulation` - **Mission Simulation:** Rover deployment and trajectory analysis.
- `/dashboard/reports` - **Report Generator:** PDF export and mission summaries.

## 5. State Management Strategy
- **Global UI State:** `Zustand` (for managing sidebar toggles, active landing site selection, and 3D camera positions). It is lightweight and integrates perfectly with React Three Fiber.
- **Server State & Caching:** `React Query` (for fetching landing sites, rover telemetry, and AI explanations). Handles caching, loading states, and background refetching effortlessly.
- **Local State:** Standard `useState` / `useReducer` for component-specific logic (e.g., form inputs, drag-and-drop state).

## 6. UI Design System
- **Theme:** Dark, sci-fi premium.
- **Colors:**
  - Background: `#02040A` (Deep Space)
  - Primary: `#67D8FF` (Lunar Ice Blue)
  - Secondary: `#4D8CFF` (Mission Control Blue)
  - Highlight: `#6E5DFF` (Cinematic Purple)
  - Text: `#F4F7FA` (Off-white for readability)
- **Typography:** `Inter` or `Geist` (clean, highly legible, tech-focused).
- **Styling Paradigm:** Glassmorphism (`backdrop-blur`), subtle inner shadows, 1px semi-transparent borders (`border-white/10`), and glowing accents on hover. TailwindCSS configuration will enforce these tokens.

## 7. Animation System
- **Page Transitions:** `Framer Motion` for cross-fading, scaling, and sliding pages as users navigate the dashboard.
- **Micro-interactions:** Buttons will have subtle scale (`whileHover={{ scale: 1.02 }}`) and glow effects. Number counters will animate from 0 to target values.
- **Processing Timelines:** Staggered list animations (`variants`, `staggerChildren`) to reveal SAR processing steps sequentially.
- **3D Animations:** `useFrame` inside React Three Fiber for continuous Moon rotation, particle drifting, and scroll-linked camera interpolation.

## 8. API Design (FastAPI)
- `POST /api/v1/sar/upload`: Accepts SAR imagery, initiates processing, returns a task ID.
- `GET /api/v1/sar/status/{task_id}`: WebSocket or SSE endpoint for real-time progress (Noise Reduction -> Radar Processing -> Ice Detection).
- `GET /api/v1/analysis/{task_id}`: Returns enhanced images, segmentation maps, and GeoJSON heatmaps.
- `GET /api/v1/landing-sites/{task_id}`: Returns ranked landing locations with metrics (Score, Ice Probability, Terrain Stability).
- `GET /api/v1/explainability/{site_id}`: Returns AI reasoning for a specific hotspot.
- `POST /api/v1/simulate/rover`: Initializes a rover path and returns simulated telemetry data.

## 9. Data Flow
1. **Upload:** User drops SAR image -> Frontend sends `multipart/form-data` to FastAPI.
2. **Process:** FastAPI saves image -> dispatches to PyTorch inference module -> emits progress via WebSockets to Frontend Timeline.
3. **Analyze:** PyTorch returns arrays -> FastAPI converts to base64 images and GeoJSON -> returns to Frontend.
4. **Visualize:** Frontend React Query receives data -> updates Zustand store -> MapLibre renders heatmaps/markers -> Results page unlocks.
5. **Interact:** User clicks hotspot -> Frontend fetches explainability data -> Sidebar panel opens with AI reasoning.

## 10. Three.js Implementation Strategy
- Use `@react-three/fiber` and `@react-three/drei`.
- **Lighting:** Soft `ambientLight` + strong `directionalLight` (sun) + `SpotLight` for rim lighting. Include a `PostProcessing` bloom pass (using `@react-three/postprocessing`) to make the highlights glow.
- **Materials:** `MeshStandardMaterial` for the Moon with high-res `map` (color), `normalMap` (craters), and `roughnessMap` (surface details).
- **Camera:** Use `PerspectiveCamera` with slow, smooth damping (`drei/CameraControls` or lerping in `useFrame`) when transitioning from Landing to Explore states.
- **Background:** `Stars` component from `drei` layered with a subtle animated shader or particle system for the nebula effect.

## 11. Backend Integration Strategy
- Use **FastAPI** for its native async capabilities and easy WebSocket support.
- Implement an event-driven task queue (or simple async background tasks for the scope of the hackathon) to process heavy PyTorch inference without blocking the main event loop.
- Use `Pydantic` for strict data validation (e.g., ensuring landing site coordinates and confidence scores adhere to the schema).

## 12. Six-Hour Implementation Roadmap
* **Hour 1: Foundation & Setup**
  - Scaffold React/Vite and FastAPI.
  - Setup Tailwind, routing, and folder structure.
  - Configure core color palette and typography.
* **Hour 2: The Cinematic Landing Page**
  - Build the React Three Fiber Moon scene.
  - Add lighting, textures, post-processing (Bloom).
  - Implement Framer Motion hero typography and buttons.
* **Hour 3: Dashboard Shell & UI Components**
  - Build the Glassmorphism Sidebar and Topbar.
  - Create reusable premium UI components (Cards, Buttons, Modals).
  - Setup Page transitions.
* **Hour 4: SAR Upload & Real-time Processing**
  - Build the drag-and-drop uploader.
  - Implement the animated processing timeline.
  - Mock the FastAPI WebSocket connection for staging updates.
* **Hour 5: Intelligence & Visualization (Map & Results)**
  - Integrate MapLibre/Leaflet for the lunar surface.
  - Render landing site markers and heatmap overlays.
  - Build the AI Explainability side-panel.
* **Hour 6: Simulation, Reports & Polish**
  - Build the Rover Simulation telemetry dashboard.
  - Implement the PDF Report Generation.
  - Final polish: micro-animations, performance tweaks, and alignment checks.
