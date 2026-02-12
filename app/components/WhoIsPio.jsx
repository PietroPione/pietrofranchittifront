'use client';
import BasicButton from './BasicButton';
import Icon from './Icon';
import { motion } from 'framer-motion';

export default function WhoISpio({ whoIsPioSlice }) {
    return (
        <div className="container min-h-[33vh] py-10 md:py-20 scroll-mt-20" id="who">
            <div className="flex flex-col items-stretch">
                {/* Colonna di sinistra (Testi) */}
                <motion.div
                    className="md:max-w-[50vw] flex flex-col justify-center space-y-10 md:space-y-20"
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

                    {whoIsPioSlice.primary?.social?.length > 0 && (
                        <div className="flex flex-wrap gap-6 md:gap-10">
                            {whoIsPioSlice.primary.social.map((social, index) => (
                                <div key={`${social?.icon_name || 'social'}-${index}`} className="flex flex-col items-start gap-3">
                                    {social?.icon_name && (
                                        <div className="inline-flex items-center justify-center text-14 md:text-16 w-[5em] h-[5em]">
                                            <Icon
                                                name={social.icon_name}
                                                size="100%"
                                                className="text-black dark:text-white"
                                            />
                                        </div>
                                    )}
                                    {social?.testo_tasto && social?.link_tasto?.url && (
                                        <BasicButton
                                            testo={social.testo_tasto}
                                            link={social.link_tasto.url}
                                            externalLink
                                            scaleHover
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
