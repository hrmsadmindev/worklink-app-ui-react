import React, { createContext, useContext, useReducer, useEffect, useRef, useCallback } from 'react';
import { authService } from '../services/auth';

const AuthContext = createContext();

const initialState = {
  user: null,
  loading: true,
  authenticated: false,
  error: null
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        authenticated: true, 
        user: action.payload, 
        loading: false, 
        error: null 
      };
    case 'LOGIN_FAILURE':
      return { 
        ...state, 
        authenticated: false, 
        user: null, 
        loading: false, 
        error: action.payload 
      };
    case 'LOGOUT':
      return { 
        ...state, 
        authenticated: false, 
        user: null, 
        loading: false, 
        error: null 
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'TOKEN_EXPIRED':
      return {
        ...state,
        authenticated: false,
        user: null,
        loading: false,
        error: 'Session expired. Please log in again.'
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const logoutTimerRef = useRef(null);
  const activityTimerRef = useRef(null);

  // Clear any existing timers
  const clearTimers = () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
    if (activityTimerRef.current) {
      clearTimeout(activityTimerRef.current);
      activityTimerRef.current = null;
    }
  };

  // Handle token expiration
  const handleTokenExpiration = useCallback(async () => {
    clearTimers();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    dispatch({ type: 'TOKEN_EXPIRED' });

    // Show user-friendly notification
    if (window.confirm('Your session has expired. Would you like to log in again?')) {
      window.location.reload();
    }
  }, []);

  // Set up automatic logout timer
  const setupLogoutTimer = useCallback(() => {
    clearTimers();

    const token = localStorage.getItem('accessToken');
    if (token && authService.isTokenValid(token)) {
      const timeUntilExpiry = authService.getTimeUntilExpiry(token);

      console.log(`[AuthContext] Setting logout timer for ${Math.round(timeUntilExpiry / 1000 / 60)} minutes`);

      logoutTimerRef.current = setTimeout(() => {
        console.log('[AuthContext] Token expired - auto logout');
        handleTokenExpiration();
      }, timeUntilExpiry);
    }
  }, [handleTokenExpiration]);

  // Check authentication status on app load WITH token expiration validation
  useEffect(() => {
    const checkAuth = async () => {
      console.log('[AuthContext] Checking authentication...');

      try {
        const token = localStorage.getItem('accessToken');
        const user = authService.getCurrentUser();

        console.log('[AuthContext] Token exists:', !!token);
        console.log('[AuthContext] User exists:', !!user);

        // Validate token expiration
        if (token && user && authService.isTokenValid(token)) {
          console.log('[AuthContext] Valid session found, user:', user);
          dispatch({ type: 'LOGIN_SUCCESS', payload: user });
          setupLogoutTimer(); // Set up automatic logout
        } else {
          // Token expired or invalid - clear corrupted data
          console.log('[AuthContext] Token expired or invalid - clearing data');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('[AuthContext] Error during auth check:', error);
        // Clear any corrupted data
        localStorage.clear();
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuth();
  }, [setupLogoutTimer]);

  // Set up automatic logout timer when user becomes authenticated
  useEffect(() => {
    if (state.authenticated && state.user) {
      setupLogoutTimer();
    } else {
      clearTimers();
    }

    // Cleanup on unmount
    return () => clearTimers();
  }, [state.authenticated, state.user, setupLogoutTimer]);

  // Check token validity on window focus
  useEffect(() => {
    const handleWindowFocus = () => {
      if (state.authenticated) {
        const token = localStorage.getItem('accessToken');
        if (token && !authService.isTokenValid(token)) {
          console.log('[AuthContext] Token expired on window focus');
          handleTokenExpiration();
        }
      }
    };

    window.addEventListener('focus', handleWindowFocus);
    return () => window.removeEventListener('focus', handleWindowFocus);
  }, [state.authenticated, handleTokenExpiration]);

  // Periodic token validation (every 5 minutes)
  useEffect(() => {
    if (state.authenticated) {
      const intervalId = setInterval(() => {
        const token = localStorage.getItem('accessToken');
        if (token && !authService.isTokenValid(token)) {
          console.log('[AuthContext] Token expired during periodic check');
          handleTokenExpiration();
        }
      }, 5 * 60 * 1000); // Check every 5 minutes

      return () => clearInterval(intervalId);
    }
  }, [state.authenticated, handleTokenExpiration]);

  const login = async (credentials) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const result = await authService.login(credentials);
      
      if (result.success) {
        localStorage.setItem('user', JSON.stringify(result.user));
        dispatch({ type: 'LOGIN_SUCCESS', payload: result.user });
        setupLogoutTimer(); // Set up timer for new session
        return { success: true };
      } else {
        dispatch({ type: 'LOGIN_FAILURE', payload: result.error });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error.message || 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    console.log('[AuthContext] Logout initiated');
    clearTimers();
    
    try {
      await authService.logout();
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('[AuthContext] Logout error:', error);
      // Force logout even if API call fails
      localStorage.clear();
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Method to refresh token and reset timer
  const refreshSession = async () => {
    const token = localStorage.getItem('accessToken');
    if (token && authService.isTokenValid(token)) {
      setupLogoutTimer();
      return true;
    }
    return false;
  };

  // Helper functions for role checking
  const hasRole = (role) => {
    return state.user?.role === role || state.user?.roles?.includes(role);
  };

  const hasAnyRole = (roles) => {
    if (!state.user) return false;
    return roles.some(role => hasRole(role));
  };

  const value = {
    ...state,
    login,
    logout,
    refreshSession,
    hasRole,
    hasAnyRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};