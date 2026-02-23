import Logo from "../../../assets/Image/Logo/logo.png";
import ConfusingImg from "../../../assets/Image/ForgotPass/Confusing.png";
import "./styles.scss";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { callAxiosRestApi } from "../../../core/api/rest-api/main/api-call";
import { publicAxiosInstance } from "../../../core/api/rest-api/config/instances/v2";

const ForgotPassword = () => {
  // STATES
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState(false);
  const [emailErrMsg, setEmailErrMsg] = useState("");

  const [isRequestSended, setIsRequestSended] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(50);

  // HOOKS
  const { step } = useParams();
  const navigate = useNavigate();

  // HANDLE EMAIL REQUEST
  const handleRequest = async () => {
    if (!email || !email.includes("@")) {
      setEmailErr(true);
      setEmailErrMsg("Vui lòng nhập email hợp lệ");
      return;
    }

    setEmailErr(false);
    setEmailErrMsg("");

    // Gọi API gửi yêu cầu reset password

    try {
      const response = await callAxiosRestApi({
        instance: publicAxiosInstance,
        method: "post",
        url: "User/auth/forgot-password",
        data: {
          Email: email,
        },
      });
      if (response.success) {
        setIsRequestSended(true);
        setResendCountdown(50);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendCountdown]);

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
              src={ConfusingImg}
              alt="Forgot Password ?"
              className="w-[100px] h-[100px] rounded-full object-cover"
            />
          </div>
          <p className="big">Bạn quên mật khẩu?</p>
          <p className="small">
            Đừng lo, hãy làm theo hướng dẫn dưới đây để reset mật khẩu!
          </p>
        </div>

        <div className="forgot-pass__actions mt-5 bg-white flex flex-col rounded-md p-6 w-[400px] gap-4 shadow-lg">
          {step === "1" && isRequestSended ? (
            <div className="w-full flex flex-col gap-2">
              <p className="font-semibold forgot-pass__actions__instructions-title">
                Yêu cầu xác thực đã được gửi tới email: {email} của bạn.
              </p>
              <p className="forgot-pass__actions__instructions-description">
                Vui lòng kiểm tra email để tiến hành bước tiếp theo.
              </p>
              <Button
                onClick={() => {
                  handleRequest();
                  setResendCountdown(50);
                }}
                color="primary"
                variant="contained"
                disabled={resendCountdown > 0}
              >
                {resendCountdown > 0
                  ? `Yêu cầu gửi lại (${resendCountdown}s)`
                  : "Yêu cầu gửi lại mail xác thực"}
              </Button>
            </div>
          ) : step === "1" && !isRequestSended ? (
            <>
              <input
                type="email"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2 rounded"
              />
              {emailErr && (
                <p className="text-red-500 text-sm">{emailErrMsg}</p>
              )}
              <Button
                onClick={handleRequest}
                color="primary"
                variant="contained"
              >
                Gửi yêu cầu
              </Button>
            </>
          ) : (
            <></>
          )}

          {/* {step === "2" && (
            <>
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
            </>
          )} */}

          {step === "2" && (
            <div className="text-center w-full flex flex-col items-center gap-2">
              <p className="text-lg font-semibold text-green-700">
                ✅ Mật khẩu đã được đặt lại thành công!
              </p>
              <p>
                Bạn có thể quay lại trang đăng nhập và sử dụng mật khẩu mới.
              </p>
              <Button
                color="primary"
                variant="contained"
                fullWidth
                onClick={() => navigate("/login")}
              >
                Đăng Nhập
              </Button>
            </div>
          )}
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

export default ForgotPassword;
