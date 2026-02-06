"use client";

import React, { useState, useEffect, useRef, forwardRef } from "react";
import Link from 'next/link';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import DarkModeToggle from "./DarkModeToggle";

const Menu = forwardRef(({ menu }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showToggle, setShowToggle] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const [menuHeight, setMenuHeight] = useState(0);
    const navRef = useRef(null);
    const nodeRef = useRef(null);
    const pathname = usePathname();
    const router = useRouter();
    const isHome = pathname === '/';

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const [themeVersion, setThemeVersion] = useState(0);

    useEffect(() => {
        const handleThemeChange = () => {
            setThemeVersion((prev) => prev + 1);
        };

        window.addEventListener('themeChanged', handleThemeChange);
        return () => window.removeEventListener('themeChanged', handleThemeChange);
    }, []);





    useEffect(() => {
        if (pathname !== '/') {
            setShowToggle(true); // Mostra sempre i bottoni su pagine diverse dalla home
        } else {
            // Su homepage, imposta lo stato iniziale in base allo scroll
            setShowToggle(window.scrollY > window.innerHeight);

            // E poi gestisci gli aggiornamenti con lo scroll
            const handleScroll = () => {
                setShowToggle(window.scrollY > window.innerHeight);
            };

            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, [pathname]);

    useEffect(() => {
        // Reset menu e sticky al cambio pagina
        setIsOpen(false);
        setIsSticky(false);
    }, [pathname]);

    // Gestione dello scroll per il comportamento sticky
    const handleScrollSticky = () => {
        const navElement = navRef.current;
        if (navElement) {
            const offsetTop = navElement.offsetTop;
            if (window.scrollY >= offsetTop && !isSticky) {
                setIsSticky(true);
                setMenuHeight(navElement.offsetHeight);
            } else if (window.scrollY < offsetTop && isSticky) {
                setIsSticky(false);
                setMenuHeight(0);
            }
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScrollSticky);
        return () => window.removeEventListener("scroll", handleScrollSticky);
    }, [isSticky]);

    // Chiudi il menu quando si clicca fuori
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (nodeRef.current && !nodeRef.current.contains(event.target) && isOpen) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [isOpen]);

    if (!menu?.primary?.link) return null;

    const menuVariants = {
        open: { x: 0 },
        closed: { x: "100%" },
    };

    const linkVariants = {
        initial: { x: 20, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { opacity: 0 },
    };

    return (
        <div ref={nodeRef} className="relative">
            {/* Button per tornare alla homepage */}
            {!isHome && showToggle && (
                <button
                    onClick={() => {
                        setIsOpen(false);
                        setTimeout(() => {
                            router.replace("/");
                        }, 100);
                    }}
                    className="fixed top-6 left-8 z-50 border dark:border-white px-2 py-1  text-black dark:bg-transparent bg-white dark:text-white hover:scale-110 transition text-16"
                >
                    homepage
                </button>
            )}

            {/* Toggle per aprire/chiudere il menu */}
            {showToggle && (
                <button
                    onClick={toggleMenu}
                    className="fixed top-4 right-8 z-50 p-2 transition flex items-center justify-center"
                    aria-label={isOpen ? "Chiudi menu" : "Apri menu"}
                >
                    <div className="w-8 h-8 flex items-center justify-center">
                        {isOpen ? (
                            <X className="z-50 w-6 h-6 transition duration-200 dark:text-white hover:scale-110" />
                        ) : (
                            <div className="border px-2 py-1 text-16  text-black dark:bg-transparent bg-white dark:text-white transition duration-200 hover:scale-110">
                                menu
                            </div>
                        )}
                    </div>
                </button>
            )}

            {/* Menu visibile solo se aperto */}
            <AnimatePresence>
                {isOpen && (
                    <motion.nav
                        ref={navRef}
                        className="fixed top-0 right-0 md:right-0 w-full  text-black dark:bg-black bg-white dark:text-white z-40 transition-all duration-300"
                        variants={menuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        transition={{ duration: 0.2 }}
                    >
                        <div className="container pr-16 md:pr-4 py-6 flex flex-col md:flex-row justify-end space-x-0 md:space-x-4">
                            <div className="flex justify-end order-2 md:order-1">

                                <DarkModeToggle />
                            </div>
                            <ul className="flex flex-col md:flex-row items-end justify-center md:space-x-4 order-1 md:order-2">
                                {menu.primary.link.map((item, index) => (
                                    <motion.li
                                        key={index}
                                        variants={linkVariants}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                        transition={{
                                            delay: index * 0.1,
                                            duration: 0.3,
                                            ease: "easeInOut",
                                        }}
                                    >
                                        <Link
                                            href={`/${item.link.url}`}
                                            className="hover:underline text-lg"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {item.testo_link}
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>

            {/* Spazio riservato per sticky menu */}
            {isSticky && (
                <div style={{ height: `${menuHeight}px` }} aria-hidden="true" />
            )}
        </div>
    );
});

Menu.displayName = 'Menu';
export default Menu;