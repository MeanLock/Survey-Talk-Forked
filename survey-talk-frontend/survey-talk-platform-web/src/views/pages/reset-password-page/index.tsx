import Logo from "../../../assets/Image/Logo/logo.png";
import DoneImg from "../../../assets/Image/ForgotPass/done.png";
import "./styles.scss";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { callAxiosRestApi } from "../../../core/api/rest-api/main/api-call";
import { publicAxiosInstance } from "../../../core/api/rest-api/config/instances/v2";
import { errorAlert } from "../../../core/utils/alert.util";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [rePass, setRePass] = useState("");
  const [errPassword, setErrPassword] = useState(false);
  const [errPasswordMsg, setErrPasswordMsg] = useState("");

  // HOOKS
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  // HANDLE RESET PASSWORD
  const handleNewPassword = async () => {
    if (!password || password.length < 6) {
      setErrPassword(true);
      setErrPasswordMsg("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    if (password !== rePass) {
      setErrPassword(true);
      setErrPasswordMsg("Mật khẩu nhập lại không khớp");
      return;
    }

    setErrPassword(false);
    setErrPasswordMsg("");

    // Gửi API đổi mật khẩu
    if (token) {
      try {
        const response = await callAxiosRestApi({
          instance: publicAxiosInstance,
          method: "post",
          url: "User/auth/new-reset-password",
          data: {
            Email: email,
            NewPassword: password,
            PasswordResetToken: token,
          },
        });
        if (response.success) {
          navigate("/forgot-password/2");
        }
      } catch (error) {
        errorAlert("Không thể đổi mật khẩu");
        console.log("Error while reset password: ", error);
      }
    } else {
      return;
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/forgot-password/1");
    }
  }, []);

  return (
    <div className="forgot-pass_screen w-full h-[100vh] flex flex-col p-10 relative">
      <div className="background-blur"></div>
      <div className="forgot-pass_content w-full flex flex-col items-center relative z-10">
        <div className="forgot-pass_logo flex items-center w-full justify-start">
          <img
            src={Logo}
            onClick={() => navigate("/")}
            alt="SurveyTalk"
            className="w-[157px] h-[65px] object-cover cursor-pointer"
          />
        </div>

        <div className="forgot-pass__title w-1/3 flex flex-col items-center mt-10 gap-3">
          <div className="w-[100px] h-[100px] bg-white rounded-full flex items-center justify-center">
            <img
              src={DoneImg}
              alt="Forgot Password ?"
              className="w-[100px] h-[100px] rounded-full object-cover"
            />
          </div>
          <p className="big">Đặt mật khẩu mới cho bạn!</p>
          <p className="small">Đừng có quên nữa nha ^^!</p>
        </div>

        <div className="forgot-pass__actions mt-5 bg-white flex flex-col rounded-md p-6 w-[400px] gap-4 shadow-lg">
          <input
            type="password"
            placeholder="Nhập mật khẩu mới"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="password"
            placeholder="Nhập lại mật khẩu"
            value={rePass}
            onChange={(e) => setRePass(e.target.value)}
            className="border p-2 rounded"
          />
          {errPassword && (
            <p className="text-red-500 text-sm">{errPasswordMsg}</p>
          )}
          <Button
            onClick={handleNewPassword}
            variant="contained"
            color="primary"
          >
            Đổi mật khẩu
          </Button>
        </div>

        <div className="forgot-pass__navigate w-[440px] mt-2 flex items-center justify-start">
          <div
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 cursor-pointer text-gray-500 hover:text-[#3e5dab] hover:underline"
          >
            <KeyboardBackspaceIcon />
            <p className="font-semibold text-sm">Quay lại trang đăng nhập</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
