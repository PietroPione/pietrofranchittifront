'use client';
import Image from 'next/image';
import BasicButton from './BasicButton';
import { motion } from 'framer-motion';

export default function WhoISpio({ whoIsPioSlice }) {
    return (
        <div className="container min-h-[60vh] py-10 md:py-20 scroll-mt-20" id="who">
            <div className="flex flex-col md:flex-row gap-10 gap-x-20 items-stretch">
                {/* Colonna di sinistra (Testi) */}
                <motion.div
                    className="md:w-1/2 flex flex-col justify-center space-y-10"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    viewport={{ once: true }}
                >
                    <div className="space-y-4 dark:text-white">
                        {whoIsPioSlice.primary?.titolo && (
                            <h2 className="text-46 md:text-60 leading-11 md:leading-14 font-bold">
                                {whoIsPioSlice.primary?.titolo}
                            </h2>
                        )}
                        {whoIsPioSlice.primary?.testo && (
                            <div>{whoIsPioSlice.primary?.testo}</div>
                        )}
                    </div>

                    {whoIsPioSlice.primary?.testo_tasto && whoIsPioSlice.primary?.link_tasto && (
                        <div>
                            <BasicButton
                                testo={whoIsPioSlice.primary?.testo_tasto}
                                link={whoIsPioSlice.primary?.link_tasto.url}
                                scaleHover
                            />
                        </div>
                    )}
                </motion.div>

                {/* Colonna di destra (Immagine) */}
                <motion.div
                    className="relative w-full md:w-1/2 h-[25vh] md:h-[50vh] pt-40 md:pt-0 overflow-hidden border"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.1 }}
                    viewport={{ once: true }}
                >
                    {whoIsPioSlice.primary?.immagine?.url && (
                        <Image
                            src={whoIsPioSlice.primary?.immagine.url}
                            alt={whoIsPioSlice.primary?.immagine.alt || "Immagine Who is Pio"}
                            fill
                            style={{ objectFit: 'contain' }}
                        />
                    )}
                </motion.div>
            </div>
        </div>
    );
}
