/**
 * @typedef {import("@prismicio/client").Content.InformazioniSlice} InformazioniSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<InformazioniSlice>} InformazioniProps
 * @type {import("react").FC<InformazioniProps>}
 */
const Informazioni = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for informazioni (variation: {slice.variation})
      Slices
    </section>
  );
};

export default Informazioni;
