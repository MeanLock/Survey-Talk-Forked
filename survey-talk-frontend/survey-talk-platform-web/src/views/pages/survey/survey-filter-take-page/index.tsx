import useBlocker from "../../../../hooks/useBlocker";

const FilterSurveyPage = () => {
  useBlocker(true);
  return (
    <div>
      <p>Con cặc</p>
    </div>
  );
};

export default FilterSurveyPage;
