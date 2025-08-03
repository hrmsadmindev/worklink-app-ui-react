import React, { createContext, useContext, useReducer, useEffect } from 'react';
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
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication status on app load
  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        const user = authService.getCurrentUser();
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    
    checkAuth();
  }, []);

  const login = async (credentials) => {
    dispatch({ type: 'LOGIN_START' });
    
    const result = await authService.login(credentials);
    
    if (result.success) {
      localStorage.setItem('user', JSON.stringify(result.user));
      dispatch({ type: 'LOGIN_SUCCESS', payload: result.user });
      return { success: true };
    } else {
      dispatch({ type: 'LOGIN_FAILURE', payload: result.error });
      return { success: false, error: result.error };
    }
  };

  const logout = async () => {
    await authService.logout();
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const value = {
    ...state,
    login,
    logout
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
