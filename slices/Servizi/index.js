/**
 * @typedef {import("@prismicio/client").Content.ServiziSlice} ServiziSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<ServiziSlice>} ServiziProps
 * @type {import("react").FC<ServiziProps>}
 */
const Servizi = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for servizi (variation: {slice.variation}) slices.
      <br />
      <strong>You can edit this slice directly in your code editor.</strong>
      {/**
       * 💡 Use the Prismic MCP server with your code editor
       * 📚 Docs: https://prismic.io/docs/ai#code-with-prismics-mcp-server
       */}
    </section>
  );
};

export default Servizi;
