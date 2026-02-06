"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTheme } from "@/app/components/ThemeProvider"; // Assicurati che il percorso sia corretto

export default function VeraBio({ bioVeraText, fotoBioVera }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const { isDarkMode } = useTheme(); // Ottieni lo stato della modalità scura

    const opacity = useTransform(scrollYProgress, [0.33, 0.5, 0.66], [0, 0.66, 0.75]);

    // Definisci l'intervallo di colori di sfondo in base alla modalità scura
    const lightModeBackgroundColor = ["rgba(0, 0, 0, 1)", "rgba(0, 0, 0, 0.75)", "rgba(0, 0, 0, 0)"];
    const darkModeBackgroundColor = ["rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 0.75)", "rgba(255, 255, 255, 0)"];

    const backgroundColor = useTransform(
        scrollYProgress,
        [0.25, 0.40, 0.50],
        isDarkMode ? darkModeBackgroundColor : lightModeBackgroundColor
    );

    const imageOpacity = useTransform(scrollYProgress, [0.2, 0.3, 0.4], [0, 0.5, 1]);
    let formattedText = [];
    let currentLine = [];

    bioVeraText.forEach((item, index) => {
        currentLine.push(
            <React.Fragment key={`line-${index}`}>
                {item.frase}{" "}
                <motion.span style={{ backgroundColor }} className="font-bold">
                    {item.accento}
                </motion.span>
                {item.punto_dopo ? "." : " "} {/* Aggiunto uno spazio se non c'è il punto */}
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
        <div ref={ref} className="h-[200vh] container">
            <div className="flex flex-col md:flex-row sticky top-0">
                {/* Parte sinistra: Bio */}
                <div className="w-full md:w-1/2 p-8 flex items-center justify-center">
                    <div>{formattedText}</div>
                </div>

                <div className="w-full md:w-1/2 pb-8 pr-8 pl-8 md:p-8 flex items-center justify-center">

                    <motion.div
                        className="relative h-[50vh] md:h-[90vh] w-auto aspect-[9/16] flex items-center justify-center"
                        style={{ opacity: imageOpacity }}
                    >
                        {fotoBioVera && (
                            <Image
                                src={fotoBioVera.url}
                                alt={fotoBioVera.alt || "Immagine Vera Bio"}
                                width={fotoBioVera.dimensions.width}
                                height={fotoBioVera.dimensions.height}
                                className="max-w-full max-h-full object-contain absolute top-0 left-0"
                            />
                        )}
                    </motion.div>

                </div>
            </div>
        </div>
    );
}