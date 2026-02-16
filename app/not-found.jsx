import Link from "next/link";
import { asLink } from "@prismicio/client";
import { createClient } from "@/prismicio";

const fallbackLinks = [
  { testo: "Torna alla home", link: { url: "/" } },
  { testo: "Guarda il portfolio", link: { url: "/portfolio" } },
  { testo: "Vai ai contatti", link: { url: "/#contatti" } },
];

export default async function NotFound() {
  const client = createClient();

  let testi404Slice = null;

  try {
    const page404 = await client.getSingle("404");
    testi404Slice =
      page404?.data?.slices?.find((slice) => slice.slice_type === "testi404") ||
      null;
  } catch {
    testi404Slice = null;
  }

  const copyGrosso = testi404Slice?.primary?.copy_grosso;
  const dynamicLinks = testi404Slice?.primary?.link || [];
  const links = dynamicLinks.length > 0 ? dynamicLinks : fallbackLinks;

  return (
    <main className="relative overflow-hidden text-black dark:text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-40 dark:opacity-20 [background:linear-gradient(90deg,transparent_0,transparent_24px,#000_24px,#000_25px),linear-gradient(180deg,transparent_0,transparent_24px,#000_24px,#000_25px)] [background-size:25px_25px] dark:[background:linear-gradient(90deg,transparent_0,transparent_24px,#fff_24px,#fff_25px),linear-gradient(180deg,transparent_0,transparent_24px,#fff_24px,#fff_25px)]" />

      <section className="container min-h-[80vh] py-24 md:py-32 flex items-center">
        <div className="w-full border border-black dark:border-white bg-white/80 dark:bg-black/70 backdrop-blur-sm p-6 md:p-10 space-y-8">
          <div className="inline-block border border-black dark:border-white px-3 py-1 uppercase tracking-widest text-12">
            Errore di navigazione
          </div>

          <div className="flex flex-col gap-4 md:gap-6">
            <p className="text-75 md:text-95 leading-none font-black">404</p>
            <h1 className="text-36 md:text-60 leading-tight font-bold ">
              {copyGrosso ||
                "Sei arrivato alla fine del PIOVERSO, ma non preoccuparti, puoi sempre tornare a una sezione piu utile."}
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {links.map((item, index) => {
              const href = asLink(item?.link) || item?.link?.url || "/";
              const label = item?.testo || "Vai alla pagina";

              return (
                <Link
                  key={`${label}-${index}`}
                  href={href}
                  className="border border-black dark:border-white p-4 md:p-5 hover:-translate-y-1 transition-transform"
                >
                  <p className="text-12 uppercase tracking-widest">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="text-22 font-semibold mt-2">{label}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
