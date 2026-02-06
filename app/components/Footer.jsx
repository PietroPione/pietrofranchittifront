// components/Footer.jsx
import React from 'react';
import Link from 'next/link';

const Footer = ({ footerData }) => {
    if (!footerData) {
        return null;
    }

    return (
        <footer className="container py-8 text-black dark:text-white border-t">
            <div className="space-y-6">
                <div className='flex flex-col md:flex-row space-x-0 md:space-x-10 space-y-4 md:space-y-0'>
                    <div>
                        {footerData.primary?.mail && <span className="font-semibold ">{footerData.primary?.mail}: </span>}
                        {footerData.primary?.testo_mail &&
                            <Link href={footerData.primary?.link_mail.url} className="hover:underline">{footerData.primary?.testo_mail}</Link>}
                    </div>
                    <div>
                        {footerData.primary?.testo_iva && <span className="font-semibold ">{footerData.primary?.testo_iva}: </span>}
                        {footerData.primary?.partita_iva && <span>{footerData.primary?.partita_iva} </span>}

                    </div>
                    <div className='flex space-x-4'>
                        {footerData.primary?.testo_social && <div className='font-semibold'>{footerData.primary?.testo_social}</div>}
                        {footerData.primary?.social?.map((social, index) => (
                            <div key={index}>
                                {social.link_social?.url && (
                                    <Link href={social.link_social.url} className="hover:underline" target="_blank" rel="noopener noreferrer">
                                        {social.nome_social}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                {footerData.primary?.testo_dettagli_sviluppo && <p className="text-14">{footerData.primary?.testo_dettagli_sviluppo}</p>}
                <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 justify-between text-14'>

                    {footerData.primary?.disclaimer && <p className="italic">{footerData.primary?.disclaimer}</p>}
                    {footerData.primary?.testo_cookie && footerData.primary?.link_cookie?.url && (
                        <p>
                            <Link href={footerData.primary?.link_cookie.url} className="hover:underline">
                                {footerData.primary?.testo_cookie}{' '}
                            </Link>
                        </p>
                    )}
                </div>

                {footerData.primary?.copyright && <p className="text-12">{footerData.primary?.copyright}</p>}
            </div>
        </footer >
    );
};

export default Footer;