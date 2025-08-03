import api from './api';

export const authService = {
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', {
        email: credentials.email,
        password: credentials.password
      });
      
      // Extract from nested data
      const { accessToken, email, role } = response.data.data;
      
      // Store token
      localStorage.setItem('accessToken', accessToken);
      
      // Create user object from separate email and role
      const user = { 
        email: email, 
        role: role 
      };
      
      // Store user object (not just email)
      localStorage.setItem('user', JSON.stringify(user));
      
      console.log('[authService] Stored user object:', user);
      
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
    localStorage.removeItem('user'); // Remove user object
  },

  isAuthenticated() {
  const token = localStorage.getItem('accessToken');
  const user = this.getCurrentUser(); // This should return a valid user object
  
  console.log('[authService] Token exists:', !!token);
  console.log('[authService] User exists:', !!user);
  
  // Only consider authenticated if BOTH token and user exist
  return !!(token && user);
},

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null; // Returns full user object
  }
};
