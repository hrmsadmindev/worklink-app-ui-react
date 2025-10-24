import api from './api';

export const authService = {
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', {
        email: credentials.email,
        password: credentials.password,
        employeeId: credentials.employeeId
      });
      
      // Extract from nested data
      const { accessToken, email, role, employeeId } = response.data.data;
      
      // Store token
      localStorage.setItem('accessToken', accessToken);
      
      // Create user object from separate email and role
      const user = { 
        email: email, 
        role: role,
        employeeId: employeeId
      };
      
      // Store user object (not just email)
      localStorage.setItem('user', JSON.stringify(user));
      
      console.log('[authService] Stored user object:', user);
      console.log('[authService] Token expiry time:', this.getTokenExpiryTime(accessToken));
      
      // Return the complete user object
      return { success: true, user: user };
      
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  },

  async logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  },

  /**
   * NEW: Validate if token is not expired
   * @param {string} token - JWT token to validate
   * @returns {boolean} - true if token is valid and not expired
   */
  isTokenValid(token) {
    if (!token) {
      console.log('[authService] No token provided');
      return false;
    }
    
    try {
      // Decode JWT payload (base64)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000; // Convert to seconds
      
      // Check if token is expired
      const isValid = payload.exp > currentTime;
      
      if (!isValid) {
        console.log('[authService] Token expired. Exp:', new Date(payload.exp * 1000), 'Current:', new Date());
      }
      
      return isValid;
    } catch (error) {
      console.error('[authService] Error validating token:', error);
      return false;
    }
  },

  /**
   * NEW: Get time until token expires (in milliseconds)
   * @param {string} token - JWT token
   * @returns {number} - milliseconds until expiration (0 if expired or invalid)
   */
  getTimeUntilExpiry(token) {
    if (!token) return 0;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiryTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      
      const timeUntilExpiry = Math.max(0, expiryTime - currentTime);
      
      console.log('[authService] Time until expiry:', Math.round(timeUntilExpiry / 1000 / 60), 'minutes');
      
      return timeUntilExpiry;
    } catch (error) {
      console.error('[authService] Error getting token expiry:', error);
      return 0;
    }
  },

  /**
   * NEW: Get token expiry time as Date object
   * @param {string} token - JWT token
   * @returns {Date|null} - expiry date or null if invalid
   */
  getTokenExpiryTime(token) {
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return new Date(payload.exp * 1000);
    } catch (error) {
      console.error('[authService] Error getting token expiry time:', error);
      return null;
    }
  },

  /**
   * NEW: Get token issued time as Date object
   * @param {string} token - JWT token
   * @returns {Date|null} - issued date or null if invalid
   */
  getTokenIssuedTime(token) {
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return new Date(payload.iat * 1000);
    } catch (error) {
      console.error('[authService] Error getting token issued time:', error);
      return null;
    }
  },

  /**
   * NEW: Check if token expires within specified minutes
   * @param {string} token - JWT token
   * @param {number} minutes - minutes to check
   * @returns {boolean} - true if token expires within specified minutes
   */
  willExpireWithin(token, minutes = 5) {
    const timeUntilExpiry = this.getTimeUntilExpiry(token);
    return timeUntilExpiry < (minutes * 60 * 1000);
  },

  /**
   * UPDATED: Enhanced authentication check with expiration validation
   * @returns {boolean} - true if user is authenticated with valid token
   */
  isAuthenticated() {
    const token = localStorage.getItem('accessToken');
    const user = this.getCurrentUser();
    
    // Check BOTH token existence AND expiration
    const hasValidToken = token && this.isTokenValid(token);
    const hasValidUser = user && user.email;
    
    if (token && !this.isTokenValid(token)) {
      console.log('[authService] Token exists but is expired - clearing storage');
      this.logout(); // Clear expired data
      return false;
    }
    
    return !!(hasValidToken && hasValidUser);
  },

  /**
   * Get current user from localStorage
   * @returns {Object|null} - user object or null
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * NEW: Get detailed authentication status
   * @returns {Object} - detailed status information
   */
  getAuthStatus() {
    const token = localStorage.getItem('accessToken');
    const user = this.getCurrentUser();
    
    return {
      hasToken: !!token,
      hasUser: !!user,
      isTokenValid: token ? this.isTokenValid(token) : false,
      tokenExpiry: token ? this.getTokenExpiryTime(token) : null,
      timeUntilExpiry: token ? this.getTimeUntilExpiry(token) : 0,
      willExpireSoon: token ? this.willExpireWithin(token, 5) : false,
      isAuthenticated: this.isAuthenticated()
    };
  },

  /**
   * NEW: Debug method to log authentication status
   */
  debugAuthStatus() {
    const status = this.getAuthStatus();
    console.log('[authService] Authentication Status:', status);
    return status;
  }
};