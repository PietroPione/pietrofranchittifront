import Link from 'next/link';

export default function BasicButton({ testo, link, externalLink, scaleHover }) {
    const hoverEffectClass = scaleHover
        ? 'hover:scale-110 transition-transform duration-200'
        : 'hover:text-white hover:border-white hover:bg-black transition-colors duration-300';

    if (!link) {
        return (
            <span
                aria-disabled="true"
                className={`relative inline-block text-14 tracking-widest uppercase text-black border-3 border-black dark:border-white dark:text-white py-2 px-4 opacity-60 select-none md:px-6 ${hoverEffectClass}`}
            >
                {testo}
            </span>
        );
    }

    return (
        <Link
            href={link}
            target={externalLink ? '_blank' : undefined}
            rel={externalLink ? 'noopener noreferrer' : undefined}
            className={`relative inline-block  text-14 tracking-widest uppercase text-black cursor-pointer border-3 border-black dark:border-white dark:text-white py-2 px-4 button-shadow active:shadow-[0px_0px_0px_0px] active:top-[5px] active:left-[5px] select-none touch-action-manipulation md:px-6 ${hoverEffectClass}`}
        >
            {testo}
        </Link>
    );
}
