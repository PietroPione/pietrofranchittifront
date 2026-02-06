/**
 * @typedef {import("@prismicio/client").Content.CoseNonPiaccionoSlice} CoseNonPiaccionoSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<CoseNonPiaccionoSlice>} CoseNonPiaccionoProps
 * @type {import("react").FC<CoseNonPiaccionoProps>}
 */
const CoseNonPiacciono = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for cose_non_piacciono (variation: {slice.variation}
      ) Slices
    </section>
  );
};

export default CoseNonPiacciono;
