import { createClient } from "@/prismicio";
import seoPages from "./seo-pages.json";
import { siteUrl } from "./seoConfig";

const staticPaths = ["", "/chi_sono", "/portfolio", "/cookie-policy"];

export default async function sitemap() {
  const now = new Date();

  const staticEntries = staticPaths.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));

  const seoEntries = (seoPages?.pages || []).map((page) => ({
    url: `${siteUrl}/${page.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  let portfolioEntries = [];

  try {
    const client = createClient();
    const portfolios = await client.getAllByType("portfolio");

    portfolioEntries = portfolios
      .filter((item) => item?.uid)
      .map((item) => ({
        url: `${siteUrl}/portfolio/${item.uid}`,
        lastModified: item?.last_publication_date || now,
        changeFrequency: "monthly",
        priority: 0.7,
      }));
  } catch {
    // Keep sitemap available even if Prismic is unavailable.
  }

  return [...staticEntries, ...seoEntries, ...portfolioEntries];
}
