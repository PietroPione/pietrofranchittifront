/**
 * @typedef {import("@prismicio/client").Content.WhoIsPioSlice} WhoIsPioSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<WhoIsPioSlice>} WhoIsPioProps
 * @type {import("react").FC<WhoIsPioProps>}
 */
const WhoIsPio = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for who_is_pio (variation: {slice.variation}) Slices
    </section>
  );
};

export default WhoIsPio;
