"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTheme } from "@/app/components/ThemeProvider";

export default function FalsaBio({ bio, fotofalsabuona, fotofalsacattiva, keep_scrolling }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const { isDarkMode } = useTheme();

    const opacity = useTransform(scrollYProgress, [0.33, 0.5, 0.75], [0, 0.75, 0.75]);

    const lightModeBackgroundColor = ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.75)", "rgba(0, 0, 0, 1)"];
    const darkModeBackgroundColor = ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.75)", "rgba(255, 255, 255, 1)"];
    const backgroundColor = useTransform(
        scrollYProgress,
        [0.33, 0.42, 0.66],
        isDarkMode ? darkModeBackgroundColor : lightModeBackgroundColor
    );

    const [shouldAnimate, setShouldAnimate] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShouldAnimate(true);
        }, 3500);

        return () => clearTimeout(timer); // Pulisce il timer se il componente viene smontato
    }, []);

    let formattedText = [];
    let currentLine = [];

    bio.forEach((item, index) => {
        currentLine.push(
            <React.Fragment key={`line-${index}`}>
                {item.frase}{" "}
                <motion.span style={{ backgroundColor }} className="font-bold">
                    {item.accento}
                </motion.span>
                {item.punto_dopo ? "." : " "}
            </React.Fragment>
        );

        if (item.punto_dopo) {
            formattedText.push(
                <p key={`paragraph-${index}`} className="text-14 md:text-22 mb-4">
                    {currentLine}
                </p>
            );
            currentLine = [];
        }
    });

    return (
        <div ref={ref} className="h-[200vh] container relative">
            <div className="flex flex-col md:flex-row sticky top-0">
                {/* Parte sinistra: Bio */}
                <div className="w-full md:w-1/2 p-8 flex flex-col justify-center space-y-4">
                    {formattedText && <div>{formattedText}</div>}
                    <div className="text-14 md:text-22 lg:text-26 font-black">
                        {keep_scrolling && shouldAnimate && (
                            <motion.span
                                animate={{ opacity: [1, 0, 1] }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 3.0,
                                    ease: "easeInOut",
                                }}
                            >
                                {keep_scrolling}
                            </motion.span>
                        )}
                        {keep_scrolling && !shouldAnimate && <span style={{ opacity: 0 }}>{keep_scrolling}</span>}
                    </div>
                </div>

                {/* Parte destra: Immagine */}
                <div className="w-full md:w-1/2  pb-8 pr-8 pl-8 md:p-8 flex items-center justify-center">
                    <div className="relative h-[50vh] md:h-[90vh] w-auto aspect-[9/16] flex items-center justify-center">
                        {fotofalsabuona && fotofalsacattiva && (
                            <>
                                <Image
                                    src={fotofalsabuona.url}
                                    alt={fotofalsabuona.alt || "Immagine Falsa Bio"}
                                    width={fotofalsabuona.dimensions.width}
                                    height={fotofalsabuona.dimensions.height}
                                    className="max-w-full max-h-full object-contain absolute top-0 left-0"
                                />

                                <motion.div style={{ opacity }} className="absolute top-0 left-0 w-full h-full">
                                    <Image
                                        src={fotofalsacattiva.url}
                                        alt={fotofalsacattiva.alt || "Immagine Falsa Bio Cattiva"}
                                        width={fotofalsacattiva.dimensions.width}
                                        height={fotofalsacattiva.dimensions.height}
                                        className="max-w-full max-h-full object-contain"
                                    />
                                </motion.div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}