import React, { createContext, useEffect, useState } from "react";
import "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../../../redux/rootReducer";
import {
  clearAuthToken,
  updateAuthUser,
} from "../../../../redux/auth/authSlice";
import { JwtUtil } from "../../../../core/utils/jwt.util";
import { DefaultLayoutHeader } from "./DefaultLayoutHeader";
import { DefaultLayoutContent } from "./DefaultLayoutContent";
import { DefaultLayoutFooter } from "./DefaultLayoutFooter";
import {
  _nonLoginNav,
  _footerNav,
  _loginNav,
} from "../../../../router/_roleNav";
import Swal from "sweetalert2";
import { callAxiosRestApi } from "../../../../core/api/rest-api/main/api-call";
import { loginRequiredAxiosInstance } from "../../../../core/api/rest-api/config/instances/v2";
import { getAccountMe } from "@/services/Profile/get-accounts-me";

interface DefaultLayoutContextProps {
  isAdmin: boolean;
  isLogin: boolean;
}

export const DefaultLayoutContext = createContext<DefaultLayoutContextProps>({
  isAdmin: false,
  isLogin: false,
});

const DefaultLayout = () => {
  // HOOKS
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // STATES
  const [isLoading, setIsLoading] = useState(true);
  const [navItems, setNavItems] = useState<any>([]);
  const [userInformations, setUserInformations] = useState<any>(null);
  const [footerNavItems, setFooterNavItems] = useState<
    {
      label: string;
      path: string;
    }[]
  >([]);

  // REDUX
  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    setIsLoading(true);
    setFooterNavItems(_footerNav);
    if (!auth.token) {
      setNavItems(_nonLoginNav);
      dispatch(clearAuthToken());
    } else if (auth.token && JwtUtil.isTokenValid(auth.token)) {
      // CALL API TO GET USER INFORMATIONS
      fetch();
      setNavItems(_loginNav);
    } else {
      console.log("Không valid rồiiiii");
      alert("Không valid");
      dispatch(clearAuthToken());
    }
  }, []);

  // FUNCTIONS
  const fetch = async () => {
    try {
      const user = await getAccountMe();
      if (user) {
        dispatch(
          updateAuthUser({
            token: auth.token,
            user: user.user,
          })
        );

        setUserInformations(user.user);

        if (!user.user.Profile) {
          Swal.fire({
            title: "Chỉ còn 1 bước nữa thôi!",
            text: "Cập nhật thông tin ngay để bắt đầu các chức năng của trang web",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Vào làm",
            cancelButtonText: "Hủy",
            allowOutsideClick: false,
            allowEscapeKey: false,
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/survey/filter-survey");
            } else {
              dispatch(clearAuthToken());
              navigate("/login");
            }
          });
        } else if (
          user.user.Profile.CountryRegion === null ||
          user.user.Profile.AverageIncome === null ||
          user.user.Profile.DistrictCode === null ||
          user.user.Profile.JobField === null ||
          user.user.Profile.MaritalStatus === null ||
          user.user.Profile.WardCode === null
        ) {
          Swal.fire({
            title: "Chỉ còn 1 bước nữa thôi!",
            text: "Cập nhật thông tin ngay để bắt đầu các chức năng của trang web",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Vào làm",
            cancelButtonText: "Hủy",
            allowOutsideClick: false,
            allowEscapeKey: false,
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/survey/filter-survey");
            } else {
              dispatch(clearAuthToken());
              navigate("/login");
            }
          });
        }
      }
      setIsLoading(false);
    } catch (error) {}
  };

  return (
    <DefaultLayoutContext.Provider
      value={{
        isAdmin: userInformations && userInformations.isAdmin,
        isLogin: userInformations ? true : false,
      }}
    >
      <div className="default-layout flex flex-col w-full h-screen">
        {/* HEADER */}
        <DefaultLayoutHeader
          navItems={navItems}
          userInformations={userInformations}
        />

        {/* MAIN WRAPPER */}
        <div className="flex flex-col flex-grow w-full mt-[83px]">
          <div className="flex-grow m-0 p-0">
            <div className="w-full min-h-[calc(100vh-83px-95px)]">
              {/* trừ header */}
              <DefaultLayoutContent />
            </div>
          </div>

          {/* FOOTER */}
          <DefaultLayoutFooter navItems={footerNavItems} />
        </div>
      </div>
    </DefaultLayoutContext.Provider>
  );
};

export default DefaultLayout;
