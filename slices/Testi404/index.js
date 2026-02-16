/**
 * @typedef {import("@prismicio/client").Content.Testi404Slice} Testi404Slice
 * @typedef {import("@prismicio/react").SliceComponentProps<Testi404Slice>} Testi404Props
 * @type {import("react").FC<Testi404Props>}
 */
const Testi404 = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for testi404 (variation: {slice.variation}) slices.
      <br />
      <strong>You can edit this slice directly in your code editor.</strong>
      {/**
       * 💡 Use the Prismic MCP server with your code editor
       * 📚 Docs: https://prismic.io/docs/ai#code-with-prismics-mcp-server
       */}
    </section>
  );
};

export default Testi404;
