import Link from "next/link";
import { notFound } from "next/navigation";
import { asLink } from "@prismicio/client";
import BasicButton from "../components/BasicButton";
import seoPages from "../seo-pages.json";
import { siteUrl } from "../seoConfig";
import { createClient } from "@/prismicio";

const slug = "consulenza-seo-torino";
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
  const serviceBlocksSlice = slices.find((slice) => slice.slice_type === "seo_service_blocks");
  const listSectionsSlice = slices.find((slice) => slice.slice_type === "seo_list_sections");
  const actionLinksSlice = slices.find((slice) => slice.slice_type === "seo_action_links");
  const faqSlice = slices.find((slice) => slice.slice_type === "seo_faq");
  const finalCtaSlice = slices.find((slice) => slice.slice_type === "seo_final_cta");
  const relatedServicesSlice = slices.find((slice) => slice.slice_type === "seo_related_services");

  const listSections = listSectionsSlice?.primary?.sections || [];
  const byKey = (key) => listSections.find((section) => section?.section_key === key);

  const mapListSection = (key) => {
    const section = byKey(key);
    if (!section?.title) return null;

    const mapped = {
      title: section.title,
      body: section.body,
      items: listFromRichText(section.items),
      secondary_title: section.secondary_title,
      secondary_items: listFromRichText(section.secondary_items),
      ordered: !!section.ordered,
      note: section.note
    };

    return mapped;
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
    service_blocks:
      serviceBlocksSlice?.primary?.blocks
        ?.map((block) => ({
          title: block?.title,
          body: block?.body,
          list_title: block?.list_title,
          items: listFromRichText(block?.items),
          tools_title: block?.tools_title,
          tools: block?.tools
            ? block.tools.split(",").map((item) => item.trim()).filter(Boolean)
            : undefined,
          deliverable: block?.deliverable,
          note: block?.note
        }))
        .filter((block) => block?.title || block?.body || block?.items?.length > 0) || [],
    method: mapListSection("method"),
    technical_skills: mapListSection("technical_skills"),
    tools: mapListSection("tools"),
    synergy: mapListSection("synergy"),
    experience: mapListSection("experience"),
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
    results: {
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
    service_blocks: pickValue(prismicData.service_blocks, fallback.service_blocks),
    method: {
      ...fallback.method,
      ...prismicData.method,
      title: pickValue(prismicData?.method?.title, fallback?.method?.title),
      steps: pickValue(prismicData?.method?.items, fallback?.method?.steps)
    },
    technical_skills: {
      ...fallback.technical_skills,
      ...prismicData.technical_skills,
      title: pickValue(prismicData?.technical_skills?.title, fallback?.technical_skills?.title),
      body: pickValue(prismicData?.technical_skills?.body, fallback?.technical_skills?.body),
      items: pickValue(prismicData?.technical_skills?.items, fallback?.technical_skills?.items),
      certifications: pickValue(
        prismicData?.technical_skills?.secondary_items,
        fallback?.technical_skills?.certifications
      )
    },
    tools: {
      ...fallback.tools,
      ...prismicData.tools,
      title: pickValue(prismicData?.tools?.title, fallback?.tools?.title),
      items: pickValue(prismicData?.tools?.items, fallback?.tools?.items)
    },
    synergy: {
      ...fallback.synergy,
      ...prismicData.synergy,
      title: pickValue(prismicData?.synergy?.title, fallback?.synergy?.title),
      body: pickValue(prismicData?.synergy?.body, fallback?.synergy?.body),
      items: pickValue(prismicData?.synergy?.items, fallback?.synergy?.items)
    },
    experience: {
      ...fallback.experience,
      ...prismicData.experience,
      title: pickValue(prismicData?.experience?.title, fallback?.experience?.title),
      body: pickValue(prismicData?.experience?.body, fallback?.experience?.body),
      items: pickValue(prismicData?.experience?.items, fallback?.experience?.items)
    },
    faq: {
      ...fallback.faq,
      ...prismicData.faq,
      title: pickValue(prismicData?.faq?.title, fallback?.faq?.title),
      items: pickValue(prismicData?.faq?.items, fallback?.faq?.items)
    },
    results: {
      ...fallback.results,
      ...prismicData.results,
      title: pickValue(prismicData?.results?.title, fallback?.results?.title),
      body: pickValue(prismicData?.results?.body, fallback?.results?.body),
      links: pickValue(prismicData?.results?.links, fallback?.results?.links)
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

export default async function ConsulenzaSeoTorinoPage() {
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

      {data?.service_blocks?.length > 0 && (
        <section className="space-y-8 md:space-y-12">
          <h2 className="text-32 md:text-46 font-bold">Servizi SEO Offerti</h2>
          <div className="space-y-10 md:space-y-12">
            {data.service_blocks.map((block, index) => (
              <article key={`${block?.title || "block"}-${index}`} className="space-y-4">
                <h3 className="text-26 md:text-36 font-bold">{block?.title}</h3>
                {block?.body && <p>{block.body}</p>}

                {block?.list_title && (
                  <h4 className="text-20 md:text-26 font-semibold pt-2">{block.list_title}</h4>
                )}
                {block?.items?.length > 0 && (
                  <ul className="space-y-2">
                    {block.items.map((item, i) => (
                      <li key={`${item}-${i}`}>- {item}</li>
                    ))}
                  </ul>
                )}

                {block?.tools_title && (
                  <h4 className="text-20 md:text-26 font-semibold pt-2">{block.tools_title}</h4>
                )}
                {block?.tools?.length > 0 && (
                  <p>{block.tools.join(", ")}</p>
                )}

                {block?.deliverable && <p className="italic">{block.deliverable}</p>}
                {block?.note && <p className="italic">{block.note}</p>}
              </article>
            ))}
          </div>
        </section>
      )}

      {(data?.method?.steps?.length > 0 || data?.method?.items?.length > 0) && (
        <section className="space-y-4">
          <h2 className="text-32 md:text-46 font-bold">{data.method.title}</h2>
          <ol className="space-y-2">
            {(data.method.steps || data.method.items || []).map((step, index) => (
              <li key={`${step}-${index}`}>
                {index + 1}. {step}
              </li>
            ))}
          </ol>
        </section>
      )}

      {data?.technical_skills?.items?.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-32 md:text-46 font-bold">{data.technical_skills.title}</h2>
          {data.technical_skills.body && <p>{data.technical_skills.body}</p>}
          <ul className="space-y-2">
            {data.technical_skills.items.map((item, index) => (
              <li key={`${item}-${index}`}>- {item}</li>
            ))}
          </ul>
          {data.technical_skills?.certifications?.length > 0 && (
            <>
              <h3 className="text-20 md:text-26 font-semibold pt-2">Certificazioni</h3>
              <ul className="space-y-2">
                {data.technical_skills.certifications.map((item, index) => (
                  <li key={`${item}-${index}`}>- {item}</li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}

      {data?.tools?.items?.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-32 md:text-46 font-bold">{data.tools.title}</h2>
          <ul className="space-y-2">
            {data.tools.items.map((item, index) => (
              <li key={`${item}-${index}`}>- {item}</li>
            ))}
          </ul>
        </section>
      )}

      {data?.synergy?.items?.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-32 md:text-46 font-bold">{data.synergy.title}</h2>
          {data.synergy.body && <p>{data.synergy.body}</p>}
          <ul className="space-y-2">
            {data.synergy.items.map((item, index) => (
              <li key={`${item}-${index}`}>- {item}</li>
            ))}
          </ul>
        </section>
      )}

      {data?.experience?.items?.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-32 md:text-46 font-bold">{data.experience.title}</h2>
          {data.experience.body && <p>{data.experience.body}</p>}
          <ul className="space-y-2">
            {data.experience.items.map((item, index) => (
              <li key={`${item}-${index}`}>- {item}</li>
            ))}
          </ul>
        </section>
      )}

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

      {(data?.results?.title || data?.results?.body || data?.results?.links?.length > 0) && (
        <section className="space-y-4">
          <h2 className="text-32 md:text-46 font-bold">{data.results.title}</h2>
          {data.results.body && <p>{data.results.body}</p>}
          {data.results?.links?.length > 0 && (
            <div className="flex flex-wrap gap-4 pt-2">
              {data.results.links.map((item, index) => (
                <BasicButton
                  key={`${item?.text || "result-link"}-${index}`}
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
          <h2 className="text-32 md:text-46 font-bold">Servizi Complementari</h2>
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
