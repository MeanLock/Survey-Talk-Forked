import React from "react";
import { ThumbUpAltRounded } from "@mui/icons-material";
import "./styles.scss"; // Import CSS

const AnimatedLikeIcon = () => {
  return (
    <div className="like-bubble">
      <ThumbUpAltRounded className="like-icon" />
    </div>
  );
};

export default AnimatedLikeIcon;
