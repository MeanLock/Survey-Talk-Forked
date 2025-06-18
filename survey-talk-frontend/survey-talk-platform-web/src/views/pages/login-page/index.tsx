import { useEffect, useState, type FC } from "react";
import "./styles.scss";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useDispatch } from "react-redux";
import { useGoogleLogin } from "@react-oauth/google";
import { CssBaseline, Icon, IconButton } from "@mui/material";
import {
  loginRequiredAxiosInstance,
  publicAxiosInstance,
} from "../../../core/api/rest-api/config/instances/v2";
import { callAxiosRestApi } from "../../../core/api/rest-api/main/api-call";
import { clearAuthToken, setAuthToken } from "../../../redux/auth/authSlice";
import { errorAlert } from "../../../core/utils/alert.util";
import AppTheme from "../../components/common/mui-ui/AppTheme";

import { SignInContainer } from "./SignInContainer";
import { Card } from "./Card";

import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import GoogleIcon from "@mui/icons-material/Google";

import Logo from "../../../assets/Image/Logo/logo.png";
import SmileFace from "../../../assets/Image/Login/Login.gif";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { loginRequiredApi } from "../../../core/api/rest-api/config/instances/v1";
import { LocalStorageUtil } from "../../../core/utils/storage.util";
interface LoginPageProps {
  disableCustomTheme?: boolean;
}

