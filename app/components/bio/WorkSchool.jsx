"use client";

import React from "react";
import { motion } from "framer-motion";

export default function WortkSchool({ workSchool, id }) {
    const { primary } = workSchool;

    return (
        <div id={id} className="relative container -scroll-mt-20 text-black dark:text-white">
            <h2 className="text-46 md:text-60 leading-11 md:leading-14 font-bold py-4 md:py-8 lg:sticky md:top-0 z-10">{primary.title}</h2>
            <div className="flex flex-col md:flex-row gap-x-20">
                {/* Colonna Lavoro */}
                <div className="w-full md:w-1/3 p-4 md:sticky top-24 max-h-screen overflow-y-auto contain-paint space-y-4">
                    <h3 className="text-32 font-semibold ">{primary.work_title}</h3>
                    <p className=" italic">{primary.work_copy}</p>
                    {primary.works.map((work, index) => (
                        <div key={index}>
                            <p className="font-medium text-22 md:text-26">
                                {work.attuale ? (
                                    <motion.span
                                        animate={{ opacity: [1, 0, 1] }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 1.5,
                                            ease: "easeInOut",
                                        }}
                                    >
                                        {work.work_position}
                                    </motion.span>
                                ) : (
                                    work.work_position
                                )}
                            </p>
                            <p>{work.dove}</p>
                            <p>
                                {work.periodo} {work.attuale && <span>Attuale</span>}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Colonna Studi */}
                <div className="w-full md:w-1/3 p-4 md:sticky top-24 max-h-screen overflow-y-auto contain-paint space-y-4">
                    <h3 className="text-32 font-semibold ">{primary.study_title}</h3>
                    <p className=" italic">{primary.study_copy}</p>
                    {primary.studies.map((study, index) => (
                        <div key={index}>
                            <p className="font-medium text-22">{study.nome_corso}</p>
                            <p>{study.dove}</p>
                            <p>{study.periodo}</p>
                        </div>
                    ))}
                </div>

                {/* Colonna Certificazioni */}
                <div className="w-full md:w-1/3 p-4 md:sticky top-24 max-h-screen overflow-y-auto contain-paint space-y-4">
                    <h3 className="text-32 font-semibold ">{primary.titolo_certificazioni}</h3>
                    <p className=" italic">{primary.copy_certificazioni}</p>
                    {primary.certificazioni.map((certificazione, index) => (
                        <div key={index}>
                            <p className="font-medium text-22">{certificazione.nome_certificazione}</p>
                            <p>{certificazione.dove}</p>
                            <p>{certificazione.quando}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
