// app/components/CookieBanner.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-02NW88L9RB";
const STORAGE_KEY = "cookie_consent"; // "granted" | "denied"
const OPEN_EVENT = "openCookieBanner";

// Rimuove i cookie _ga* impostati da Google Analytics
const deleteGaCookies = () => {
    const domain = window.location.hostname.replace(/^www\./, "");
    document.cookie.split(";").forEach((c) => {
        const name = c.split("=")[0].trim();
        if (name.startsWith("_ga")) {
            document.cookie = `${name}=; Max-Age=0; path=/`;
            document.cookie = `${name}=; Max-Age=0; path=/; domain=.${domain}`;
        }
    });
};

const buttonClass =
    "relative inline-block text-14 tracking-widest uppercase text-black border-3 border-black dark:border-white dark:text-white py-2 px-4 md:px-6 cursor-pointer select-none hover:scale-110 transition-transform duration-200";

export default function CookieBanner() {
    const [consent, setConsent] = useState(null);
    const [open, setOpen] = useState(false);

    // All'avvio: leggi la scelta salvata, se manca mostra il banner
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        setConsent(stored);
        setOpen(!stored);

        const onOpen = () => setOpen(true);
        window.addEventListener(OPEN_EVENT, onOpen);
        return () => window.removeEventListener(OPEN_EVENT, onOpen);
    }, []);

    const choose = (value) => {
        localStorage.setItem(STORAGE_KEY, value);
        // Se gtag è già caricato (cambio di scelta nella stessa sessione) aggiorna il consenso
        if (window.gtag) {
            window.gtag("consent", "update", { analytics_storage: value });
        }
        if (value === "denied") {
            deleteGaCookies();
        }
        setConsent(value);
        setOpen(false);
    };

    return (
        <>
            {consent === "granted" && (
                <>
                    <Script
                        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                        strategy="afterInteractive"
                    />
                    <Script id="ga-init" strategy="afterInteractive">
                        {`
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            window.gtag = gtag;
                            gtag('consent', 'default', {
                                analytics_storage: 'granted',
                                ad_storage: 'denied',
                                ad_user_data: 'denied',
                                ad_personalization: 'denied'
                            });
                            gtag('js', new Date());
                            gtag('config', '${GA_ID}');
                        `}
                    </Script>
                </>
            )}

            {open && (
                <div
                    role="region"
                    aria-label="Preferenze cookie"
                    className="fixed bottom-4 left-4 right-4 md:left-auto md:max-w-md z-50 bg-white dark:bg-black text-black dark:text-white border-3 border-black dark:border-white p-6 space-y-4"
                >
                    <p className="text-14">
                        Uso Google Analytics per capire come viene visitato il sito. I cookie
                        di analisi vengono attivati solo se accetti.{" "}
                        <Link href="/cookie-policy" className="underline">
                            Cookie policy
                        </Link>
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <button type="button" onClick={() => choose("granted")} className={buttonClass}>
                            Accetta
                        </button>
                        <button type="button" onClick={() => choose("denied")} className={buttonClass}>
                            Rifiuta
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

// Link per riaprire il banner (es. nel footer)
export function CookiePreferencesButton({ children = "Gestisci cookie" }) {
    return (
        <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
            className="hover:underline cursor-pointer"
        >
            {children}
        </button>
    );
}
