import Link from "next/link";
import { notFound } from "next/navigation";
import { asLink } from "@prismicio/client";
import BasicButton from "../components/BasicButton";
import seoPages from "../seo-pages.json";
import { siteUrl } from "../seoConfig";
import { createClient } from "@/prismicio";

const slug = "sviluppo-siti-web-torino";
const fallbackData = seoPages.pages.find((p) => p.slug === slug);

const hasValue = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return true;
};

const pickValue = (preferred, fallback) => (hasValue(preferred) ? preferred : fallback);

const listFromRichText = (field) => {
  if (!Array.isArray(field)) return [];
  return field
    .map((block) => {
      if (block?.type === "list-item" || block?.type === "paragraph") {
        return block?.text?.trim();
      }
      return "";
    })
    .filter(Boolean);
};

const mapPrismicToData = (doc) => {
  const slices = doc?.data?.slices || [];

  const heroSlice = slices.find((slice) => slice.slice_type === "seo_hero");
  const technologiesSlice = slices.find((slice) => slice.slice_type === "seo_technologies");
  const listSectionsSlice = slices.find((slice) => slice.slice_type === "seo_list_sections");
  const actionLinksSlice = slices.find(
    (slice) =>
      slice.slice_type === "seo_action_links" &&
      (!slice?.primary?.section_key || slice?.primary?.section_key === "portfolio")
  );
  const faqSlice = slices.find((slice) => slice.slice_type === "seo_faq");
  const finalCtaSlice = slices.find((slice) => slice.slice_type === "seo_final_cta");
  const relatedServicesSlice = slices.find((slice) => slice.slice_type === "seo_related_services");

  const listSections = listSectionsSlice?.primary?.sections || [];
  const byKey = (key) => listSections.find((section) => section?.section_key === key);

  const mapListSection = (key) => {
    const section = byKey(key);
    if (!section?.title) return null;

    return {
      title: section.title,
      body: section.body,
      items: listFromRichText(section.items),
      ordered: !!section.ordered,
      note: section.note
    };
  };

  const rawKeywords = doc?.data?.meta_keywords || "";
  const metaKeywords = rawKeywords
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    slug: doc.uid,
    breadcrumbs:
      doc?.data?.breadcrumbs
        ?.map((item) => ({
          label: item?.label,
          href: asLink(item?.href) || undefined
        }))
        .filter((item) => item?.label) || [],
    hero: {
      title: heroSlice?.primary?.title || "",
      subtitle: heroSlice?.primary?.subtitle || ""
    },
    technologies_section_title: technologiesSlice?.primary?.section_title,
    technologies:
      technologiesSlice?.primary?.technologies
        ?.map((tech) => ({
          title: tech?.title,
          body: tech?.body,
          services_title: tech?.services_title,
          services: listFromRichText(tech?.services),
          skills_title: tech?.skills_title,
          skills: listFromRichText(tech?.skills),
          note: tech?.note
        }))
        .filter((tech) => tech?.title || tech?.body) || [],
    process: mapListSection("process"),
    complementary_skills: mapListSection("complementary_skills"),
    certifications: mapListSection("certifications"),
    experience: mapListSection("experience"),
    portfolio: {
      title: actionLinksSlice?.primary?.title,
      body: actionLinksSlice?.primary?.body,
      links:
        actionLinksSlice?.primary?.links
          ?.map((item) => ({
            text: item?.text,
            href: asLink(item?.href) || undefined,
            external: !!item?.external
          }))
          .filter((item) => item?.text && item?.href) || []
    },
    faq: {
      title: faqSlice?.primary?.title,
      items:
        faqSlice?.primary?.items
          ?.map((item) => ({
            question: item?.question,
            answer: item?.answer
          }))
          .filter((item) => item?.question || item?.answer) || []
    },
    final_cta: {
      title: finalCtaSlice?.primary?.title,
      body: finalCtaSlice?.primary?.body,
      button: {
        text: finalCtaSlice?.primary?.button_text,
        href: asLink(finalCtaSlice?.primary?.button_link) || undefined
      }
    },
    contacts:
      finalCtaSlice?.primary?.contacts
        ?.map((contact) => ({
          label: contact?.label,
          value: contact?.value,
          href: asLink(contact?.href) || undefined,
          external: !!contact?.external
        }))
        .filter((contact) => contact?.label || contact?.value) || [],
    other_services:
      relatedServicesSlice?.primary?.links
        ?.map((item) => ({
          text: item?.text,
          href: asLink(item?.href) || "/"
        }))
        .filter((item) => item?.text) || [],
    meta: {
      title: doc?.data?.meta_title,
      description: doc?.data?.meta_description,
      keywords: metaKeywords
    }
  };
};

