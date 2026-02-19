import Link from "next/link";
import { notFound } from "next/navigation";
import { asLink } from "@prismicio/client";
import BasicButton from "../components/BasicButton";
import seoPages from "../seo-pages.json";
import { siteUrl } from "../seoConfig";
import { createClient } from "@/prismicio";

const slug = "servizi-advertising-torino";
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

const parseSubsectionsFromRichText = (field) => {
  if (!Array.isArray(field)) return [];

  const sections = [];
  let current = null;

  for (const block of field) {
    const type = block?.type;
    const text = block?.text?.trim();
    if (!text) continue;

    if (type === "heading4") {
      current = { title: text, items: [] };
      sections.push(current);
      continue;
    }

    if (type === "list-item" || type === "paragraph") {
      if (!current) {
        current = { title: "Dettagli", items: [] };
        sections.push(current);
      }
      current.items.push(text);
    }
  }

  return sections.filter((section) => section.title || section.items.length > 0);
};

const mapPrismicToData = (doc) => {
  const slices = doc?.data?.slices || [];

  const heroSlice = slices.find((slice) => slice.slice_type === "seo_hero");
  const platformsSlice = slices.find((slice) => slice.slice_type === "seo_advertising_platforms");
  const serviceBlocksSlice = slices.find(
    (slice) => slice.slice_type === "seo_advertising_service_blocks"
  );
  const examplesSlice = slices.find(
    (slice) =>
      slice.slice_type === "seo_examples_grid" &&
      (!slice?.primary?.section_key || slice?.primary?.section_key === "integrated_strategy")
  );
  const listSectionsSlice = slices.find((slice) => slice.slice_type === "seo_list_sections");
  const kpiSlice = slices.find((slice) => slice.slice_type === "seo_kpi_groups");
  const budgetSlice = slices.find((slice) => slice.slice_type === "seo_budget_table");
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
      secondary_title: section.secondary_title,
      secondary_items: listFromRichText(section.secondary_items),
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
    platform_intro: {
      title: platformsSlice?.primary?.intro_title,
      body: platformsSlice?.primary?.intro_body
    },
    platforms:
      platformsSlice?.primary?.platforms
        ?.map((platform) => ({
          title: platform?.title,
          ideal_for: listFromRichText(platform?.ideal_for),
          advantages: platform?.advantages,
          minimum_budget: platform?.minimum_budget
        }))
        .filter((platform) => platform?.title || platform?.ideal_for?.length > 0) || [],
    service_blocks:
      serviceBlocksSlice?.primary?.blocks
        ?.map((block) => ({
          title: block?.title,
          body: block?.body,
          items: listFromRichText(block?.items),
          tools_title: block?.tools_title,
          tools: block?.tools
            ? block.tools.split(",").map((item) => item.trim()).filter(Boolean)
            : undefined,
          note: block?.note,
          subsections: parseSubsectionsFromRichText(block?.subsections_content)
        }))
        .filter((block) => block?.title || block?.body || block?.items?.length > 0) || [],
    integrated_strategy: {
      title: examplesSlice?.primary?.title,
      examples:
        examplesSlice?.primary?.examples
          ?.map((example) => ({
            title: example?.title,
            steps: listFromRichText(example?.steps)
          }))
          .filter((example) => example?.title || example?.steps?.length > 0) || []
    },
    method: mapListSection("method"),
    tracking: mapListSection("tracking"),
    experience: mapListSection("experience"),
    kpi: {
      title: kpiSlice?.primary?.title,
      groups:
        kpiSlice?.primary?.groups
          ?.map((group) => ({
            title: group?.title,
            items: listFromRichText(group?.items)
          }))
          .filter((group) => group?.title || group?.items?.length > 0) || []
    },
    budget: {
      title: budgetSlice?.primary?.title,
      platforms:
        budgetSlice?.primary?.platforms
          ?.map((row) => ({
            platform: row?.platform,
            test: row?.test,
            pmi: row?.pmi,
            structured: row?.structured
          }))
          .filter((row) => row?.platform) || [],
      multi_platform: budgetSlice?.primary?.multi_platform,
      fee: listFromRichText(budgetSlice?.primary?.fee)
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
    platform_intro: {
      ...fallback.platform_intro,
      ...prismicData.platform_intro,
      title: pickValue(prismicData?.platform_intro?.title, fallback?.platform_intro?.title),
      body: pickValue(prismicData?.platform_intro?.body, fallback?.platform_intro?.body)
    },
    platforms: pickValue(prismicData.platforms, fallback.platforms),
    service_blocks: pickValue(prismicData.service_blocks, fallback.service_blocks),
    integrated_strategy: {
      ...fallback.integrated_strategy,
      ...prismicData.integrated_strategy,
      title: pickValue(prismicData?.integrated_strategy?.title, fallback?.integrated_strategy?.title),
      examples: pickValue(prismicData?.integrated_strategy?.examples, fallback?.integrated_strategy?.examples)
    },
    method: {
      ...fallback.method,
      ...prismicData.method,
      title: pickValue(prismicData?.method?.title, fallback?.method?.title),
      steps: pickValue(prismicData?.method?.items, fallback?.method?.steps)
    },
    kpi: {
      ...fallback.kpi,
      ...prismicData.kpi,
      title: pickValue(prismicData?.kpi?.title, fallback?.kpi?.title),
      groups: pickValue(prismicData?.kpi?.groups, fallback?.kpi?.groups)
    },
    tracking: {
      ...fallback.tracking,
      ...prismicData.tracking,
      title: pickValue(prismicData?.tracking?.title, fallback?.tracking?.title),
      items: pickValue(prismicData?.tracking?.items, fallback?.tracking?.items)
    },
    budget: {
      ...fallback.budget,
      ...prismicData.budget,
      title: pickValue(prismicData?.budget?.title, fallback?.budget?.title),
      platforms: pickValue(prismicData?.budget?.platforms, fallback?.budget?.platforms),
      multi_platform: pickValue(prismicData?.budget?.multi_platform, fallback?.budget?.multi_platform),
      fee: pickValue(prismicData?.budget?.fee, fallback?.budget?.fee)
    },
    experience: {
      ...fallback.experience,
      ...prismicData.experience,
      title: pickValue(prismicData?.experience?.title, fallback?.experience?.title),
      body: pickValue(prismicData?.experience?.body, fallback?.experience?.body),
      items: pickValue(prismicData?.experience?.items, fallback?.experience?.items),
      certifications: pickValue(
        prismicData?.experience?.secondary_items,
        fallback?.experience?.certifications
      )
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

export default async function ServiziAdvertisingTorinoPage() {
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

      {(data?.platform_intro?.title || data?.platform_intro?.body) && (
        <section className="space-y-4">
          <h2 className="text-32 md:text-46 font-bold">{data.platform_intro.title}</h2>
          {data.platform_intro.body && <p>{data.platform_intro.body}</p>}
        </section>
      )}

      {data?.platforms?.length > 0 && (
        <section className="space-y-8 md:space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {data.platforms.map((platform, index) => (
              <article
                key={`${platform?.title || "platform"}-${index}`}
                className="border border-black dark:border-white p-4 md:p-6 space-y-3"
              >
                <h3 className="text-22 md:text-26 font-bold">{platform?.title}</h3>
                {platform?.ideal_for?.length > 0 && (
                  <>
                    <p className="font-semibold">Ideale per</p>
                    <ul className="space-y-1">
                      {platform.ideal_for.map((item, i) => (
                        <li key={`${item}-${i}`}>- {item}</li>
                      ))}
                    </ul>
                  </>
                )}
                {platform?.advantages && <p>{platform.advantages}</p>}
                {platform?.minimum_budget && <p className="italic">{platform.minimum_budget}</p>}
              </article>
            ))}
          </div>
        </section>
      )}

      {data?.service_blocks?.length > 0 && (
        <section className="space-y-8 md:space-y-12">
          <h2 className="text-32 md:text-46 font-bold">Servizi Advertising</h2>
          <div className="space-y-10 md:space-y-12">
            {data.service_blocks.map((block, index) => (
              <article key={`${block?.title || "block"}-${index}`} className="space-y-4">
                <h3 className="text-26 md:text-36 font-bold">{block?.title}</h3>
                {block?.body && <p>{block.body}</p>}

                {block?.items?.length > 0 && (
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                    {block.items.map((item, i) => (
                      <li key={`${item}-${i}`}>- {item}</li>
                    ))}
                  </ul>
                )}

                {block?.subsections?.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {block.subsections.map((sub, subIndex) => (
                      <div
                        key={`${sub?.title || "sub"}-${subIndex}`}
                        className="space-y-2 border border-black dark:border-white p-4 md:p-5"
                      >
                        <h4 className="text-20 md:text-26 font-semibold">{sub?.title}</h4>
                        {sub?.items?.length > 0 && (
                          <ul className="grid grid-cols-1 gap-2">
                            {sub.items.map((item, i) => (
                              <li key={`${item}-${i}`}>- {item}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {block?.tools_title && (
                  <h4 className="text-20 md:text-26 font-semibold pt-2">{block.tools_title}</h4>
                )}
                {block?.tools?.length > 0 && <p>{block.tools.join(", ")}</p>}

                {block?.note && <p className="italic">{block.note}</p>}
              </article>
            ))}
          </div>
        </section>
      )}

      {data?.integrated_strategy?.examples?.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-32 md:text-46 font-bold">{data.integrated_strategy.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.integrated_strategy.examples.map((example, index) => (
              <article key={`${example?.title || "example"}-${index}`} className="border border-black dark:border-white p-4 md:p-6 space-y-3">
                <h3 className="text-22 md:text-26 font-bold">{example?.title}</h3>
                {example?.steps?.length > 0 && (
                  <ol className="space-y-2">
                    {example.steps.map((step, i) => (
                      <li key={`${step}-${i}`}>{i + 1}. {step}</li>
                    ))}
                  </ol>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {(data?.method?.steps?.length > 0 || data?.method?.items?.length > 0) && (
        <section className="space-y-4">
          <h2 className="text-32 md:text-46 font-bold">{data.method.title}</h2>
          <ol className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
            {(data.method.steps || data.method.items || []).map((step, index) => (
              <li key={`${step}-${index}`}>{index + 1}. {step}</li>
            ))}
          </ol>
        </section>
      )}

      {data?.kpi?.groups?.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-32 md:text-46 font-bold">{data.kpi.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {data.kpi.groups.map((group, index) => (
              <article key={`${group?.title || "kpi"}-${index}`} className="border border-black dark:border-white p-4 md:p-6 space-y-2">
                <h3 className="text-20 md:text-22 font-semibold">{group?.title}</h3>
                <ul className="space-y-1">
                  {group?.items?.map((item, i) => (
                    <li key={`${item}-${i}`}>- {item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      )}

      {data?.tracking?.items?.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-32 md:text-46 font-bold">{data.tracking.title}</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
            {data.tracking.items.map((item, index) => (
              <li key={`${item}-${index}`}>- {item}</li>
            ))}
          </ul>
        </section>
      )}

      {(data?.budget?.title || data?.budget?.platforms?.length > 0 || data?.budget?.fee?.length > 0) && (
        <section className="space-y-4">
          <h2 className="text-32 md:text-46 font-bold">{data.budget.title}</h2>
          {data.budget?.platforms?.length > 0 && (
            <div className="overflow-x-auto border border-black dark:border-white">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-black dark:border-white">
                    <th className="p-3">Piattaforma</th>
                    <th className="p-3">Test (30gg)</th>
                    <th className="p-3">PMI</th>
                    <th className="p-3">Strutturate</th>
                  </tr>
                </thead>
                <tbody>
                  {data.budget.platforms.map((row, index) => (
                    <tr key={`${row?.platform || "row"}-${index}`} className="border-b border-black/20 dark:border-white/20">
                      <td className="p-3 font-semibold">{row?.platform}</td>
                      <td className="p-3">{row?.test}</td>
                      <td className="p-3">{row?.pmi}</td>
                      <td className="p-3">{row?.structured}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {data.budget.multi_platform && <p>{data.budget.multi_platform}</p>}
          {data.budget?.fee?.length > 0 && (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
              {data.budget.fee.map((item, index) => (
                <li key={`${item}-${index}`}>- {item}</li>
              ))}
            </ul>
          )}
        </section>
      )}

      {(data?.experience?.title || data?.experience?.items?.length > 0 || data?.experience?.certifications?.length > 0) && (
        <section className="space-y-4">
          <h2 className="text-32 md:text-46 font-bold">{data.experience.title}</h2>
          {data.experience.body && <p>{data.experience.body}</p>}
          {data.experience?.items?.length > 0 && (
            <ul className="space-y-2">
              {data.experience.items.map((item, index) => (
                <li key={`${item}-${index}`}>- {item}</li>
              ))}
            </ul>
          )}
          {data.experience?.certifications?.length > 0 && (
            <>
              <h3 className="text-20 md:text-26 font-semibold">Certificazioni</h3>
              <ul className="space-y-2">
                {data.experience.certifications.map((item, index) => (
                  <li key={`${item}-${index}`}>- {item}</li>
                ))}
              </ul>
            </>
          )}
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

      {(data?.final_cta || data?.contacts?.length > 0) && (
        <section className="space-y-6 border border-black dark:border-white p-6 md:p-10">
          {data?.final_cta?.title && <h2 className="text-32 md:text-46 font-bold">{data.final_cta.title}</h2>}
          {data?.final_cta?.body && <p>{data.final_cta.body}</p>}
          {data?.final_cta?.button?.text && data?.final_cta?.button?.href && (
            <BasicButton testo={data.final_cta.button.text} link={data.final_cta.button.href} scaleHover />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.other_services.map((item, index) => (
              <Link
                key={`${item?.text || "service"}-${index}`}
                href={item?.href || "/"}
                className="border border-black dark:border-white px-3 py-2 hover:-translate-y-1 transition-transform w-full"
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
