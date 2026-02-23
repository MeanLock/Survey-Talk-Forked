import React from "react";
import { Link } from "react-router-dom"; // Import Link từ react-router-dom
import "./LinkButton.scss";

// Định nghĩa props cho LinkButton
interface LinkButtonProps {
  link: string; // Link route cần chuyển hướng
  backgroundColor: string; // Màu nền của button
  color: string; // Màu chữ của button
  title: string; // Nội dung hiển thị trên button
}

const LinkButton: React.FC<LinkButtonProps> = ({
  link,
  backgroundColor,
  color,
  title,
}) => {
  return (
    <Link
      to={link}
      className="link-button"
      style={
        {
          "--background-color": backgroundColor,
          "--color": color,
        } as React.CSSProperties
      } // Truyền màu qua CSS variables
    >
      {title}
    </Link>
  );
};

export default LinkButton;
