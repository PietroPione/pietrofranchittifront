"use client";

import { useRef, useState, useEffect } from "react";
import * as motion from "motion/react-client";
import { Variants } from "motion/react";

/**
 * @typedef {Object} BulletItem
 * @property {string} bullet_point
 * @property {number[]} color
 */

/**
 * @typedef {Object} BulletCardProps
 * @property {BulletItem} item
 * @property {boolean} isActive
 * @property {number} index
 * @property {number} currentIndex
 */

const containerVariants = {
    offscreen: {
        opacity: 0,
    },
    onscreen: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const cardVariants = {
    offscreen: {
        y: 300,
        opacity: 0,
    },
    onscreen: {
        y: 0,
        opacity: 1,
        rotate: -5,
        transition: {
            type: "spring",
            bounce: 0.4,
            duration: 0.8,
        },
    },
};

const hue = (h) => `hsl(${h}, 100%, 50%)`;

const splash = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    clipPath: `path("M 0 303.5 C 0 292.454 8.995 285.101 20 283.5 L 460 219.5 C 470.085 218.033 480 228.454 480 239.5 L 500 430 C 500 441.046 491.046 450 480 450 L 20 450 C 8.954 450 0 441.046 0 430 Z")`,
};

const card = {
    width: "100%",
    maxWidth: "400px",
    height: "auto",
    minHeight: "200px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    background: "var(--white)",
    boxShadow:
        "0 0 1px hsl(0deg 0% 0% / 0.075), 0 0 2px hsl(0deg 0% 0% / 0.075), 0 0 4px hsl(0deg 0% 0% / 0.075), 0 0 8px hsl(0deg 0% 0% / 0.075), 0 0 16px hsl(0deg 0% 0% / 0.075)",
    transformOrigin: "10% 60%",
    padding: "2rem",
    margin: "0 auto",
    position: "relative",
    zIndex: 10,
};

export default function ScrollTriggeredBullets({ testoLista, elencoLista }) {
    const ref = useRef(null); // Correzione: Crea un ref utilizzando useRef()
    const [currentIndex, setCurrentIndex] = useState(0);

    const mappedElencoLista = elencoLista.map((item, index) => ({
        bullet_point: item.bullet_point,
        color: [340 - (index * 40), 10 + (index * 40)], // Esempio di calcolo dei colori
    }));

    useEffect(() => {
        const handleScroll = () => {
            if (!ref.current) return;

            const container = ref.current;
            const containerHeight = container.offsetHeight;
            const scrollPosition = window.scrollY;

            const scrollProgress = Math.min(
                Math.max(scrollPosition / (document.body.scrollHeight - window.innerHeight), 0),
                0.99
            );

            const newIndex = Math.min(
                Math.floor(scrollProgress * elencoLista.length),
                elencoLista.length - 1
            );

            if (newIndex !== currentIndex) {
                setCurrentIndex(newIndex);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [currentIndex, elencoLista.length]);

    /**
     * @param {BulletCardProps} props
     */
    function BulletCard({ item, isActive, index, currentIndex }) {
        const [hueA, hueB] = item.color;
        const background = `linear-gradient(306deg, ${hue(hueA)}, ${hue(hueB)})`;

        if (index < currentIndex - 1 || index > currentIndex + 1) {
            return null;
        }

        return (
            <motion.div
                className="absolute w-full"
                initial="offscreen"
                animate={isActive ? "onscreen" : "offscreen"}
                variants={containerVariants}
                transition={{
                    type: "spring",
                    bounce: 0.4,
                    duration: 0.8,
                }}
                style={{
                    zIndex: isActive ? 10 : 5,
                    opacity: isActive ? 1 : 0,
                }}
            >
                <div style={{ ...splash, background }} />
                <motion.div variants={cardVariants} className="card" style={card}>
                    <p className="text-xl font-medium text-center px-6">{item.bullet_point}</p>
                </motion.div>
            </motion.div>
        );
    }

    return (
        <div className="h-[300vh]">
            <div
                ref={ref} // Correzione: Assegna il ref creato con useRef()
                className="sticky top-0 flex flex-col items-center justify-start h-screen pt-20"
            >
                <h1 className="text-4xl font-bold mt-16 text-black">{testoLista}</h1>
                <div className="relative w-full max-w-md h-[40vh] flex items-center justify-center">
                    {mappedElencoLista.map((item, i) => (
                        <BulletCard
                            key={i}
                            item={item}
                            isActive={i === currentIndex}
                            index={i}
                            currentIndex={currentIndex}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}