const mergePageData = (prismicData, fallback) => {
  if (!prismicData) return fallback;
  if (!fallback) return prismicData;

  return {
    ...fallback,
    ...prismicData,
    breadcrumbs: pickValue(prismicData.breadcrumbs, fallback.breadcrumbs),
    hero: {
      ...fallback.hero,
      ...prismicData.hero,
      title: pickValue(prismicData?.hero?.title, fallback?.hero?.title),
      subtitle: pickValue(prismicData?.hero?.subtitle, fallback?.hero?.subtitle)
    },
    technologies_section_title: pickValue(
      prismicData.technologies_section_title,
      fallback?.technologies_section_title
    ),
    technologies: pickValue(prismicData.technologies, fallback.technologies),
    process: {
      ...fallback.process,
      ...prismicData.process,
      title: pickValue(prismicData?.process?.title, fallback?.process?.title),
      steps: pickValue(prismicData?.process?.items, fallback?.process?.steps)
    },
    complementary_skills: {
      ...fallback.complementary_skills,
      ...prismicData.complementary_skills,
      title: pickValue(prismicData?.complementary_skills?.title, fallback?.complementary_skills?.title),
      body: pickValue(prismicData?.complementary_skills?.body, fallback?.complementary_skills?.body),
      items: pickValue(prismicData?.complementary_skills?.items, fallback?.complementary_skills?.items)
    },
    portfolio: {
      ...fallback.portfolio,
      ...prismicData.portfolio,
      title: pickValue(prismicData?.portfolio?.title, fallback?.portfolio?.title),
      body: pickValue(prismicData?.portfolio?.body, fallback?.portfolio?.body),
      links: pickValue(prismicData?.portfolio?.links, fallback?.portfolio?.links)
    },
    certifications: {
      ...fallback.certifications,
      ...prismicData.certifications,
      title: pickValue(prismicData?.certifications?.title, fallback?.certifications?.title),
      items: pickValue(prismicData?.certifications?.items, fallback?.certifications?.items)
    },
    experience: {
      ...fallback.experience,
      ...prismicData.experience,
      title: pickValue(prismicData?.experience?.title, fallback?.experience?.title),
      items: pickValue(prismicData?.experience?.items, fallback?.experience?.items)
    },
    faq: {
      ...fallback.faq,
      ...prismicData.faq,
      title: pickValue(prismicData?.faq?.title, fallback?.faq?.title),
      items: pickValue(prismicData?.faq?.items, fallback?.faq?.items)
    },
    final_cta: {
      ...fallback.final_cta,
      ...prismicData.final_cta,
      title: pickValue(prismicData?.final_cta?.title, fallback?.final_cta?.title),
      body: pickValue(prismicData?.final_cta?.body, fallback?.final_cta?.body),
      button: {
        ...fallback?.final_cta?.button,
        ...prismicData?.final_cta?.button,
        text: pickValue(prismicData?.final_cta?.button?.text, fallback?.final_cta?.button?.text),
        href: pickValue(prismicData?.final_cta?.button?.href, fallback?.final_cta?.button?.href)
      }
    },
    contacts: pickValue(prismicData.contacts, fallback.contacts),
    other_services: pickValue(prismicData.other_services, fallback.other_services),
    meta: {
      ...fallback.meta,
      ...prismicData.meta,
      title: pickValue(prismicData?.meta?.title, fallback?.meta?.title),
      description: pickValue(prismicData?.meta?.description, fallback?.meta?.description),
      keywords: pickValue(prismicData?.meta?.keywords, fallback?.meta?.keywords)
    }
  };
};

