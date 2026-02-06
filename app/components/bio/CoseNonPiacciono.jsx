// CoseNonPiacciono.jsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import "../../../app/globals.css";

export default function CoseNonPiacciono({ coseNonPiacciono }) {
    if (!coseNonPiacciono || !coseNonPiacciono.primary || !coseNonPiacciono.primary.cosa) {
        return null;
    }

    const { titolo_cose_non_piacciono, cosa } = coseNonPiacciono.primary;
    const [hoveredImage, setHoveredImage] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 768); // Definisci la larghezza per il desktop
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleMouseEnter = (item, event) => {
        setHoveredImage(item.gif_cosa);
        updateMousePosition(event);
    };

    const handleMouseLeave = () => {
        setHoveredImage(null);
    };

    const handleMouseMove = (event) => {
        updateMousePosition(event);
    };

    const updateMousePosition = (event) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setMousePosition({
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
            });
        }
    };

    const imageWidth = isDesktop ? 400 : 200;
    const imageHeight = isDesktop ? 300 : 150;
    const offsetX = isDesktop ? 10 : 5;
    const offsetY = isDesktop ? -250 : -160;

    return (
        <div className="relative">
            <div
                ref={containerRef}
                className="container min-h-[35vh] md:min-h-[60vh] flex-col flex space-y-10 justify-center relative"
            >
                {titolo_cose_non_piacciono && <h2 className="text-20 md:text-32 lg:text-40">{titolo_cose_non_piacciono}</h2>}

                <div className="flex flex-col space-y-4">
                    {cosa.map((item, index) => (
                        <p
                            key={index}
                            onMouseEnter={(e) => handleMouseEnter(item, e)}
                            onMouseLeave={handleMouseLeave}
                            onMouseMove={hoveredImage ? handleMouseMove : undefined}
                            className="text-26 md:text-40 lg:text-46 font-black  hover:text-white hover:bg-black dark:hover:bg-gray-400  relative"
                            style={{ marginLeft: isDesktop ? `${index * 5}rem` : '0' }}
                        >
                            - {item.nome_cosa}
                        </p>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {hoveredImage && (
                    <motion.div
                        className="absolute z-10 pointer-events-none"
                        initial={{ opacity: 0, scale: 0.8, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -20 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        style={{
                            left: mousePosition.x + offsetX,
                            top: mousePosition.y + offsetY,
                        }}
                    >
                        <Image
                            src={hoveredImage.url}
                            alt="Immagine cosa non piaciuta"
                            width={imageWidth}
                            height={imageHeight}
                            style={{ pointerEvents: "none" }}
                            unoptimized
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}