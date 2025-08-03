import axios from 'axios'; // Axios is used to perform HTTP requests in JavaScript apps

// Create a new axios instance with a custom configuration
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // All requests will be relative to this URL
  headers: {
    'Content-Type': 'application/json', // Tell the server we're sending JSON
  },
});

// List REST endpoints where we do NOT need to send a JWT token.
// These endpoints handle authentication and must be public for login and registration
const authExcludedEndpoints = [
  '/auth/login',     // Login endpoint (gets a token; shouldn't send one)
  '/auth/register',  // Registration endpoint (usually public)
  '/auth/refresh',   // Used to refresh an expired token
];

// Helper function to determine if the endpoint is public (doesn't need token)
function isAuthExcluded(url) {
  // Checks if the requested URL includes any of our excluded endpoints
  // Allows this to work with full URLs, relative paths, and query strings
  return authExcludedEndpoints.some((endpoint) => url.includes(endpoint));
}

/**
 * REQUEST INTERCEPTOR:
 * This runs BEFORE every HTTP request sent using 'api'.
 * It attaches an Authorization header with the JWT token
 * ONLY if:
 *   - We have a token stored AND
 *   - The request is NOT to a public (auth) endpoint
 */
api.interceptors.request.use(
  (config) => {
    // Retrieve the token that was saved at login
    const token = localStorage.getItem('accessToken');
    // Only attach Authorization if necessary
    if (
      token &&            // Token must exist
      config.url &&       // URL must not be empty
      !isAuthExcluded(config.url) // This endpoint must need a token
    ) {
      // Set the Authorization header as expected by servers using JWTs
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Return the config so Axios can proceed
    return config;
  },
  (error) => Promise.reject(error) // Pass error to the next handler if something went wrong
);


/**
 * RESPONSE INTERCEPTOR:
 * This runs when a response is received, or if an error occurs.
 * Purpose: If a request fails due to an expired token (HTTP 401),
 *           - It will attempt to refresh the token automatically,
 *           - Retry the failed request with the new token, so the user doesn't get logged out
 */
api.interceptors.response.use(
  (response) => response, // If response is fine, just send it back unchanged
  async (error) => {
    const originalRequest = error.config; // The request that just errored

    // If we got a 401 Unauthorized (token expired) and this isn't a retry already
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite loop!
      
      //TODO: Add refreshToken later if needed
    }

    // For any other errors, just forward the error to whoever called axios
    return Promise.reject(error);
  }
);

export default api; // Now, import and use this api instance throughout your project!
