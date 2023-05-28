import React, { createContext, useState, useEffect } from 'react';
import "./navBar.css";

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const storedTheme = localStorage.getItem('theme');
  const [theme, setTheme] = useState(storedTheme || 'light'); // ya get olan theme-ni ver yoxursa LIGHT ele

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme); // setTheme ile set etdiyim ucun storedTheme-ya beraber olur
    localStorage.setItem('theme', newTheme);// set oaln theme-ni newTheme-a beraber edirem
  };

  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };

