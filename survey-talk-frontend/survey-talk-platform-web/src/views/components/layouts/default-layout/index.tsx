import React, { createContext, useEffect, useState } from "react";
import "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../../../redux/rootReducer";
import { clearAuthToken } from "../../../../redux/auth/authSlice";
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
  const [member, setMember] = useState<any>(null);
  const [navItems, setNavItems] = useState<any>([]);

  const [footerNavItems, setFooterNavItems] = useState<
    {
      label: string;
      path: string;
    }[]
  >([]);

  // REDUX
  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    setFooterNavItems(_footerNav);
    if (!auth.token) {
      setNavItems(_nonLoginNav);
      dispatch(clearAuthToken());
      setMember(null);
    } else if (auth.token && JwtUtil.isTokenValid(auth.token)) {
      const member = auth.user;
      console.log("MEMBER: ", member);
      setMember(member);
      setNavItems(_loginNav);

      // if (!auth.user?.Profile) {
      //   Swal.fire({
      //     title: "Cho chúng tôi biết bạn là ai",
      //     text: "Cập nhật thông tin ngay để tiếp tục vào trang web",
      //     icon: "info",
      //     showCancelButton: true,
      //     confirmButtonText: "Vào làm",
      //     cancelButtonText: "Hủy",
      //     allowOutsideClick: false,
      //     allowEscapeKey: false,
      //   }).then((result) => {
      //     if (result.isConfirmed) {
      //       navigate("/survey/filter-survey");
      //     } else {
      //       dispatch(clearAuthToken());
      //       navigate("/login");
      //     }
      //   });
      // }
    } else {
      console.log("Không valid rồiiiii");
      alert("Không valid");
      dispatch(clearAuthToken());
      setMember(null);
    }
  }, [auth, navigate]);

  return (
    <DefaultLayoutContext.Provider
      value={{
        isAdmin: member && member.isAdmin,
        isLogin: member ? true : false,
      }}
    >
      <div className="default-layout flex flex-col w-full h-screen">
        {/* HEADER */}
        <DefaultLayoutHeader navItems={navItems} member={member} />

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
