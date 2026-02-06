const fs = require("fs");
const path = require("path");
const prismic = require("@prismicio/client");
const sm = require("../slicemachine.config.json");

const siteUrl =
  process.env.SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://www.pietrofranchitti.it";

const staticRoutes = [
  { path: "/", changefreq: "monthly", priority: "1.0" },
  { path: "/chi_sono", changefreq: "yearly", priority: "0.7" },
  { path: "/portfolio", changefreq: "monthly", priority: "0.9" },
  { path: "/cookie-policy", changefreq: "yearly", priority: "0.3" },
];

async function fetchPortfolioSlugs() {
  try {
    const client = prismic.createClient(
      process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || sm.repositoryName,
      {
        accessToken: process.env.PRISMIC_ACCESS_TOKEN,
      }
    );
    const docs = await client.getAllByType("portfolio", {
      fetch: [],
      pageSize: 100,
    });
    return docs.map((doc) => doc.uid).filter(Boolean);
  } catch (error) {
    console.warn("Impossibile recuperare gli slug del portfolio:", error?.message);
    return [];
  }
}

async function buildSitemap() {
  const lastmod = new Date().toISOString();
  const portfolioSlugs = await fetchPortfolioSlugs();

  const allRoutes = [
    ...staticRoutes,
    ...portfolioSlugs.map((slug) => ({
      path: `/portfolio/${slug}`,
      changefreq: "monthly",
      priority: "0.9",
    })),
  ];

  const xmlBody = allRoutes
    .map(
      (route) => `  <url>
    <loc>${siteUrl}${route.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
    )
    .join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlBody}
</urlset>
`;

  const sitemapPath = path.join(process.cwd(), "public", "sitemap.xml");
  fs.writeFileSync(sitemapPath, sitemap.trimEnd() + "\n", "utf8");

  const robotsTxt = `User-agent: *
Allow: /
Sitemap: ${siteUrl}/sitemap.xml
`;

  fs.writeFileSync(
    path.join(process.cwd(), "public", "robots.txt"),
    robotsTxt,
    "utf8"
  );

  console.log(`Sitemap generated at ${sitemapPath}`);
}

buildSitemap();
