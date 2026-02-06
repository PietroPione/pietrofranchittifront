// PortfolioHome.jsx
"use client";

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import BasicButton from '../BasicButton';
import { motion, AnimatePresence } from 'framer-motion';


export default function PortfolioHome({ portfolioHome, id }) {
    const { primary } = portfolioHome;
    const [selectedProject, setSelectedProject] = useState(primary.progetti[0]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [logoSrc, setLogoSrc] = useState('');
    const [isDesktopView, setIsDesktopView] = useState(true);
    const [isMobileView, setIsMobileView] = useState(false);
    const [expandedProjectIndex, setExpandedProjectIndex] = useState(null);
    const projectListRef = useRef(null);
    const [showMobileImage, setShowMobileImage] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768);
            setIsDesktopView(window.innerWidth >= 768);
            if (window.innerWidth >= 768) {
                setExpandedProjectIndex(null); // Nasconde l'accordion su desktop
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (selectedProject?.made_with) {
            setLogoSrc(`/logos/${selectedProject.made_with}Logo.png`);
        } else {
            setLogoSrc('');
        }
    }, [selectedProject?.made_with]);

    const handleProjectClick = (progetto, index) => {
        setSelectedProject(progetto);
        setSelectedIndex(index);
        if (isMobileView) {
            setExpandedProjectIndex(expandedProjectIndex === index ? null : index);
        } else {
            setIsDesktopView(true);
        }
    };

    const toggleImageView = () => {
        setShowMobileImage(!showMobileImage);
    };

    const currentImageUrl = showMobileImage ? selectedProject?.screen_mobile?.url : selectedProject?.screen_desktop?.url;
    const buttonText = showMobileImage ? "Desktop -->" : "Mobile -->";


    return (
        <div id={id} className=" container space-y-10 md:space-y-20 -scroll-mt-10 text-black dark:text-white ">
            <div>
                <h2 className="text-46 md:text-60 leading-11 md:leading-14 font-bold py-4 md:py-8  z-10">{primary.titolo_portfolio}</h2>
                <p >{primary.copy_portfolio}</p>
            </div>
            <div className="flex flex-col md:flex-row items-start md:h-[75vh]">
                {/* Colonna sinistra (Listato progetti) */}
                <div className="w-full md:w-1/2 py-4 flex flex-col h-full">
                    <div className="flex-grow w-full flex items-start md:items-center justify-start md:justify-center">
                        <ul ref={projectListRef} className="space-y-4 w-full md:w-auto">
                            {primary.progetti.map((progetto, index) => (
                                <li key={index} className="cursor-pointer w-full flex flex-col items-start">
                                    <h3
                                        onClick={() => handleProjectClick(progetto, index)}
                                        className={`text-32 font-semibold w-full text-left md:text-center px-2 ${selectedIndex === index ? 'border-l-4 md:border-none pl-2' : ''} ${expandedProjectIndex === index ? 'bg-gray-100 dark:bg-dark-gray p-2' : ''}`}
                                        style={{ backgroundColor: selectedIndex === index && !isMobileView ? `#${selectedProject?.bg_color}` : 'transparent' }}
                                    >
                                        {progetto.nome}
                                    </h3>
                                    <AnimatePresence>
                                        {isMobileView && expandedProjectIndex === index && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                                className="mt-2 space-y-2 w-full"
                                            >
                                                <div className="w-full border p-4 bg-white dark:bg-dark-secondary">
                                                    <div className="relative w-full h-40 aspect-[9/16] mb-4 overflow-hidden">
                                                        <Image
                                                            src={progetto.screen_desktop?.url}
                                                            alt={progetto.nome}
                                                            layout="fill"
                                                            objectFit="contain"
                                                        />
                                                    </div>



                                                    {progetto.made_with && (
                                                        <div className="mt-4 text-center">
                                                            <div className='text-black'>Made with:</div>
                                                            <Image
                                                                src={`/logos/${progetto.made_with}Logo.png`}
                                                                alt={`Logo ${progetto.made_with}`}
                                                                width={150}
                                                                height={50}
                                                                className="w-auto h-14 md:h-20 mx-auto"
                                                                onError={(e) => {
                                                                    console.error("Errore nel caricamento dell'immagine:", e.target.src);
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className='space-y-4 text-22 flex flex-col items-center mt-8 md:mt-0'>
                        <div>{primary.copy_vedere_altro}</div>
                        <BasicButton testo={primary?.testo_tasto_altro} link={primary?.link_altro.url} scaleHover />
                    </div>
                </div>

                {/* Colonna destra (Anteprima portfolio) - Solo cambio immagine */}
                {!isMobileView && (
                    <div className={`w-full md:w-1/2 p-4 border h-1/2 md:h-full py-10 px-20 flex flex-col items-center justify-center lg:space-y-10`} style={{ backgroundColor: `#${selectedProject?.bg_color}` }}>
                        <button onClick={toggleImageView} className="px-4 py-2 bg-white dark:bg-[var(--dark-gray)] hover:bg-black hover:text-white hover:dark:bg-white hover:dark:text-[var(--dark-gray)] border">
                            {buttonText}
                        </button>
                        <div
                            className={` w-full ${isDesktopView ? 'aspect-video' : `aspect-[9/16]`}`}
                            style={{
                                height: `70vh`,
                                backgroundImage: `url(${currentImageUrl})`,
                                backgroundSize: 'contain',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center',
                            }}
                        ></div>
                        {logoSrc && (
                            <div className="text-center space-y-2">
                                <div>Made with:</div>
                                <Image
                                    src={logoSrc}
                                    alt={`Logo ${selectedProject?.made_with}`}
                                    width={150}
                                    height={50}
                                    className="w-auto md:h-16 lg:h-20 mx-auto"
                                    onError={(e) => {
                                        console.error("Errore nel caricamento dell'immagine:", e.target.src);
                                        setLogoSrc('');
                                    }}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}