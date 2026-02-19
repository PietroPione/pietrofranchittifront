import { createClient } from "@/prismicio";
import seoPages from "./seo-pages.json";
import { siteUrl } from "./seoConfig";

const staticPaths = ["", "/chi_sono", "/portfolio", "/cookie-policy"];
const baseUrl = siteUrl.replace(/\/+$/, "");

const toIsoDate = (value) => {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString();
  }
  return date.toISOString();
};

export default async function sitemap() {
  const nowIso = toIsoDate();

  const staticEntries = staticPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: nowIso,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));

  const seoEntries = (seoPages?.pages || []).map((page) => ({
    url: `${baseUrl}/${page.slug}`,
    lastModified: nowIso,
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
        url: `${baseUrl}/portfolio/${item.uid}`,
        lastModified: toIsoDate(item?.last_publication_date),
        changeFrequency: "monthly",
        priority: 0.7,
      }));
  } catch {
    // Keep sitemap available even if Prismic is unavailable.
  }

  return [...staticEntries, ...seoEntries, ...portfolioEntries];
}
