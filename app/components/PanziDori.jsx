"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function PanziDori({ testoGatti, bioVera }) {
    const fotoGatti1 = bioVera?.primary?.foto_gatti_1?.url;
    const fotoGatti2 = bioVera?.primary?.foto_gatti_2?.url;
    const fotoGatti3 = bioVera?.primary?.foto_gatti_3?.url;
    const fotoGatti4 = bioVera?.primary?.foto_gatti_4?.url;

    const images = [
        { url: fotoGatti1, x: "10%", y: "20%" },
        { url: fotoGatti2, x: "60%", y: "40%" },
        { url: fotoGatti3, x: "20%", y: "50%" },
        { url: fotoGatti4, x: "80%", y: "10%" },
    ];

    return (
        <div className="bg-white h-screen relative overflow-hidden flex flex-col space-y-10 items-end justify-center">
            <div className="relative h-[75vh] w-full">
                {images.map((image, index) => (
                    image.url && (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1.0 }} // Animazione più lunga
                            style={{
                                position: "absolute",
                                left: image.x,
                                top: image.y,
                            }}
                        >
                            <Image
                                src={image.url}
                                alt={`Gatto ${index + 1}`}
                                width={200}
                                height={200}
                                className="object-contain"
                            />
                        </motion.div>
                    )
                ))}
            </div>

            <div className="text-22 font-bold pb-20 text-center whitespace-nowrap">
                {testoGatti}
            </div>
        </div>
    );
}