"use client";
import { PrismicRichText } from "@prismicio/react";
import "../../../app/assets/fonts.css";
import "../../../app/globals.css";
import { Space_Grotesk } from "next/font/google";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-space-grotesk",
});

function StarWarsParagraph({ testoHero }) {
    const animationPlayed = useRef(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const checkAnimation = () => {
            if (localStorage.getItem("firstAnimationCompleted") === "true" && !animationPlayed.current) {
                animationPlayed.current = true;
                setIsVisible(true);
            }
        };

        checkAnimation();
        const interval = setInterval(checkAnimation, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        isVisible &&
        testoHero && (
            <motion.div
                initial={{ y: 100, opacity: 0 }} // Parte in basso e trasparente
                animate={{ y: 0, opacity: 1 }} // Sale e diventa visibile
                transition={{ duration: 2, ease: "easeOut" }} // Animazione lenta e fluida
                className={`text-starwars-yellow text-22 md:text-32 text-center ${spaceGrotesk.variable} font-space-grotesk`}
            >
                <PrismicRichText field={testoHero} />
            </motion.div>
        )
    );
}

export default StarWarsParagraph;
