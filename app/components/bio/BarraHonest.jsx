"use client";

import { motion, useTransform, useScroll } from "framer-motion";
import { useRef, useState, useEffect } from "react";

export default function BarraHonest({ testoHonest }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const x1 = useTransform(scrollYProgress, [0.25, 0.75], ["100vw", "-100vw"]);
    const x2 = useTransform(scrollYProgress, [0.35, 0.85], ["105vw", "-95vw"]);
    const x3 = useTransform(scrollYProgress, [0.45, 0.95], ["110vw", "-90vw"]);

    const blinkAnimation = {
        initial: { opacity: 1 },
        animate: {
            opacity: [1, 0.2, 1, 0.2, 1],
            transition: { duration: 1.5, repeat: Infinity }
        }
    };

    return (
        <div
            ref={ref}
            className="h-[50vh] md:h-screen bg-black dark:bg-white flex items-center justify-center overflow-hidden relative"
        >
            <div className="sticky top-0 w-full h-full flex items-center justify-center">
                {isMobile ? (
                    <motion.div
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-36 font-bold text-white dark:text-black whitespace-nowrap"
                        variants={blinkAnimation}
                        initial="initial"
                        animate="animate"
                    >
                        {testoHonest}
                    </motion.div>
                ) : (
                    <div className="flex flex-col gap-8 items-center justify-center">
                        <motion.div
                            style={{ x: x1 }}
                            className="text-95 font-bold text-white dark:text-black whitespace-nowrap"
                        >
                            {testoHonest}
                        </motion.div>
                        <motion.div
                            style={{ x: x2 }}
                            className="text-95 font-bold text-white dark:text-black whitespace-nowrap"
                        >
                            {testoHonest}
                        </motion.div>
                        <motion.div
                            style={{ x: x3 }}
                            className="text-95 font-bold text-white dark:text-black whitespace-nowrap"
                        >
                            {testoHonest}
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
}
