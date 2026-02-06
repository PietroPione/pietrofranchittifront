import { createClient } from "@/prismicio";
import BasicButton from "@/app/components/BasicButton";
import PortfolioDesktopCard from "@/app/components/card/PortfolioDesktopCard";
import GeneralGallery from "@/app/components/GeneralGallery";
import {
    defaultKeywords,
    defaultTitle,
    siteUrl,
    defaultDescription,
} from "../../seoConfig";

export async function generateStaticParams() {
    const client = createClient();
    const response = await client.getAllByType("portfolio");

    return response
        .map((portfolio) => portfolio.uid)
        .filter(Boolean)
        .map((uid) => ({ slug: uid }));
}

export async function generateMetadata({ params }) {
    const { slug } = (await params) || {};
    if (!slug) {
        return {};
    }
    const client = createClient();
    const portfolio = await client.getByUID("portfolio", slug);
    const infoSlice = portfolio?.data?.slices?.find(slice => slice.slice_type === 'informazioni');
    const title =
        portfolio?.data?.meta_title ||
        infoSlice?.primary?.titolo ||
        `${defaultTitle} | Progetto`;
    const description =
        portfolio?.data?.meta_description ||
        infoSlice?.primary?.descrizione_progetto ||
        `${defaultDescription} Scopri il progetto ${slug} e il processo di sviluppo frontend.`;


    return {
        title,
        description,
        keywords: [...defaultKeywords, "case study", slug],
        alternates: { canonical: `/portfolio/${slug}` },
        openGraph: {
            title,
            description,
            url: `${siteUrl}/portfolio/${slug}`,
            images: portfolio?.data?.meta_image
                ? [portfolio?.data?.meta_image.url]
                : undefined,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}

export default async function PortfolioPage({ params }) {
    const { slug } = (await params) || {};
    if (!slug) {
        return <p>Documento non trovato</p>;
    }
    const client = createClient();

    const portfolio = await client.getByUID("portfolio", slug);

    if (!portfolio) {
        return <p>Documento non trovato</p>;
    }

    const mappedSlices = portfolio.data.slices.map((slice) => ({
        type: slice.slice_type,
        primary: slice.primary,
    }));

    const infoSlice = mappedSlices.find((slice) => slice.type === "informazioni")?.primary || null;
    const gallerySlice = mappedSlices.find((slice) => slice.type === "gallery")?.primary || null;

    const screenDesktop = gallerySlice?.screen_desktop || [];
    const screenMobile = gallerySlice?.screen_mobile || [];

    // Preparo l'array di immagini per GeneralGallery da screenMobile
    const mobileImagesForGallery = screenMobile.map(item => ({
        url: item.screen.url,
        alt: item.screen.alt || "",
    }));

    return (
        <div className="container">
            <div className="flex flex-wrap gap-x-6 gap-y-10 md:gap-y-6 pb-10">
                {/* 1. screen_desktop[0] */}
                <div className="w-full md:w-[calc(50%-1.5rem)]  overflow-hidden">
                    {screenDesktop[0] && <PortfolioDesktopCard index={0} screenDesktop={screenDesktop} />}
                </div>

                {/* 2. screen_desktop[1] */}
                <div className="w-full md:w-[calc(50%-1.5rem)]  overflow-hidden">
                    {screenDesktop[1] && <PortfolioDesktopCard index={1} screenDesktop={screenDesktop} />}
                </div>

                {/* 3. infoSlice */}
                <div className="w-full md:w-[calc(50%-1.5rem)]  space-y-4 md:space-y-10 flex flex-col justify-center">
                    <div className="space-y-4 md:space-y-10 flex flex-col">
                        <div className="space-y-4 md:space-y-10 grid grid-cols-[max-content] gap-y-2">
                            {infoSlice?.made_with && (
                                <div className="px-4 py-2 border text-black dark:text-white dark:border-white font-medium">{infoSlice?.made_with}</div>
                            )}
                            {infoSlice?.titolo && <h2 className="dark:text-white text-black text-36 md:text-46 lg:text-60 leading-14 font-semibold">{infoSlice.titolo}</h2>}
                        </div>
                        {infoSlice?.descrizione_progetto && <p className="dark:text-white">{infoSlice.descrizione_progetto}</p>}
                        {infoSlice?.testo_tasto ? (
                            <div className="mt-4">
                                <BasicButton
                                    testo={infoSlice?.testo_tasto}
                                    link={infoSlice?.link_progetto?.url}
                                    scaleHover
                                    externalLink
                                />
                            </div>
                        ) : (
                            infoSlice?.messaggio_non_visibile && <p className="dark:text-white">{infoSlice.messaggio_non_visibile}</p>
                        )}
                    </div>
                </div>

                {/* 4. Gallery screen_mobile */}
                <div className="w-full md:w-[calc(50%-1.5rem)] flex justify-center  overflow-hidden">
                    {screenMobile && <GeneralGallery images={mobileImagesForGallery} />}
                </div>

                {/* 5. screen_desktop[2] */}
                <div className="w-full md:w-[calc(50%-1.5rem)]  overflow-hidden">
                    {screenDesktop[2] && <PortfolioDesktopCard index={2} screenDesktop={screenDesktop} />}
                </div>

                {/* 6. screen_desktop[3] */}
                <div className="w-full md:w-[calc(50%-1.5rem)]  overflow-hidden">
                    {screenDesktop[3] && <PortfolioDesktopCard index={3} screenDesktop={screenDesktop} />}
                </div>
            </div>
        </div>
    );
}
