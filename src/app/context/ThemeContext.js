'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  // Load saved theme on startup
  useEffect(() => {
    const stored = localStorage.getItem('theme') || 'light';
    setTheme(stored);
    document.documentElement.classList.add(`${stored}-mode`);
  }, []);

  // Apply theme class to <html> element
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light-mode', 'dark-mode');
    root.classList.add(`${theme}-mode`);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
