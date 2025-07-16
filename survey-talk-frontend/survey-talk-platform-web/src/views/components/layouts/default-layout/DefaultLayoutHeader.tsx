import { useEffect, useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  styled,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthToken } from "../../../../redux/auth/authSlice";
import { JwtUtil } from "../../../../core/utils/jwt.util";
import LogoIcon from "../../common/system/logo/LogoIcon";
import StarsIcon from "@mui/icons-material/Stars";
import "./headerStyle.scss";
import LinkButton from "../../common/system/button/LinkButton";
import { NavItemBasic } from "./NavItemBasic";
import { NavItemDropDown } from "./NavItemDropDown";
import User1 from "../../../../assets/Image/Customers/user-0001/avatar.jpg";
import { Level } from "./Level";
import type { RootState } from "../../../../redux/rootReducer";
import { clearFakeData } from "../../../../redux/fake/fakeSlice";
import { requesterFake, takerFake } from "../../../../core/mockData/userFake";
import DefaultAvatar from "@/assets/Image/Customers/default.jpg";
import type { UserInformations } from "@/services/Profile/get-accounts-me";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "15px 0px",
}));

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

interface DefaultLayoutHeaderProps {
  navItems: any;
  userInformations: UserInformations
}

export const DefaultLayoutHeader: React.FC<DefaultLayoutHeaderProps> = ({
  navItems,
  userInformations,
}) => {
  const [openMenu, setOpenMenu] = useState<null | HTMLElement>(null);
  const [value, setValue] = useState("");
  const [isLogin, setIsLogin] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    setValue(window.location.pathname);
    if (auth.token && JwtUtil.isTokenValid(auth.token)) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
      handleLogout();
    }
  }, [auth]);

  const handleLogout = () => {
    dispatch(clearFakeData());
    dispatch(clearAuthToken());
    navigate("/login");
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenu(event.currentTarget);
  };

  const handleMenuClose = () => {
    setOpenMenu(null);
  };

  return (
    <AppBar sx={{ boxShadow: 0, bgcolor: "#FFEAA8", backgroundImage: "none" }}>
      <Container maxWidth="xl">
        <StyledToolbar variant="dense" disableGutters>
          <Box
            sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}
          >
            <LogoIcon variant="default" />
            <Box sx={{ display: { xs: "none", md: "flex" }, paddingLeft: 3 }}>
              {navItems
                ? navItems.map((item: any, index: number) =>
                    item.isDropDown ? (
                      <NavItemDropDown
                        key={index}
                        index={index}
                        navItem={item}
                      />
                    ) : (
                      <NavItemBasic
                        key={index}
                        index={index}
                        label={item.label}
                        path={item.paths[0].path}
                        activeLink={value}
                      />
                    )
                  )
                : null}
            </Box>
          </Box>

          {isLogin && userInformations ? (
            <div className="user-profile flex gap-3 items-center">
              <div className="flex items-center gap-2 text-[#ffc40d]">
                <StarsIcon />
                <p className="font-bold">
                  {/* TASK FAKE DATA, PHẢI BỎ KHI ĐÃ CÓ API */}
                  {/* {auth.user?.Balance?.toLocaleString("vn")} */}
                  {userInformations.Balance.toLocaleString("vn")}
                </p>
              </div>
              <IconButton onClick={handleMenuOpen}>
                <img
                  src={
                    userInformations?.MainImageUrl ? userInformations.MainImageUrl : DefaultAvatar
                  }
                  alt={userInformations?.FullName}
                  className="w-[48px] h-[48px] rounded-full"
                />
              </IconButton>

              <div className="user-details flex flex-col items-start">
                <p className="user-profile__full-name">{userInformations?.FullName}</p>
                <Level
                  //TASK FAKE DATA, PHẢI BỎ KHI ĐÃ CÓ API
                  xp={userInformations ? userInformations.Xp : null}
                  level={userInformations ? userInformations.Level : null}
                  // xp={member ? member.Xp : null}
                  // level={member ? member.Level : null}
                />
              </div>

              {/* Menu Avatar */}
              <Menu
                anchorEl={openMenu}
                open={Boolean(openMenu)}
                onClose={handleMenuClose}
                sx={{
                  borderRadius: "8px",
                  minWidth: "200px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <MenuItem
                  component={Link}
                  to="/user/profile"
                  onClick={handleMenuClose}
                >
                  Quản lý thông tin cá nhân
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/user/level"
                  onClick={handleMenuClose}
                >
                  Quản lý cấp độ
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/user/transactions"
                  onClick={handleMenuClose}
                >
                  Nạp/Rút tiền
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          ) : (
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 1,
                alignItems: "center",
              }}
            >
              <LinkButton
                link="/login"
                backgroundColor="#3e5dab"
                color="#fff"
                title="Tham Gia Ngay"
              />
            </Box>
          )}
        </StyledToolbar>
      </Container>
    </AppBar>
  );
};
