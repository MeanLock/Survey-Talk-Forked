import LogoImage from "../../../../../assets/Image/Logo/logo.png";
import "./styles.scss";

const LogoIcon = () => {
  return (
    <div className="logo-container">
      <img className="logo" src={LogoImage} alt="Logo Icon" />
    </div>
  );
};

export default LogoIcon;
