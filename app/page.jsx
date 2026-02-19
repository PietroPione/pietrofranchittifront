import { createClient } from "@/prismicio";
import "./globals.css";
import BrutalHero from "./components/heroHome/BrutalHero";
import WorkSchool from "./components/WorkSchool";
import PortfolioHome from "./components/PortfolioHome";
import ContattiHome from "./components/ContattiHome";
import WhoIsPio from "./components/WhoIsPio";
import Servizi from "./components/Servizi";
import {
  defaultDescription,
  defaultKeywords,
  defaultTitle,
  siteUrl,
} from "./seoConfig";

export default async function Page() {
  const client = createClient();
  const homepageResponse = await client.getSingle("homepage");
  const portfolioPagesResponse = await client.getAllByType("portfolio");

  const whoIsPioSlice = homepageResponse?.data?.slices?.find(
    (slice) => slice.slice_type === "who_is_pio"
  );

  const workSchool = homepageResponse?.data?.slices?.find(
    (slice) => slice.slice_type === "work_school"
  );

  const portfolioHome = homepageResponse?.data?.slices?.find(
    (slice) => slice.slice_type === "portfolio_home"
  );

  const contattiHome = homepageResponse?.data?.slices?.find(
    (slice) => slice.slice_type === "contatti_h"
  );
  const serviziSlice = homepageResponse?.data?.slices?.find(
    (slice) => slice.slice_type === "servizi"
  );
  return (
    <div className="relative space-y-20 md:space-y-40">
      <BrutalHero />
      {whoIsPioSlice && <WhoIsPio whoIsPioSlice={whoIsPioSlice} id="who" />}
      {serviziSlice && <Servizi serviziSlice={serviziSlice} id="servizi" />}
      {portfolioHome && (
        <PortfolioHome
          portfolioHome={portfolioHome}
          portfolioPages={portfolioPagesResponse.results}
          id="portfolio"
        />
      )}
      {workSchool && <WorkSchool workSchool={workSchool} id="cv" />}
      {contattiHome && <ContattiHome contattiHome={contattiHome} id="contatti" />}
    </div>
  );
}

export async function generateMetadata() {
  const client = createClient();
  const homepageResponse = await client.getSingle("homepage");

  const title = homepageResponse?.data?.meta_title || defaultTitle;
  const description = homepageResponse?.data?.meta_description || defaultDescription;

  const rawKeywords = homepageResponse?.data?.meta_keywords || "";
  const keywords = rawKeywords
    ? rawKeywords
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : defaultKeywords;

  const metaImage = homepageResponse?.data?.meta_image?.url;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: "/" },
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: "Pietro Franchitti",
      locale: "it_IT",
      type: "website",
      images: metaImage ? [metaImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: metaImage ? [metaImage] : undefined,
    },
  };
}
