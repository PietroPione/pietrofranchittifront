/**
 * @typedef {import("@prismicio/client").Content.CosePiaccionoSlice} CosePiaccionoSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<CosePiaccionoSlice>} CosePiaccionoProps
 * @type {import("react").FC<CosePiaccionoProps>}
 */
const CosePiacciono = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for cose_piacciono (variation: {slice.variation})
      Slices
    </section>
  );
};

export default CosePiacciono;
