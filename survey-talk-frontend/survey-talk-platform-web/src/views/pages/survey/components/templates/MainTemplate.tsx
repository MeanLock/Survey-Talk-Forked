import { loginRequiredAxiosInstance } from "@/core/api/rest-api/config/instances/v2";
import { callAxiosRestApi } from "@/core/api/rest-api/main/api-call";
import { clearAuthToken, updateAuthUser } from "@/redux/auth/authSlice";
import type { RootState } from "@/redux/rootReducer";
import { _loginNav } from "@/router/_roleNav";
import SurveyTalkLoading from "@/views/components/common/loading";
import { DefaultLayoutHeader } from "@/views/components/layouts/default-layout/DefaultLayoutHeader";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
type Props = { children: React.ReactNode };

const MainTemPlate = ({ children }: Props) => {
  // STATES
  const [member, setMember] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // REDUX
  const auth = useSelector((state: RootState) => state.auth);

  // HOOKS
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    if (!auth.token) {
      toast.error("Bạn cần đăng nhập để thực hiện chức năng này !");
      dispatch(clearAuthToken());
      setMember(null);
      window.location.href = "/login";
    } else {
      fetch();
    }
  }, []);

  // FUNCTIONS
  const fetch = async () => {
    try {
      const response = await callAxiosRestApi({
        instance: loginRequiredAxiosInstance,
        method: "get",
        url: "User/accounts/me",
      });
      if (response.success) {
        const member = response.data;

        const user = {
          Id: member.Account.Id,
          RoleId: member.Account.Role.Id,
          FullName: member.Account.FullName,
          Balance: member.Account.Balance,
          IsVerified: member.Account.IsVerified,
          Xp: member.Account.Xp,
          Level: member.Account.Level,
          IsFilterSurveyRequired: member.Account.IsFilterSurveyRequired,
          LastFilterSurveyTakenAt: member.Account.LastFilterSurveyTakenAt,
          MainImageUrl: member.Account.MainImageUrl,
          Profile: member.Account.Profile,
        };
        dispatch(
          updateAuthUser({
            user: user,
          })
        );
        setMember(user);
        setIsLoading(false);
      }
    } catch (error) {}
  };

  return (
    <div className="w-full flex items-center justify-center ">
      {isLoading ? (
        <div className="w-full h-screen flex flex-col items-center justify-center gap-5">
          <SurveyTalkLoading />
          <p className="text-2xl font-bold">Đang tải ...</p>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center justify-center relative ">
          <DefaultLayoutHeader navItems={_loginNav} userInformations={member} />
          <div className="mt-[95px] w-full">{children}</div>
        </div>
      )}
    </div>
  );
};

export default MainTemPlate;
