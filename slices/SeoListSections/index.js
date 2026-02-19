/**
 * @type {import("react").FC<{ slice: any }>} 
 */
const SliceComponent = ({ slice }) => {
  return (
    <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      Placeholder for {slice.slice_type}
    </section>
  );
};

export default SliceComponent;
