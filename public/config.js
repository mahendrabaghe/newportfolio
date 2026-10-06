// ==============================================================================
// PORTFOLIO CENTRALIZED API CONFIGURATION
// ==============================================================================
// Local development setup — backend runs on localhost:5000
// When you are ready to deploy, update API_BASE_URL to your production URL.
// ==============================================================================

const API_BASE_URL = 'http://localhost:5000/api';

// Expose globally for all frontend scripts
window.API_BASE_URL = API_BASE_URL;
window.API_URL = API_BASE_URL;
