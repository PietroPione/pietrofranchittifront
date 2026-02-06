/**
 * @typedef {import("@prismicio/client").Content.GallerySlice} GallerySlice
 * @typedef {import("@prismicio/react").SliceComponentProps<GallerySlice>} GalleryProps
 * @type {import("react").FC<GalleryProps>}
 */
const Gallery = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for gallery (variation: {slice.variation}) Slices
    </section>
  );
};

export default Gallery;