const LoginPage: FC<LoginPageProps> = (props) => {
  // REDUX
  const dispatch = useDispatch();

  // STATES
  const [manualLoading, setManualLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  // const [membernameError, setMembernameError] = useState(false);
  // const [membernameErrorMessage, setMembernameErrorMessage] = useState("");
  // const [passwordError, setPasswordError] = useState(false);
  // const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");

  const [password, setPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  // HOOKS
  const navigate = useNavigate();

  // FUNCTIONS
  const isEmail = (email: string): boolean => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const validateInputs = () => {
    let isValid = true;
    if (!email) {
      setEmailError(true);
      setEmailErrorMessage("membername or email required.");
      isValid = false;
    } else {
      if (!isEmail(email)) {
        isValid = false;
        setEmailError(true);
        setEmailErrorMessage("Vui lòng nhập đúng định dạng email");
      } else {
        setEmailError(false);
        setEmailErrorMessage("");
      }
    }
    if (!password) {
      setPasswordError(true);
      setPasswordErrorMessage("Password required.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }
    return isValid;
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setEmailError(false);
    setEmailErrorMessage("");
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordError(false);
    setPasswordErrorMessage("");
  };

  const handleLoginManual = async () => {
    setManualLoading(true);
    if (validateInputs() === false) {
      toast.error("Vui lòng kiểm tra lại thông tin đăng nhập!");
      setManualLoading(false);
      return;
    }
    const Login_Info = {
      Email: email,
      Password: password,
    };

    // CALL API TẠI ĐÂY
    try {
      const response = await callAxiosRestApi(
        {
          instance: publicAxiosInstance,
          method: "post",
          url: "User/auth/login",
          data: { LoginInfo: Login_Info },
        },
        "Login Manual"
      );

      if (response.success) {
        const token = response.data.AccessToken;
        if (token) {
          console.log("Token: ", token);
          // Lưu token vào Redux
          dispatch(
            setAuthToken({
              token: token,
            })
          );

          // Lưu token vào LocalStorage
          LocalStorageUtil.setAuthTokenToPersistLocalStorage(token);

          // CALL API GET USER INFORMATIONS
          const userResponses = await callAxiosRestApi({
            instance: loginRequiredAxiosInstance,
            method: "get",
            url: "User/accounts/me",
          });
          if (userResponses.success && userResponses.data) {
            const user = {
              Id: userResponses.data.Account.Id,
              RoleId: userResponses.data.Account.Role.Id,
              FullName: userResponses.data.Account.FullName,
              Balance: userResponses.data.Account.Balance,
              IsVerified: userResponses.data.Account.IsVerified,
              Xp: userResponses.data.Account.Xp,
              Level: userResponses.data.Account.Level,
              IsFilterSurveyRequired:
                userResponses.data.Account.IsFilterSurveyRequired,
              LastFilterSurveyTakenAt:
                userResponses.data.Account.LastFilterSurveyTakenAt,
              MainImageUrl: userResponses.data.Account.MainImageUrl,
            };
            console.log("User: ", user);
            // Cập nhật Redux với thông tin user
            dispatch(
              setAuthToken({
                token: token,
                user: user,
              })
            );

            // Lưu user vào LocalStorage
            LocalStorageUtil.setAuthUserToPersistLocalStorage(user);

            // NAVIGATE TO PREVIOUS ROUTE IF NEEDED
            const redirectUrl = localStorage.getItem("redirectUrl");
            if (redirectUrl) {
              localStorage.removeItem("redirectUrl");
              window.location.href = redirectUrl;
            } else {
              window.location.href = "/";
            }
          }
        } else if (response.isAppError) {
          errorAlert(
            response.message.content
              ? response.message.content
              : "Lỗi khi đăng nhập!"
          );
        }
      }
    } catch (error) {
      console.log("Error while login: ", error);
    }
    setManualLoading(false);
  };

  const handleLoginGoogleOAuth2 = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      // console.log('Login Successsss:', codeResponse);
      const authorizationCode = codeResponse.code;

      // console.log("authorization_code", authorizationCode)

      const login_result = await callAxiosRestApi(
        {
          instance: publicAxiosInstance,
          method: "post",
          url: "/auth/google/login-authorization-code-flow",
          data: {
            authorizationCode: authorizationCode,
            redirectUri: import.meta.env.VITE_BASE_URL,
          },
        },
        "Login with Google"
      );

      if (login_result.success) {
        const token = login_result.data.auth.token;
        const user = login_result.data.auth.member;

        const redirectUrl = localStorage.getItem("redirectUrl");
        if (redirectUrl) {
          localStorage.removeItem("redirectUrl");
          window.location.href = redirectUrl;
        } else {
          window.location.href = "/";
        }
        dispatch(
          setAuthToken({
            token: token,
            user: user,
          })
        );
      } else {
        // instantAlertMaker('error', 'Login failed', login_result.error);
        console.log("ERROR", login_result.message.content);
      }

      setGoogleLoading(false);
    },
    onError: (error) => {
      // instantAlertMaker('error', 'Login failed', error);
      alert("Error: " + error.error);
      console.log("Error", error);
    },
  });

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    handleLoginGoogleOAuth2();
  };

  return (
    <div className="w-full grid grid-cols-2">
      <div className="login-left-decoration">
        <img
          className="login-left-decoration__image"
          src={SmileFace}
          alt="Smile Image"
        />
      </div>

      <div className="w-full flex items-center justify-center">
        <div className="login-form p-10 w-[485px] flex flex-col items-center">
          <img src={Logo} className="w-[175px] h-[95px]" alt="" />

          <div className="w-full login-form__input mb-5">
            <div className="login-form__input-label">
              <p>Email: </p>
            </div>
            <TextField
              className="login-form__input-value"
              value={email}
              error={emailError}
              helperText={emailErrorMessage}
              type="email"
              fullWidth
              sx={{
                "& .MuiInput-underline:before": {
                  display: "none", // Loại bỏ gạch chân dưới
                },
                "& .MuiInput-underline:after": {
                  display: "none", // Loại bỏ gạch chân dưới khi focus
                },
              }}
              placeholder="Enter your email to sign in"
              variant="standard"
              onChange={(e) => handleEmailChange(e.target.value)}
            />
          </div>

          <div className="w-full login-form__input mb-5">
            <div className="login-form__input-label">
              <p>Password: </p>
            </div>
            <TextField
              className="login-form__input-value"
              fullWidth
              sx={{
                "& .MuiInput-underline:before": {
                  display: "none", // Loại bỏ gạch chân dưới
                },
                "& .MuiInput-underline:after": {
                  display: "none", // Loại bỏ gạch chân dưới khi focus
                },
              }}
              value={password}
              error={passwordError}
              helperText={passwordErrorMessage}
              type="password"
              placeholder="Enter your password sign in"
              variant="standard"
              onChange={(e) => handlePasswordChange(e.target.value)}
            />
          </div>

          <div className="actions w-full grid grid-cols-2 mb-5">
            <div className="actions__no-account w-full flex items-center justify-start">
              <p
                onClick={() => navigate("/register")}
                className="text-[13px] font-bold"
              >
                Bạn chưa có tài khoản?
              </p>
            </div>
            <div className="actions__forgot-password w-full flex items-center justify-end">
              <p
                onClick={() => navigate("/forgot-password/1")}
                className="text-[12px] font-bold"
              >
                Quên mật khẩu?
              </p>
            </div>
          </div>

          <button
            onClick={() => handleLoginManual()}
            className="login-form__button mb-5"
          >
            ĐĂNG NHẬP
          </button>

          <div className="oauth mb-5">
            <div className="oauth__title w-full flex items-center justify-around">
              <div className="oauth__title-divider"></div>
              <p className="oauth__title-text">hoặc đăng nhập với</p>
              <div className="oauth__title-divider"></div>
            </div>
            <div className="oauth_option-icons mt-4 w-full flex justify-center items-center gap-10">
              <IconButton>
                <FacebookRoundedIcon
                  sx={{ color: "#3E5DAB", fontSize: "50px" }}
                />
              </IconButton>
              <IconButton onClick={() => handleGoogleLogin()}>
                <GoogleIcon sx={{ color: "#3E5DAB", fontSize: "50px" }} />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
