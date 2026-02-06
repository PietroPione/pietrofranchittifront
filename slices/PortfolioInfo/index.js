/**
 * @typedef {import("@prismicio/client").Content.PortfolioInfoSlice} PortfolioInfoSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<PortfolioInfoSlice>} PortfolioInfoProps
 * @type {import("react").FC<PortfolioInfoProps>}
 */
const PortfolioInfo = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for portfolio_info (variation: {slice.variation})
      Slices
    </section>
  );
};

export default PortfolioInfo;
