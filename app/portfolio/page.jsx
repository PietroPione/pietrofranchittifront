// app/portfolio/page.jsx

import { createClient } from '@/prismicio';
import { notFound } from 'next/navigation';
import PortfolioClient from '../components/PortfolioClient';
import {
    defaultDescription,
    defaultKeywords,
    defaultTitle,
    siteUrl,
} from '../seoConfig';

async function getPortfolioPages() {
    const client = createClient();
    const pages = await client.getAllByType('portfolio');
    return pages;
}

async function getPortfolioPageData() {
    const client = createClient();
    try {
        const page = await client.getSingle("portfoliopage");
        return page;
    } catch (error) {
        console.error("Errore nel recupero di 'portfoliopage':", error);
        return notFound();
    }
}

export default async function PortfolioPage() {
    const portfolioPages = await getPortfolioPages();
    const portfolioPageData = await getPortfolioPageData();

    const portfolioInfoSlice = portfolioPageData?.data?.slices?.find(
        (slice) => slice.slice_type === 'portfolio_info'
    );
    const pageTitle = portfolioInfoSlice?.primary?.titolo;
    const copyPortfolio = portfolioInfoSlice?.primary?.copy;

    return (
        <PortfolioClient
            title={pageTitle}
            description={copyPortfolio}
            pages={portfolioPages}
        />
    );
}

export async function generateMetadata() {
    const client = createClient();
    const portfolioResponse = await client.getSingle("portfoliopage");
    const title =
        portfolioResponse?.data?.meta_title ||
        `${defaultTitle} | Portfolio e case study`;
    const description =
        portfolioResponse?.data?.meta_description ||
        `${defaultDescription} Dai un'occhiata ai progetti frontend sviluppati per brand e startup a Torino.`;
    return {
        title,
        description,
        keywords: [...defaultKeywords, "portfolio", "case study frontend"],
        alternates: { canonical: "/portfolio" },
        openGraph: {
            title,
            description,
            url: `${siteUrl}/portfolio`,
            images: portfolioResponse?.data?.meta_image
                ? [portfolioResponse?.data?.meta_image.url]
                : undefined,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}
