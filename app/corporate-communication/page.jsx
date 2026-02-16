import BasicButton from "../components/BasicButton";
import seoPages from "../seo-pages.json";
import { siteUrl } from "../seoConfig";

const data = seoPages.pages.find((p) => p.slug === "corporate-communication");

export default function CorporateCommunicationPage() {
  if (!data) return null;

  return (
    <div className="container text-black dark:text-white py-10 md:py-20 space-y-10 md:space-y-16">
      <div>
        <h1 className="text-46 md:text-60 leading-11 md:leading-14 font-bold py-4 md:py-8 z-10">
          {data.hero.title}
        </h1>
        <p>{data.hero.subtitle}</p>
      </div>

      <div className="space-y-10 md:space-y-12">
        {data.sections.map((section, index) => (
          <div key={`${section.title}-${index}`} className="space-y-4">
            <h2 className="text-32 md:text-46 font-bold">{section.title}</h2>
            <p>{section.body}</p>
            {section.bullets && section.bullets.length > 0 && (
              <ul className="space-y-2">
                {section.bullets.map((bullet, i) => (
                  <li key={`${bullet}-${i}`}>- {bullet}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {data.cta?.text && data.cta?.href && (
        <div>
          <BasicButton testo={data.cta.text} link={data.cta.href} scaleHover />
        </div>
      )}
    </div>
  );
}

export async function generateMetadata() {
  if (!data) return {};

  return {
    title: data.meta.title,
    description: data.meta.description,
    keywords: data.meta.keywords,
    alternates: { canonical: `/${data.slug}` },
    openGraph: {
      title: data.meta.title,
      description: data.meta.description,
      url: `${siteUrl}/${data.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: data.meta.title,
      description: data.meta.description,
    },
  };
}
