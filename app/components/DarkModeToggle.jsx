'use client';

import { useEffect, useState } from 'react';

const DarkModeToggle = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const applyTheme = () => {
            const storedTheme = localStorage.getItem('theme');

            if (storedTheme === 'dark') {
                document.documentElement.classList.add('dark');
                setIsDarkMode(true);
            } else {
                // Default a light se nulla è salvato
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
                setIsDarkMode(false);
            }
        };

        applyTheme();

        const handleOSPreferenceChange = (event) => {
            if (!localStorage.getItem('theme')) {
                const isDark = event.matches;
                document.documentElement.classList.toggle('dark', isDark);
                setIsDarkMode(isDark);
            }
        };

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', handleOSPreferenceChange);

        return () => {
            mediaQuery.removeEventListener('change', handleOSPreferenceChange);
        };
    }, []);

    const toggleDarkMode = () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);

        if (newDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }

        // Forza il re-render dei componenti che lo ascoltano
        window.dispatchEvent(new Event('themeChanged'));
    };

    return (
        <button onClick={toggleDarkMode} className="px-1 py-0 border dark:border-white text-16 w-auto">
            {isDarkMode ? 'LUMOS' : 'NOX'}
        </button>
    );
};

export default DarkModeToggle;
