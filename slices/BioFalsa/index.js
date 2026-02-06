/**
 * @typedef {import("@prismicio/client").Content.BioFalsaSlice} BioFalsaSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<BioFalsaSlice>} BioFalsaProps
 * @type {import("react").FC<BioFalsaProps>}
 */
const BioFalsa = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for bio_falsa (variation: {slice.variation}) Slices
    </section>
  );
};

export default BioFalsa;
