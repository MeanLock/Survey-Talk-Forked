import React, { useState } from "react";
import { Button, Menu, MenuItem, Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

interface Props {
  index: number;
  navItem: {
    label: string;
    isDropDown: boolean;
    paths: { title: string; path: string }[];
  };
}

export const NavItemDropDown: React.FC<Props> = ({ index, navItem }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Mở menu khi nhấn vào button
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Đóng menu khi nhấn ra ngoài
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ position: "relative", display: "inline-block" }}>
      <Button
        sx={{
          marginRight: "50px",
          color: "#3e5dab",
          fontSize: "15px",
          fontWeight: "normal",
          textTransform: "none",
          "&:hover": {
            color: "#3e5dab",
            fontWeight: "bold",
          },
        }}
        onClick={handleClick} // Mở dropdown khi click
      >
        {navItem.label}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            backgroundColor: "transparent", // Nền trong suốt cho menu
            boxShadow: "none", // Xóa box-shadow
            borderRadius: "8px", // Bo góc nhẹ cho menu
          },
        }}
        transitionDuration={300}
      >
        {navItem.paths.map((item, index) => (
          <MenuItem
            key={index}
            component={Link}
            to={item.path}
            sx={{
              backgroundColor: "white",
              marginBottom: "10px",
              borderRadius: "30px",
              padding: "10px 15px",
              color: "#3e5dab", // Màu chữ xanh
              border: "2px solid #3e5dab", // Border bottom xanh
              "&:hover": {
                backgroundColor: "#f0f0f0", // Nền hover nhẹ
                fontWeight: "bold", // Đậm chữ khi hover
              },
            }}
          >
            <Typography>{item.title}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};
