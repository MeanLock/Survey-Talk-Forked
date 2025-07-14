import { useDispatch } from "react-redux";
import { getAccountMe } from "@/services/Profile/get-accounts-me";
import { updateAuthUser } from "@/redux/auth/authSlice";
import { LocalStorageUtil } from "@/core/utils/storage.util";

export const useRefetchUser = () => {
  const dispatch = useDispatch();

  const refetchUser = async () => {
    alert("Chạy hàm update User!");
    const user = await getAccountMe();
    if (user) {
      dispatch(updateAuthUser({ user: user.user }));
      LocalStorageUtil.setAuthUserToPersistLocalStorage(user);
    }
    console.log("User: ", user.user);
    alert("Ê");
  };

  return refetchUser;
};
