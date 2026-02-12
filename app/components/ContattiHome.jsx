"use client";

import React from "react";

export default function ContattiHome({ contattiHome, id }) {
    const { primary } = contattiHome;

    return (
        <div className="min-h-[50vh]  relative overflow-hidden  text-black dark:text-white">
            <div id={id} className="relative z-10 -scroll-mt-20">
                <div className="container py-16 flex flex-col gap-y-10 lg:gap-y-20 h-full">
                    <div className="md:max-w-[50vw] space-y-4">
                        <h2 className="text-60 leading-14 font-bold mb-8">{primary.titolo_contatti}</h2>
                        <p className="text-16 mb-8">{primary.copy_contatti}</p>
                    </div>
                    <div className="max-w-[50vw] flex flex-col gap-y-10">
                        <div className="mb-6">
                            <h3 className="text-18 font-semibold mb-2">{primary.titolo_mail}</h3>
                            <p className="text-14">
                                <a href={`mailto:${primary.mail}`} target="_blank" className="hover:underline">
                                    {primary.mail}
                                </a>
                            </p>
                        </div>
                        <div className="mb-6">
                            <h3 className="text-18 font-semibold mb-2">{primary.titolo_luogo}</h3>
                            <p className="text-14">{primary.testo_luogo}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
