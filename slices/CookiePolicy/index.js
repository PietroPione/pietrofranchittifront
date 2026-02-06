/**
 * @typedef {import("@prismicio/client").Content.CookiePolicySlice} CookiePolicySlice
 * @typedef {import("@prismicio/react").SliceComponentProps<CookiePolicySlice>} CookiePolicyProps
 * @type {import("react").FC<CookiePolicyProps>}
 */
const CookiePolicy = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for cookie_policy (variation: {slice.variation})
      Slices
    </section>
  );
};

export default CookiePolicy;
