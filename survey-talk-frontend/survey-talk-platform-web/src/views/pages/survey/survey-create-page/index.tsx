import useBlocker from "../../../../hooks/useBlocker";
import "./styles.scss";

const SurveyCreatePage = () => {
  useBlocker(true);
  return (
    <div>
      <p>Trang tạo Survey</p>
      <p>Hẹ hẹ hẹ</p>
    </div>
  );
};

export default SurveyCreatePage;
