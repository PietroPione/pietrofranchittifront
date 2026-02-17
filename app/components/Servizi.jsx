"use client";

import BasicButton from "./BasicButton";

export default function Servizi({ serviziSlice, id }) {
  const servizi = serviziSlice?.primary?.servizi || [];

  if (servizi.length === 0) return null;

  return (
    <div
      id={id}
      className="container text-black dark:text-white min-h-[66vh] flex flex-col justify-center"
    >
      {serviziSlice?.primary?.titolo && (
        <div className="pb-6 md:pb-10">
          <h2 className="text-46 md:text-60 leading-11 md:leading-14 font-bold py-4 md:py-8 z-10">
            {serviziSlice.primary.titolo}
          </h2>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {servizi.map((servizio, index) => {
          const link = servizio?.ancora?.[0]?.url;
          return (
            <div
              key={`${servizio?.nome_servizio || "servizio"}-${index}`}
              className="flex flex-col items-start justify-end gap-4 w-full aspect-square border border-black dark:border-white p-4"
            >
              {servizio?.nome_servizio && (
                <div className="text-4xl font-black uppercase leading-tight break-words">
                  {servizio.nome_servizio}
                </div>
              )}
              {/* {servizio?.testo_tasto && link && (
                <BasicButton
                  testo={servizio.testo_tasto}
                  link={link}
                  scaleHover
                />
              )} */}
            </div>
          );
        })}
      </div>
    </div>
  );
}
