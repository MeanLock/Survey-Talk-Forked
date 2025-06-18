import { Button } from "@mui/material";
import type React from "react";
import { Link } from "react-router-dom";

interface Props {
  index: number;
  label: string;
  path: string;
  activeLink: string;
}

export const NavItemBasic: React.FC<Props> = ({
  index,
  label,
  path,
  activeLink,
}) => {
  return (
    <Button
      component={Link}
      to={path}
      variant="text"
      size="small"
      key={index}
      sx={{
        marginRight: "50px",
        color: "#3e5dab", //HARDCODE
        fontSize: "15px",
        fontWeight: activeLink === path ? "bold" : "normal",
        textTransform: "none",
        "&:hover": {
          fontWeight: "bold",
          backgroundColor: "transparent",
          color: "#3e5dab", //HARDCODE
        },
      }}
    >
      {label}
    </Button>
  );
};
