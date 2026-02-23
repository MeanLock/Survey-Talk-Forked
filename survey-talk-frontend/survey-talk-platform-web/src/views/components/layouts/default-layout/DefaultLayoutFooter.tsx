import React, { useEffect, useState, type FC } from "react";
import "./styles.scss";
import LogoIcon from "../../common/system/logo/LogoIcon";
import { Button } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

interface DefaultLayoutFooterProps {
  navItems: {
    label: string;
    path: string;
  }[];
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export const DefaultLayoutFooter: FC<DefaultLayoutFooterProps> = ({
  navItems,
}) => {
  // HOOKS
  const query = useQuery();

  // STATES
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(window.location.pathname);
  }, [query]);

  return (
    <React.Fragment>
      <div className={"default-layout-footer grid grid-cols-3 py-5"}>
        <div>
          <LogoIcon variant="white" />
        </div>

        <div className="flex items-center justify-around">
          {navItems.map((item, index) => (
            <Button
              component={Link}
              to={item.path}
              variant="text"
              size="small"
              key={index}
              sx={{
                marginRight: "5px",
                color: "white", //HARDCODE
                fontSize: "15px",
                textDecoration: value === item.path ? "underline" : "none",
                textTransform: "none",
                "&:hover": {
                  textDecoration: "underline",
                  backgroundColor: "transparent",
                  color: "white", //HARDCODE
                },
              }}
            >
              {item.label}
            </Button>
          ))}
        </div>

        <div className="px-10 flex items-center justify-end">
          <p className="default-layout-footer__copy-right">@2025 SurveyTalk</p>
        </div>
      </div>
    </React.Fragment>
  );
};
