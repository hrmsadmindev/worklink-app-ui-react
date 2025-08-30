// HRMS Theme Configuration for styled-components

export const colors = {
  primary: "#1866d7",
  primaryHover: "#154b9c", 
  secondary: "#e3eefd",
  background: "#f7fafd",
  textPrimary: "#222e3a",
  textSecondary: "#4a6886",
  border: "#e8e8f1",
  white: "#fff",
  success: "#28a745",
  warning: "#ffc107", 
  danger: "#dc3545",
  info: "#17a2b8",
  light: "#f8f9fa",
  dark: "#343a40"
};

// Typography configuration with font families
export const typography = {
  // Font families
  fonts: {
    primary: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
    secondary: "Poppins, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", 
    heading: "Outfit, Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    monospace: "'JetBrains Mono', 'Fira Code', Consolas, 'Liberation Mono', Monaco, 'Courier New', monospace"
  },

  // Font weights
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800
  },

  // Line heights for better readability
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2
  },

  // Letter spacing
  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.025em", 
    normal: "0em",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em"
  }
};

export const spacing = {
  xs: "0.25rem",
  sm: "0.5rem", 
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  xxl: "3rem"
};

export const fontSize = {
  xs: "0.75rem",
  sm: "0.875rem",
  md: "1rem", 
  lg: "1.125rem",
  xl: "1.25rem",
  xxl: "1.5rem",
  xxxl: "2rem"
};

export const borderRadius = {
  sm: "0.25rem",
  md: "0.375rem",
  lg: "0.5rem", 
  xl: "0.75rem",
  xxl: "1rem"
};

export const shadows = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
};

// Combined theme object (required for styled-components ThemeProvider)
const theme = {
  colors,
  typography,  // <- ADD THIS LINE!
  spacing,
  fontSize,
  borderRadius, 
  shadows
};

export default theme;