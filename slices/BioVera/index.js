/**
 * @typedef {import("@prismicio/client").Content.BioVeraSlice} BioVeraSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<BioVeraSlice>} BioVeraProps
 * @type {import("react").FC<BioVeraProps>}
 */
const BioVera = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for bio_vera (variation: {slice.variation}) Slices
    </section>
  );
};

export default BioVera;
