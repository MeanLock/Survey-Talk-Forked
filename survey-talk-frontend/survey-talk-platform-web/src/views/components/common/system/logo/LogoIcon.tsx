import React from "react";
import LogoImage from "../../../../../assets/Image/Logo/logo.png";
import LogoWhiteImage from "../../../../../assets/Image/Logo/logo-white.png";
import "./styles.scss";

interface LogoIconProps {
  variant?: "default" | "white";
}

const LogoIcon: React.FC<LogoIconProps> = ({ variant = "default" }) => {
  return (
    <div className="logo-container">
      <img
        className="logo"
        src={variant === "default" ? LogoImage : LogoWhiteImage}
        alt="Logo Icon"
      />
    </div>
  );
};

export default LogoIcon;
