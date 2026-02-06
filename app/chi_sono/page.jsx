import { createClient } from "@/prismicio";
import SezioneBio from "../components/bio/SezioneBio";
import {
    defaultDescription,
    defaultKeywords,
    defaultTitle,
    siteUrl,
} from "../seoConfig";


export default async function BioPage() {
    const client = createClient();
    const biofalsaResponse = await client.getByType("biofalsa");


    const bioSlice = biofalsaResponse?.results[0]?.data?.slices?.find(
        (slice) => slice.slice_type === "bio_falsa"
    );

    const barraHonest = biofalsaResponse?.results[0]?.data?.slices?.find(
        (slice) => slice.slice_type === "barra_honest"
    );

    const bioVera = biofalsaResponse?.results[0]?.data?.slices?.find(
        (slice) => slice.slice_type === "bio_vera"
    );

    const cosePiacciono = biofalsaResponse?.results[0]?.data?.slices?.find(
        (slice) => slice.slice_type === "cose_piacciono"
    );

    const coseNonPiacciono = biofalsaResponse?.results[0]?.data?.slices?.find(
        (slice) => slice.slice_type === "cose_non_piacciono"
    );
    return (
        <div className="relative py-20">
            <SezioneBio
                bioSlice={bioSlice}
                bio={bioSlice?.primary?.bio}
                fotofalsabuona={bioSlice?.primary?.fotofalsabuona}
                fotofalsacattiva={bioSlice?.primary?.fotofalsacattiva}
                keep_scrolling={bioSlice?.primary?.keep_scrolling}
                testoHonest={barraHonest?.primary?.testohonest}
                bioVeraText={bioVera?.primary?.bio}
                fotoBioVera={bioVera?.primary?.foto_buona}
                cosePiacciono={cosePiacciono}
                coseNonPiacciono={coseNonPiacciono}

            />
        </div>
    );
}

export async function generateMetadata() {
    const client = createClient();
    const biometadati = await client.getByType("biometadati");
    const metaData = biometadati?.results[0]?.data;
    const title =
        metaData?.meta_title ||
        `${defaultTitle} | Chi sono e percorso`;
    const description =
        metaData?.meta_description ||
        `${defaultDescription} Scopri chi sono, il mio percorso e come lavoro con i brand di Torino.`;

    return {
        title,
        description,
        keywords: [...defaultKeywords, "biografia", "esperienza lavorativa"],
        alternates: { canonical: "/chi_sono" },
        openGraph: {
            title,
            description,
            url: `${siteUrl}/chi_sono`,
            images: metaData?.meta_image
                ? [metaData?.meta_image.url]
                : undefined,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}
