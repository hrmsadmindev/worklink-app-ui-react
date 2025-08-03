import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ThemeProvider } from 'styled-components';
import theme from './theme';
import { AuthProvider } from './context/AuthContext';
import { RolesProvider } from './context/RolesContext.jsx';
// import { RolesProvider } from './context/RolesContext';

ReactDOM.createRoot(document.querySelector('#root')).render(
  <ThemeProvider theme={theme}>
    <AuthProvider>
      <RolesProvider>
        <App />
      </RolesProvider>
    </AuthProvider>      
  </ThemeProvider>
);