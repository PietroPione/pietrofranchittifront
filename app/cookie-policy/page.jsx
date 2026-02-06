// app/cookie-policy/page.jsx

import { createClient } from "@/prismicio";
import { notFound } from "next/navigation";
import { PrismicRichText } from "@prismicio/react";
import {
    defaultDescription,
    defaultKeywords,
    defaultTitle,
    siteUrl,
} from "../seoConfig";

async function getCookiePolicyPage() {
    const client = createClient();
    try {
        return await client.getSingle("cookie_policy");
    } catch (error) {
        console.error("Errore nel recupero della cookie policy:", error);
        return notFound();
    }
}

export default async function CookiePolicyPage() {
    const cookiePolicyData = await getCookiePolicyPage();
    const slice = cookiePolicyData?.data?.slices?.[0];
    const titoloPagina = slice?.primary?.titolo || "";
    const paragrafi = slice?.primary?.paragrafi || [];

    // Converte il titolo (string) in un array di RichTextBlock
    const titleBlocks = titoloPagina
        ? [
            {
                type: "heading1",
                text: titoloPagina,
                spans: [],
            },
        ]
        : [];

    return (
        <div className="container text-black dark:text-white py-20">
            {/* Titolo pagina */}
            {titleBlocks.length > 0 && (
                <div className="text-26 md:text-32 font-bold mb-6">
                    <PrismicRichText field={titleBlocks} />
                </div>
            )}

            {/* Paragrafi */}
            {paragrafi.map((p, i) => {
                // Trasforma il titolo_paragrafo in blocco RichText
                const subtitleBlocks = p.titolo_paragrafo
                    ? [
                        {
                            type: "heading2",
                            text: p.titolo_paragrafo,
                            spans: [],
                        },
                    ]
                    : [];

                // p.testo_paragrafo è già un array di blocchi RichText da Prismic
                const textBlocks = p.testo_paragrafo || [];

                return (
                    <div key={i} className="mb-8">
                        {subtitleBlocks.length > 0 && (
                            <h2 className="text-22 md:text-26 font-semibold mb-2">
                                <PrismicRichText field={subtitleBlocks} />
                            </h2>
                        )}
                        {textBlocks.length > 0 && (
                            <div className="leading-relaxed">
                                <PrismicRichText field={textBlocks} />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export async function generateMetadata() {
    const cookiePolicyData = await getCookiePolicyPage();
    const metaTitle =
        cookiePolicyData?.data?.meta_title ||
        `${defaultTitle} | Cookie policy e privacy`;
    const metaDescription =
        cookiePolicyData?.data?.meta_description ||
        `${defaultDescription} Leggi come gestisco cookie e tracciamenti sul sito.`;

    return {
        title: metaTitle,
        description: metaDescription,
        keywords: [...defaultKeywords, "cookie policy", "privacy web"],
        alternates: { canonical: "/cookie-policy" },
        openGraph: {
            title: metaTitle,
            description: metaDescription,
            url: `${siteUrl}/cookie-policy`,
        },
        twitter: {
            card: "summary",
            title: metaTitle,
            description: metaDescription,
        },
    };
}
