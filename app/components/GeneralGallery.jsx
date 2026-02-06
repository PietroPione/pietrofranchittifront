'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { useState, useRef } from 'react'
import Image from 'next/image'

export default function GeneralGallery({ images }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [direction, setDirection] = useState('right')
    const containerRef = useRef(null)
    const swipeConfidenceThreshold = 40

    const variants = {
        enter: (direction) => ({
            x: direction === 'left' ? '-50%' : '50%',
            opacity: 0,
            zIndex: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
            zIndex: 1,
        },
        exit: (direction) => ({
            x: direction === 'left' ? '50%' : '-50%',
            opacity: 0,
            zIndex: 0,
        }),
    }

    const handleDragEnd = (_, info) => {
        const offset = info.offset.x
        const velocity = info.velocity.x

        if (Math.abs(offset) > swipeConfidenceThreshold || Math.abs(velocity) > 500) {
            if (offset < 0) {
                next()
            } else {
                prev()
            }
        }
    }

    const next = () => {
        setDirection('right')
        setCurrentIndex((prev) => (prev + 1) % images.length)
    }

    const prev = () => {
        setDirection('left')
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    const navigationDots = () => (
        images.length > 1 && (
            <div className="flex w-full gap-x-2 justify-center absolute bottom-2 left-0 z-50">
                {images.map((_, i) => (
                    <button
                        key={i}
                        className={`flex-none w-3 h-3 rounded-full border border-black ${currentIndex === i ? 'bg-white' : 'bg-white/50'
                            }`}
                        onClick={() => {
                            setDirection(i > currentIndex ? 'right' : 'left')
                            setCurrentIndex(i)
                        }}
                    >
                        <span className="sr-only">{i + 1}</span>
                    </button>
                ))}
            </div>
        )
    )

    return (
        <section ref={containerRef} className="relative overflow-hidden h-[50vh] w-auto aspect-[9/16] flex justify-center items-center">
            {images.length > 0 && (
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
                        drag="x"
                        dragConstraints={containerRef}
                        dragElastic={0.2}
                        onDragEnd={handleDragEnd}
                        className="absolute inset-0 touch-pan-y"
                        style={{ willChange: 'transform, opacity' }}
                    >
                        <Image
                            src={images[currentIndex]?.url}
                            alt={images[currentIndex]?.alt || ""}
                            fill
                            className="object-contain"
                            draggable={false}
                        />
                    </motion.div>
                </AnimatePresence>
            )}
            {navigationDots()}
            {images.length > 1 && (
                <>
                    <button
                        className="absolute p-2 left-0 top-1/2 -translate-y-1/2 z-50 border bg-white text-black text-26 md:text-20 cursor-pointer"
                        onClick={prev}
                    >
                        &lt;
                    </button>
                    <button
                        className="absolute p-2 right-0 top-1/2 -translate-y-1/2 z-50 border bg-white text-black text-26 md:text-20 cursor-pointer"
                        onClick={next}
                    >
                        &gt;
                    </button>
                </>
            )}
        </section>
    )
}