/**
 * @typedef {import("@prismicio/client").Content.ContattiHSlice} ContattiHSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<ContattiHSlice>} ContattiHProps
 * @type {import("react").FC<ContattiHProps>}
 */
const ContattiH = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for contatti_h (variation: {slice.variation}) Slices
    </section>
  );
};

export default ContattiH;
