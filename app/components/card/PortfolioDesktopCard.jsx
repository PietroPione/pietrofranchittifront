import Image from "next/image";

export default function PortfolioDesktopCard({ index, screenDesktop }) {
    const image = screenDesktop[index]?.screen;
    const text = screenDesktop[index]?.spiega;

    return (
        <div className="w-full">
            {image?.url && (
                <div className="relative w-full aspect-[16/9]">
                    <Image
                        src={image.url}
                        alt={image.alt || ""}
                        fill
                        className="object-cover"
                    />
                </div>
            )}
            {text && <div className="mt-2 dark:text-white">{text}</div>}
        </div>
    );
}
