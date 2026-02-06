/**
 * @typedef {import("@prismicio/client").Content.BarraHonestSlice} BarraHonestSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<BarraHonestSlice>} BarraHonestProps
 * @type {import("react").FC<BarraHonestProps>}
 */
const BarraHonest = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for barra_honest (variation: {slice.variation})
      Slices
    </section>
  );
};

export default BarraHonest;
