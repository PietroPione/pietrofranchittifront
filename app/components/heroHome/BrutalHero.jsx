import Image from "next/image";
import { PrismicRichText } from "@prismicio/react";
import { createClient } from "@/prismicio";
import BulletCycle from "./BulletCycle";

export default async function Page() {
    const client = createClient();
    const homepageResponse = await client.getSingle("homepage");

    const heroHomeSlice = homepageResponse?.data?.slices?.find(
        (slice) => slice.slice_type === "hero_home"
    );

    const titoloHero = heroHomeSlice?.primary?.titolo_hero;
    const immagineHero = heroHomeSlice?.primary?.immagine_hero;
    const testoLista = heroHomeSlice?.primary?.testo_lista;
    const elencoLista = heroHomeSlice?.primary?.elenco_lista || [];
    const bulletItems = elencoLista.map((item) => item?.bullet_point).filter(Boolean);

    return (
        <div className="text-black dark:text-white border-b border-black">
            <div className="max-w-[90wv] md:max-w-full" >

                {heroHomeSlice && (
                    <section className="flex flex-col md:flex-row items-stretch min-h-screen dark:border-white overflow-x-hidden">
                        <div className="w-full md:w-1/2 min-w-0 md:flex md:flex-col">
                            {immagineHero?.url && (
                                <Image
                                    src={immagineHero.url}
                                    alt={immagineHero.alt || "Immagine hero"}
                                    width={immagineHero?.dimensions?.width || 1600}
                                    height={immagineHero?.dimensions?.height || 1200}
                                    priority
                                    sizes="(min-width: 768px) 50vw, 100vw"
                                    className="w-full h-auto object-cover md:mt-auto"
                                />
                            )}
                        </div>
                    <div className="w-full md:w-1/2 min-w-0 flex flex-col justify-center px-6 md:px-12 py-10 md:py-16 space-y-10 md:space-y-20 min-h-[50vh] md:min-h-0">
                            {titoloHero && (
                                <div className="text-5xl md:text-60 leading-tight md:leading-14 font-bold max-w-[22ch] md:max-w-none break-words">
                                    <PrismicRichText field={titoloHero} />
                                </div>
                            )}
                            <div>

                                {testoLista && <p className="text-22 md:text-26 max-w-[34ch] md:max-w-none break-words">{testoLista}</p>}
                                <BulletCycle
                                    items={bulletItems}
                                    className="min-h-[2rem] md:min-h-[4rem]"
                                    itemClassName="text-3xl md:text-46 font-semibold leading-none"
                                />
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}

export async function generateMetadata() {
    const client = createClient();
    const homepageResponse = await client.getSingle("homepage");

    return {
        title: homepageResponse?.data?.meta_title,
        description: homepageResponse?.data?.meta_description,
        openGraph: {
            title: homepageResponse?.data?.meta_title || undefined,
            description: homepageResponse?.data?.meta_description || undefined,
            images: homepageResponse?.data?.meta_image
                ? [homepageResponse?.data?.meta_image.url]
                : undefined,
        },
    };
}