async function getPageData() {
  const client = createClient();

  try {
    const doc = await client.getByUID("seo_page", slug);
    if (doc) return mergePageData(mapPrismicToData(doc), fallbackData);
  } catch {
    // If Prismic document is not available yet, fallback to local JSON.
  }

  return fallbackData;
}

export default async function SviluppoSitiWebTorinoPage() {
  const data = await getPageData();
  if (!data) return notFound();

  return (
    <div className="container text-black dark:text-white py-10 md:py-20 space-y-10 md:space-y-16">
      {data?.breadcrumbs?.length > 0 && (
        <nav className="text-12 uppercase tracking-widest opacity-80" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            {data.breadcrumbs.map((item, index) => (
              <li key={`${item?.label || "crumb"}-${index}`} className="flex items-center gap-2">
                {item?.href ? (
                  <Link href={item.href} className="underline underline-offset-2">
                    {item.label}
                  </Link>
                ) : (
                  <span aria-current="page">{item?.label}</span>
                )}
                {index < data.breadcrumbs.length - 1 && <span aria-hidden="true">&gt;</span>}
              </li>
            ))}
          </ol>
        </nav>
      )}

      <section className="space-y-4 md:space-y-6">
        <h1 className="text-46 md:text-60 leading-11 md:leading-14 font-bold">
          {data.hero?.title}
        </h1>
        <p className="text-16 md:text-20 max-w-[80ch]">{data.hero?.subtitle}</p>
      </section>

      {data?.technologies?.length > 0 && (
        <section className="space-y-8 md:space-y-12">
          <h2 className="text-32 md:text-46 font-bold">
            {data.technologies_section_title || "Tecnologie e Framework"}
          </h2>
          <div className="space-y-10 md:space-y-12">
            {data.technologies.map((tech, index) => (
              <article key={`${tech?.title || "tech"}-${index}`} className="space-y-4">
                <h3 className="text-26 md:text-36 font-bold">{tech?.title}</h3>
                {tech?.body && <p>{tech.body}</p>}

                {tech?.services_title && (
                  <h4 className="text-20 md:text-26 font-semibold pt-2">{tech.services_title}</h4>
                )}
                {tech?.services?.length > 0 && (
                  <ul className="space-y-2">
                    {tech.services.map((item, i) => (
                      <li key={`${item}-${i}`}>- {item}</li>
                    ))}
                  </ul>
                )}

                {tech?.skills_title && (
                  <h4 className="text-20 md:text-26 font-semibold pt-2">{tech.skills_title}</h4>
                )}
                {tech?.skills?.length > 0 && (
                  <ul className="space-y-2">
                    {tech.skills.map((item, i) => (
                      <li key={`${item}-${i}`}>- {item}</li>
                    ))}
                  </ul>
                )}

                {tech?.note && <p className="italic">{tech.note}</p>}
              </article>
            ))}
          </div>
        </section>
      )}

      {(data?.process?.steps?.length > 0 || data?.process?.items?.length > 0) && (
        <section className="space-y-4">
          <h2 className="text-32 md:text-46 font-bold">{data.process.title}</h2>
          <ol className="space-y-2">
            {(data.process.steps || data.process.items || []).map((step, index) => (
              <li key={`${step}-${index}`}>
                {index + 1}. {step}
              </li>
            ))}
          </ol>
        </section>
      )}

      {data?.complementary_skills?.items?.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-32 md:text-46 font-bold">{data.complementary_skills.title}</h2>
          {data.complementary_skills.body && <p>{data.complementary_skills.body}</p>}
          <ul className="space-y-2">
            {data.complementary_skills.items.map((item, index) => (
              <li key={`${item}-${index}`}>- {item}</li>
            ))}
          </ul>
        </section>
      )}

      {(data?.portfolio?.title || data?.portfolio?.body || data?.portfolio?.links?.length > 0) && (
        <section className="space-y-4">
          <h2 className="text-32 md:text-46 font-bold">{data.portfolio.title}</h2>
          {data.portfolio.body && <p>{data.portfolio.body}</p>}
          {data.portfolio?.links?.length > 0 && (
            <div className="flex flex-wrap gap-4 pt-2">
              {data.portfolio.links.map((item, index) => (
                <BasicButton
                  key={`${item?.text || "portfolio-link"}-${index}`}
                  testo={item?.text}
                  link={item?.href}
                  externalLink={item?.external}
                  scaleHover
                />
              ))}
            </div>
          )}
        </section>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {data?.certifications?.items?.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-32 md:text-46 font-bold">{data.certifications.title}</h2>
            <ul className="space-y-2">
              {data.certifications.items.map((item, index) => (
                <li key={`${item}-${index}`}>- {item}</li>
              ))}
            </ul>
          </section>
        )}

        {data?.experience?.items?.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-32 md:text-46 font-bold">{data.experience.title}</h2>
            <ul className="space-y-2">
              {data.experience.items.map((item, index) => (
                <li key={`${item}-${index}`}>- {item}</li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {data?.faq?.items?.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-32 md:text-46 font-bold">{data.faq.title}</h2>
          <div className="space-y-4">
            {data.faq.items.map((item, index) => (
              <article
                key={`${item?.question || "faq"}-${index}`}
                className="border border-black dark:border-white p-4 md:p-6 space-y-2"
              >
                <h3 className="text-20 font-semibold">{item?.question}</h3>
                <p>{item?.answer}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {(data?.final_cta || data?.contacts?.length > 0) && (
        <section className="space-y-6 border border-black dark:border-white p-6 md:p-10">
          {data?.final_cta?.title && (
            <h2 className="text-32 md:text-46 font-bold">{data.final_cta.title}</h2>
          )}
          {data?.final_cta?.body && <p>{data.final_cta.body}</p>}
          {data?.final_cta?.button?.text && data?.final_cta?.button?.href && (
            <BasicButton
              testo={data.final_cta.button.text}
              link={data.final_cta.button.href}
              scaleHover
            />
          )}

          {data?.contacts?.length > 0 && (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {data.contacts.map((contact, index) => (
                <li key={`${contact?.label || "contact"}-${index}`}>
                  <span className="font-semibold">{contact?.label}: </span>
                  {contact?.href ? (
                    <Link
                      href={contact.href}
                      target={contact.external ? "_blank" : undefined}
                      rel={contact.external ? "noopener noreferrer" : undefined}
                      className="underline"
                    >
                      {contact?.value}
                    </Link>
                  ) : (
                    <span>{contact?.value}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {data?.other_services?.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-32 md:text-46 font-bold">Altri Servizi</h2>
          <div className="flex flex-wrap gap-3">
            {data.other_services.map((item, index) => (
              <Link
                key={`${item?.text || "service"}-${index}`}
                href={item?.href || "/"}
                className="border border-black dark:border-white px-3 py-2 hover:-translate-y-1 transition-transform"
              >
                {item?.text}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export async function generateMetadata() {
  const data = await getPageData();
  if (!data) return {};

  return {
    title: data.meta?.title,
    description: data.meta?.description,
    keywords: data.meta?.keywords,
    alternates: { canonical: `/${data.slug}` },
    openGraph: {
      title: data.meta?.title,
      description: data.meta?.description,
      url: `${siteUrl}/${data.slug}`,
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: data.meta?.title,
      description: data.meta?.description
    }
  };
}
