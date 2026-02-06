/**
 * @typedef {import("@prismicio/client").Content.PortfolioHomeSlice} PortfolioHomeSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<PortfolioHomeSlice>} PortfolioHomeProps
 * @type {import("react").FC<PortfolioHomeProps>}
 */
const PortfolioHome = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for portfolio_home (variation: {slice.variation})
      Slices
    </section>
  );
};

export default PortfolioHome;
