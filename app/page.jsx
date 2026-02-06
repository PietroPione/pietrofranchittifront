import { createClient } from "@/prismicio";
import "./globals.css";
import StarWarsHero from "./components/heroHome/StarWarsHero";
import WorkSchool from "./components/bio/WorkSchool";
import PortfolioHome from "./components/bio/PortfolioHome";
import ContattiHome from "./components/ContattiHome";
import WhoIsPio from "./components/WhoIsPio";
import {
  defaultDescription,
  defaultKeywords,
  defaultTitle,
  siteUrl,
} from "./seoConfig";

export default async function Page() {
  const client = createClient();
  const homepageResponse = await client.getSingle("homepage");
  const biofalsaResponse = await client.getByType("biofalsa");
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


  return (
    <div className="relative space-y-20 md:space-y-40">
      <StarWarsHero />
      {whoIsPioSlice && <WhoIsPio whoIsPioSlice={whoIsPioSlice} id="who" />}
      {portfolioHome && <PortfolioHome portfolioHome={portfolioHome} portfolioPages={portfolioPagesResponse.results} id="portfolio" />}
      {workSchool && <WorkSchool workSchool={workSchool} id="cv" />}
      {contattiHome && <ContattiHome contattiHome={contattiHome} id="contatti" />}

    </div>
  );
}

export async function generateMetadata() {
  const client = createClient();
  const homepageResponse = await client.getSingle("homepage");

  const title = homepageResponse?.data?.meta_title || defaultTitle;
  const description =
    homepageResponse?.data?.meta_description || defaultDescription;

  return {
    title,
    description,
    keywords: defaultKeywords,
    alternates: { canonical: "/" },
    openGraph: {
      title,
      description,
      url: siteUrl,
      images: homepageResponse?.data?.meta_image
        ? [homepageResponse?.data?.meta_image.url]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
