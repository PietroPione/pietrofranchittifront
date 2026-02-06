/**
 * @typedef {import("@prismicio/client").Content.LinkMenuSlice} LinkMenuSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<LinkMenuSlice>} LinkMenuProps
 * @type {import("react").FC<LinkMenuProps>}
 */
const LinkMenu = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for link_menu (variation: {slice.variation}) Slices
    </section>
  );
};

export default LinkMenu;
