"use client";

import { useEffect, useState } from "react";

export default function BulletCycle({
    items = [],
    className = "",
    itemClassName = "",
    typeSpeedMs = 55,
    deleteSpeedMs = 30,
    pauseMs = 1100,
}) {
    const [index, setIndex] = useState(0);
    const [display, setDisplay] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (!items.length) return;
        const fullText = items[index] || "";

        if (!isDeleting && display === fullText) {
            const pause = setTimeout(() => setIsDeleting(true), pauseMs);
            return () => clearTimeout(pause);
        }

        if (isDeleting && display === "") {
            setIsDeleting(false);
            setIndex((current) => (current + 1) % items.length);
            return;
        }

        const speed = isDeleting ? deleteSpeedMs : typeSpeedMs;
        const timeout = setTimeout(() => {
            const nextLength = isDeleting ? display.length - 1 : display.length + 1;
            setDisplay(fullText.slice(0, Math.max(0, nextLength)));
        }, speed);

        return () => clearTimeout(timeout);
    }, [items, index, display, isDeleting, typeSpeedMs, deleteSpeedMs, pauseMs]);

    if (!items.length) return null;

    return (
        <div className={`relative flex items-center min-h-[3rem] ${className}`.trim()}>
            <p className={`inline-flex items-center leading-none ${itemClassName}`.trim()}>
                <span>{display}</span>
                <span
                    className="ml-1 inline-block w-[0.6ch] h-[1em] align-middle bg-current opacity-80 animate-pulse"
                    aria-hidden="true"
                />
            </p>
        </div>
    );
}
