# React

A modern React-based project utilizing the latest frontend technologies and tools for building responsive web applications.

## 🚀 Features

- **React 18** - React version with improved rendering and concurrent features
- **Vite** - Lightning-fast build tool and development server
- **Redux Toolkit** - State management with simplified Redux setup
- **TailwindCSS** - Utility-first CSS framework with extensive customization
- **React Router v6** - Declarative routing for React applications
- **Data Visualization** - Integrated D3.js and Recharts for powerful data visualization
- **Form Management** - React Hook Form for efficient form handling
- **Animation** - Framer Motion for smooth UI animations
- **Testing** - Jest and React Testing Library setup

## 📋 Prerequisites

- Node.js (v14.x or higher)
- npm or yarn

## 🛠️ Installation

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
   
2. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

## 📁 Project Structure

```
react_app/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── styles/         # Global styles and Tailwind configuration
│   ├── App.jsx         # Main application component
│   ├── Routes.jsx      # Application routes
│   └── index.jsx       # Application entry point
├── .env                # Environment variables
├── index.html          # HTML template
├── package.json        # Project dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
└── vite.config.js      # Vite configuration
```

## 🧩 Adding Routes

To add new routes to the application, update the `Routes.jsx` file:

```jsx
import { useRoutes } from "react-router-dom";
import HomePage from "pages/HomePage";
import AboutPage from "pages/AboutPage";

const ProjectRoutes = () => {
  let element = useRoutes([
    { path: "/", element: <HomePage /> },
    { path: "/about", element: <AboutPage /> },
    // Add more routes as needed
  ]);

  return element;
};
```

## 🎨 Styling

This project uses Tailwind CSS for styling. The configuration includes:

- Forms plugin for form styling
- Typography plugin for text styling
- Aspect ratio plugin for responsive elements
- Container queries for component-specific responsive design
- Fluid typography for responsive text
- Animation utilities

## 📱 Responsive Design

The app is built with responsive design using Tailwind CSS breakpoints.


## 📦 Deployment

Build the application for production:

```bash
npm run build
```

## OpenStreetMap Integration

This application uses OpenStreetMap data to find nearby clinics and healthcare providers.

### Backend Server

The backend server provides two API endpoints:

1. **GET /api/nearby-clinics** - Find clinics near a location
   - Parameters: `lat`, `lng`, `radius` (optional, default 5000m)
   - Returns: List of clinics with name, address, phone, website, opening hours

2. **GET /api/geocode** - Convert address to coordinates
   - Parameters: `q` (address query)
   - Returns: Latitude and longitude for the address

### Running the Backend

```bash
# Install dependencies (if not already installed)
npm install

# Start the backend server
npm run server

# Or use nodemon for development (auto-restart)
npm run server:dev
```

The backend server runs on `http://localhost:3001` by default.

### Testing the API

```bash
# Test nearby clinics endpoint
curl "http://localhost:3001/api/nearby-clinics?lat=14.5995&lng=120.9842&radius=3000"

# Test geocode endpoint
curl "http://localhost:3001/api/geocode?q=Quezon+City+Hall"
```

### OpenStreetMap Usage Policy

**IMPORTANT**: This application uses public Overpass API and Nominatim servers provided by OpenStreetMap.

- **Rate Limiting**: The backend implements 10-minute in-memory caching to reduce API requests
- **User-Agent**: All requests include a proper User-Agent header identifying the application
- **Usage Limits**: Public servers are intended for low-volume/testing use only
- **Production Use**: For heavy traffic or production deployment, consider:
  - Hosting your own Overpass API instance
  - Using a paid OSM data provider
  - Implementing additional rate limiting and caching strategies

**Resources**:
- [Overpass API Usage Policy](https://dev.overpass-api.de/overpass-doc/en/preface/commons.html)
- [Nominatim Usage Policy](https://operations.osmfoundation.org/policies/nominatim/)
- [OpenStreetMap License](https://www.openstreetmap.org/copyright)

### Data Attribution

All map data © OpenStreetMap contributors. When displaying clinic information, ensure proper attribution is maintained.

## 🙏 Acknowledgments

- Built with [Rocket.new](https://rocket.new)
- Powered by React and Vite
- Styled with Tailwind CSS

Built with ❤️ on Rocket.new
