/**
 * @typedef {import("@prismicio/client").Content.WorkSchoolSlice} WorkSchoolSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<WorkSchoolSlice>} WorkSchoolProps
 * @type {import("react").FC<WorkSchoolProps>}
 */
const WorkSchool = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for work_school (variation: {slice.variation})
      Slices
    </section>
  );
};

export default WorkSchool;
