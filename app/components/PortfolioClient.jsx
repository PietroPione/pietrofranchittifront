'use client';

import { useState } from 'react';
import Image from 'next/image';
import BasicButton from './BasicButton';
import Link from 'next/link';

export default function PortfolioClient({ title, description, pages }) {
    const [filtro, setFiltro] = useState('tutti');

    const pagesFiltrate = pages
        .filter((page) => {
            const informazioniSlice = page.data.slices.find(
                (slice) => slice.slice_type === 'informazioni'
            );
            const madeWith = informazioniSlice?.primary?.made_with;

            if (filtro === 'tutti') return true;
            return madeWith === filtro;
        })
        .sort((a, b) => (a.data?.order || 0) - (b.data?.order || 0)); // Ordina per 'order' crescente

    const filtriDisponibili = ['tutti', 'Wordpress', 'Elementor', 'React', 'Vue', 'Shopify'];

    return (
        <div className='container py-20 space-y-12 dark:text-white'>
            <div className='space-y-2'>
                <h1 className="text-60 font-bold">{title}</h1>
                <div>{description}</div>
            </div>

            {/* FILTRI */}
            <div className="flex flex-wrap gap-4">
                {filtriDisponibili.map((tipo) => (
                    <button
                        key={tipo}
                        onClick={() => setFiltro(tipo)}
                        className={`
                        px-4 py-2 border font-medium transition
                        button-shadow

                        ${filtro === tipo
                                ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:shadow-none'
                                : 'hover:scale-110 duration-200'}
                    `}
                    >
                        {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                    </button>
                ))}
            </div>

            {/* GRID PROGETTI */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {pagesFiltrate.map((page) => {
                    const informazioniSlice = page.data.slices.find(
                        (slice) => slice.slice_type === 'informazioni'
                    );
                    const gallerySlice = page.data.slices.find(
                        (slice) => slice.slice_type === 'gallery'
                    );

                    const titoloProgetto = informazioniSlice?.primary?.titolo;
                    const primaImmagine = gallerySlice?.primary?.screen_desktop?.[0]?.screen?.url;

                    return (
                        <div key={page.id} className="border shadow-md p-6 space-y-6">
                            <h2 className="text-36 leading-9 font-semibold">{titoloProgetto}</h2>

                            {primaImmagine && (
                                <Link href={`/portfolio/${page.uid}`} className="w-full h-auto object-cover block hover:scale-105 transition-transform duration-200">
                                    <Image
                                        src={primaImmagine}
                                        alt="Anteprima progetto"
                                        width={500}
                                        height={300}
                                        className="w-full h-auto object-cover"
                                    />
                                </Link>
                            )}

                            <BasicButton testo="Vediamolo!" link={`/portfolio/${page.uid}`} scaleHover />
                        </div>
                    );
                })}
            </div>

            {pagesFiltrate.length === 0 && (
                <p className="text-gray-500 text-center">Nessun progetto trovato per questo filtro.</p>
            )}
        </div>
    );
}