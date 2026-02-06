// app/components/StarWarsTitle.jsx
"use client";

import { PrismicRichText } from "@prismicio/react";
import "../../../app/assets/fonts.css";
import "../../../app/globals.css";
import { motion, useAnimate } from "framer-motion";
import { useEffect } from "react";

function StarWarsTitle({ titoloHero }) {
    const [scope, animate] = useAnimate();

    useEffect(() => {
        // Rimuovi "firstAnimationCompleted" dal localStorage al caricamento del componente
        localStorage.removeItem("firstAnimationCompleted");

        animate(
            scope.current,
            { opacity: [0, 1], scale: [0.5, 1] },
            { duration: 1, ease: "easeOut" }
        ).then(() => {
            setTimeout(() => {
                animate(
                    scope.current,
                    { y: ["0%", "-33%"], scale: 0.75 },
                    { duration: 1, ease: "easeOut" }
                ).then(() => {
                    localStorage.setItem("firstAnimationCompleted", "true");
                });
            }, 1000);
        });
    }, [scope, animate]);

    return (
        titoloHero && (
            <motion.div
                ref={scope}
                style={{
                    fontFamily: "SwFont",
                    willChange: "transform, opacity",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transformStyle: "preserve-3d",
                    transform: "translateZ(0)"
                }}
                className="text-60 md:text-75 text-starwars-yellow leading-none text-center p-2"
            >
                <PrismicRichText field={titoloHero} />
            </motion.div>
        )
    );
}

export default StarWarsTitle;
