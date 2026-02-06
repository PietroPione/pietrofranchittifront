"use client";

import React, { useState, useEffect, useRef } from "react";

export default function ListaRandom({ testoLista, elencoLista }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [textBgColor, setTextBgColor] = useState('#FFFFFF');
    const positions = useRef([]);
    const animationFrameId = useRef(null);
    const margin = 5; // Margine di sicurezza ridotto (in percentuale)

    useEffect(() => {
        const generatePositions = () => {
            return elencoLista.map(() => {
                const radiusMin = 35;
                const radiusMax = 40;
                const angle = Math.random() * 2 * Math.PI;
                const radius = radiusMin + Math.random() * (radiusMax - radiusMin);
                const top = `${50 + radius * Math.sin(angle)}%`;
                const left = `${50 + radius * Math.cos(angle)}%`;
                return { top, left };
            });
        };

        positions.current = generatePositions();

        let startTime = null;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;

            if (progress > 1200) {
                setCurrentIndex((prevIndex) => {
                    const nextIndex = (prevIndex + 1) % elencoLista.length;
                    positions.current[nextIndex] = {
                        top: `${Math.random() * (80 - 2 * margin) + margin}%`, // Margine di sicurezza per top
                        left: `${Math.random() * (80 - 2 * margin) + margin}%`, // Margine di sicurezza per left
                    }; // Rigenera la posizione per il nuovo elemento
                    return nextIndex;
                });
                setTextBgColor(getRandomLightColor());
                startTime = timestamp;
            }

            animationFrameId.current = requestAnimationFrame(animate);
        };

        animationFrameId.current = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId.current);
    }, [elencoLista]);

    function getRandomLightColor() {
        const letters = '89ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 8)];
        }
        return color;
    }

    return (
        <div className="h-screen relative flex flex-col items-center justify-center overflow-hidden">
            <h3 className="text-36 text-black px-6 py-4" style={{ backgroundColor: textBgColor }}>{testoLista}</h3>
            <div className="w-full h-screen absolute aspect-video flex items-center justify-center">
                {elencoLista.map((item, i) => (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            top: positions.current[i]?.top,
                            left: positions.current[i]?.left,
                            opacity: i === currentIndex ? 1 : 0,
                            transition: "opacity 0.8s ease-in-out",
                            backgroundColor: i === currentIndex ? textBgColor : 'transparent',
                        }}
                    >
                        <p className="text-60 font-bold text-center px-6 py-4">{item.bullet_point}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}