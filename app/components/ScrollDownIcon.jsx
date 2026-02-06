// components/ScrollDownIcon.jsx (Client Component)
"use client";

import React, { useState, useEffect } from "react";
import { ArrowBigDownDash } from "lucide-react";
import { useTheme } from "@/app/components/ThemeProvider";

export default function ScrollDownIcon() {
    const [showIcon, setShowIcon] = useState(true);
    const { isDarkMode } = useTheme();

    useEffect(() => {
        const handleScroll = () => {
            setShowIcon(false);
            window.removeEventListener("scroll", handleScroll);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (!showIcon) {
        return null;
    }

    return (
        <div
            className={`absolute top-[75vh] translate-y-1/2 right-1/2 translate-x-1/2 z-50 transition-opacity duration-300 opacity-100`}
        >
            <ArrowBigDownDash
                size={40}
                strokeWidth={1.5}
                className={`rounded-full ${isDarkMode ? "text-black bg-white" : "text-white bg-black"}`}
            />
        </div>
    );
}