// ==============================================================================
// PORTFOLIO CENTRALIZED API CONFIGURATION
// ==============================================================================
// When deploying to production on Render:
// 1. Deploy your backend to Render as a Web Service.
// 2. Copy your live Render URL (e.g. https://portfolio-backend-xyz.onrender.com).
// 3. Replace the placeholder in RENDER_API_BASE_URL below with your Render URL + '/api'.
// ==============================================================================

const RENDER_API_BASE_URL = "https://portfolio-3b01.onrender.com/api";

// Automatically detect local development environment
const isLocal = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname === '' ||
  window.location.protocol === 'file:'
);

const API_BASE_URL = isLocal ? 'http://localhost:5000/api' : RENDER_API_BASE_URL;

// Expose globally for all frontend scripts
window.API_BASE_URL = API_BASE_URL;
window.API_URL = API_BASE_URL;
