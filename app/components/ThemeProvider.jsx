// app/components/ThemeProvider.jsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// Context senza tipi TypeScript, per JSX puro
const ThemeContext = createContext({ isDarkMode: false });

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    // All'avvio: leggi tema da localStorage o preferenze di sistema
    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme === "dark") {
            setIsDarkMode(true);
            document.documentElement.classList.add("dark");
        } else if (storedTheme === "light") {
            setIsDarkMode(false);
            document.documentElement.classList.remove("dark");
        } else {
            // Fallback: preferenza SO
            const preferDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            setIsDarkMode(preferDark);
            document.documentElement.classList.toggle("dark", preferDark);
            localStorage.setItem("theme", preferDark ? "dark" : "light");
        }
    }, []);

    // Ascolta l'evento custom per cambi tema
    useEffect(() => {
        const onThemeChanged = () => {
            const stored = localStorage.getItem("theme");
            const dark = stored === "dark";
            setIsDarkMode(dark);
            document.documentElement.classList.toggle("dark", dark);
        };

        window.addEventListener("themeChanged", onThemeChanged);
        return () => {
            window.removeEventListener("themeChanged", onThemeChanged);
        };
    }, []);

    return (
        <ThemeContext.Provider value={{ isDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Hook per consumare il contesto
export const useTheme = () => useContext(ThemeContext);
