import { breakpoints, devices, containerWidths } from './responsive';

const theme = {
  colors: {
    primary: '#4f46e5',
    secondary: '#7c3aed',
    accent: '#06b6d4',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    light: '#f8fafc',
    dark: '#0f172a',
    white: '#ffffff',
    background: '#f8fafc',
    text: '#334155',
    textLight: '#64748b',
    border: '#e2e8f0',
    cardBg: '#ffffff',
    shadow: 'rgba(0, 0, 0, 0.1)',
    highlight: '#ede9fe',
    muted: '#f1f5f9'
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: {
      small: '0.875rem',
      base: '1rem',
      large: '1.25rem',
      xlarge: '1.5rem',
      xxlarge: '2rem'
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      loose: 2
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem'
  },
  borderRadius: {
    small: '0.25rem',
    default: '0.5rem',
    large: '0.75rem',
    xl: '1rem',
    full: '9999px'
  },
  shadows: {
    small: '0 1px 3px rgba(0,0,0,0.12)',
    default: '0 2px 4px rgba(0,0,0,0.08)',
    medium: '0 4px 6px rgba(0,0,0,0.1)',
    large: '0 10px 15px -3px rgba(0,0,0,0.1)',
    xl: '0 20px 25px -5px rgba(0,0,0,0.1)'
  },
  breakpoints,
  devices,
  containerWidths,
  transitions: {
    default: '0.3s ease',
    fast: '0.15s ease',
    slow: '0.5s ease'
  }
};

export default theme;