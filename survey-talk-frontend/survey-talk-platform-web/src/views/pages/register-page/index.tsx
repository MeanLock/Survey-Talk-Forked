import { useEffect, useState, type FC } from "react";
import "./styles.scss";
import { callAxiosRestApi } from "../../../core/api/rest-api/main/api-call";
import { publicAxiosInstance } from "../../../core/api/rest-api/config/instances/v2";
import { errorAlert, successAlert } from "../../../core/utils/alert.util";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import RegisGif from "../../../assets/Image/Register/Regis.gif";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import GoogleIcon from "@mui/icons-material/Google";
import Swal from "sweetalert2";
import Logo from "../../../assets/Image/Logo/logo.png";
import { useNavigate } from "react-router-dom";
import { IconButton, TextField } from "@mui/material";
import { useDispatch } from "react-redux";
const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
interface RegisterPageProps {
  disableCustomTheme?: boolean;
}

const RegistersPage: FC<RegisterPageProps> = (props) => {
  // REDUX
  const dispatch = useDispatch();

  // STATES
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [YOB, setYOB] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [gender, setGender] = useState("male");
  const [address, setAddress] = useState("");
  const [imgBase64, setImgBase64] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [fullNameError, setFullNameError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [YOBError, setYOBError] = useState(false);

  const [fullNameErrorMessage, setFullNameErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [YOBErrorMessage, setYOBErrorMessage] = useState("");
  const [phoneErrorMessage, setPhoneErrorMessage] = useState("");

  // HOOKS
  const navigate = useNavigate();

  const validatePhoneNumber = (phone: string) => {
    // Kiểm tra tính hợp lệ của số điện thoại
    if (!phone) {
      setPhoneError(true);
      setPhoneErrorMessage("Số điện thoại không được để trống");
      return false;
    }

    if (phone.length < 10 || phone.length > 15) {
      setPhoneError(true);
      setPhoneErrorMessage("Số điện thoại phải có từ 10 đến 15 chữ số");
      return false;
    }

    setPhoneError(false);
    setPhoneErrorMessage("");
    return true;
  };

  const validateRegisterMember = () => {
    let isValid = true;

    // Kiểm tra tên
    if (fullName === "") {
      isValid = false;
      setFullNameError(true);
      setFullNameErrorMessage("Tên không được để trống");
    } else if (fullName.length < 2) {
      isValid = false;
      setFullNameError(true);
      setFullNameErrorMessage("Tên phải có ít nhất 2 ký tự");
    } else {
      // Kiểm tra chữ cái đầu tiên có phải viết hoa
      const nameRegex = /^[A-Z]/;
      if (!nameRegex.test(fullName)) {
        isValid = false;
        setFullNameError(true);
        setFullNameErrorMessage("Chữ cái đầu tiên phải viết hoa");
      } else {
        setFullNameError(false);
        setFullNameErrorMessage("");
      }
    }

    // Kiểm tra email
    if (email === "" || !validateEmail(email)) {
      isValid = false;
      setEmailError(true);
      setEmailErrorMessage("Email không hợp lệ");
    } else {
      setEmailErrorMessage("");
    }

    // Kiểm tra password
    if (password === "") {
      isValid = false;
      setPasswordError(true);
      setPasswordErrorMessage("Password không được để trống");
    } else {
      // Kiểm tra password có ít nhất 1 ký tự đặc biệt, 1 ký tự viết hoa, và dài tối thiểu 6 ký tự
      const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{6,}$/;
      if (!passwordRegex.test(password)) {
        isValid = false;
        setPasswordError(true);
        setPasswordErrorMessage(
          "Mật khẩu phải có ít nhất 1 ký tự viết hoa, 1 ký tự đặc biệt và ít nhất 6 ký tự"
        );
      } else if (password !== rePassword) {
        isValid = false;
        setPasswordError(true);
        setPasswordErrorMessage("Nhập lại mật khẩu không khớp!");
      } else {
        setPasswordError(false);
        setPasswordErrorMessage("");
      }
    }

    // Kiểm tra số điện thoại
    if (phone === "") {
      isValid = false;
      setPhoneError(true);
      setPhoneErrorMessage("Số điện thoại không được để trống");
    } else {
      setPhoneError(false);
      setPhoneErrorMessage("");
    }

    // Kiểm tra YOB
    if (YOB === "") {
      isValid = false;
      setYOBError(true);
      setYOBErrorMessage("Ngày sinh không được để trống!");
    } else {
      setYOBErrorMessage("");
    }

    return isValid;
  };

  const handleRegisterMember = async () => {
    if (validateRegisterMember() && validatePhoneNumber(phone)) {
      setLoading(true);

      // Gọi API
      const addMember = await callAxiosRestApi({
        instance: publicAxiosInstance,
        method: "post",
        url: "User/auth/register/customer",
        data: {
          RegisterInfo: {
            Email: email,
            Password: password,
            FullName: fullName,
            Dob: YOB,
            Gender: gender,
            Address: null,
            Phone: phone,
            ImageBase64: imgBase64,
          },
        },
      });

      if (addMember.success) {
        // Hiển thị thông báo đăng ký thành công
        await successAlert(addMember.message.content);

        // Hiển thị yêu cầu nhập mã xác thực
        const { value: verifyCode } = await Swal.fire({
          title: "Xác thực tài khoản",
          input: "text",
          inputPlaceholder: "Nhập mã xác thực",
          showCancelButton: true,
          confirmButtonText: "Xác nhận",
          cancelButtonText: "Hủy",
          inputValidator: (value) => {
            if (!value) {
              return "Bạn phải nhập mã xác thực!";
            }
          },
        });

        // Kiểm tra mã xác thực
        if (verifyCode === "123456") {
          // Mã đúng, chuyển qua trang login
          successAlert("Xác thực thành công! Vui lòng đăng nhập.");
          localStorage.setItem("isRegister", "true");
          window.location.href = "/login"; // Chuyển hướng đến trang login
        } else {
          // Mã sai, thông báo và yêu cầu nhập lại
          errorAlert("Mã xác thực không đúng, vui lòng thử lại.");
          handleRegisterMember(); // Gọi lại hàm đăng ký để người dùng nhập lại mã
        }
      } else if (!addMember.isAppError) {
        errorAlert(addMember.message.content + ". Vui lòng thử lại!");
      }
      setLoading(false);
    }
  };
  const handleEmailChange = (email: string) => {
    setEmailError(false);
    setEmailErrorMessage("");
    setEmail(email);
  };

  const handlePasswordChange = (password: string) => {
    setPasswordError(false);
    setPasswordErrorMessage("");
    setPassword(password);
  };

  const handleFullNameChange = (fullName: string) => {
    setFullNameError(false);
    setFullNameErrorMessage("");
    setFullName(fullName);
  };

  const handleYOBChange = (YOB: string) => {
    setYOBError(false);
    setYOBErrorMessage("");
    setYOB(YOB);
  };

  const handleGoogleLogin = () => {};

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImgBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full grid grid-cols-2 h-[100vh]">
      <div className="w-full flex items-center justify-center">
        <div className="register-form p-10 w-[485px] flex flex-col items-center">
          <img src={Logo} className="w-[175px] h-[95px]" alt="" />

          <div className="w-full register-form__input mb-1">
            <div className="register-form__input-label">
              <p>Email: </p>
            </div>
            <TextField
              className="register-form__input-value"
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
              placeholder="Ex: example@gmail.com"
              variant="standard"
              onChange={(e) => handleEmailChange(e.target.value)}
            />
          </div>

          <div className="w-full register-form__input mb-1">
            <div className="register-form__input-label">
              <p>Họ và Tên: </p>
            </div>
            <TextField
              className="register-form__input-value"
              value={fullName}
              error={fullNameError}
              helperText={fullNameErrorMessage}
              type="text"
              fullWidth
              sx={{
                "& .MuiInput-underline:before": {
                  display: "none", // Loại bỏ gạch chân dưới
                },
                "& .MuiInput-underline:after": {
                  display: "none", // Loại bỏ gạch chân dưới khi focus
                },
              }}
              placeholder="Ex: Nguyen Van A"
              variant="standard"
              onChange={(e) => handleFullNameChange(e.target.value)}
            />
          </div>

          <div className="w-full register-form__input mb-1">
            <div className="register-form__input-label">
              <p>Ngày sinh: </p>
            </div>
            <TextField
              className="register-form__input-value"
              value={YOB}
              error={YOBError}
              helperText={YOBErrorMessage}
              type="date"
              fullWidth
              sx={{
                "& .MuiInput-underline:before": {
                  display: "none", // Loại bỏ gạch chân dưới
                },
                "& .MuiInput-underline:after": {
                  display: "none", // Loại bỏ gạch chân dưới khi focus
                },
              }}
              placeholder="Ex: 01/01/2025"
              variant="standard"
              onChange={(e) => handleYOBChange(e.target.value)}
            />
          </div>

          <div className="w-full register-form__input mb-1">
            <div className="register-form__input-label">
              <p>SĐT: </p>
            </div>
            <PhoneInput
              inputStyle={{ border: "none" }}
              country={"vn"}
              value={phone}
              onChange={(phone) => setPhone(phone)}
            />
            {phoneError && (
              <div style={{ color: "red", fontSize: "12px" }}>
                {phoneErrorMessage}
              </div>
            )}
          </div>

          {/* <div className="w-full register-form__input mb-1">
            <div className="register-form__input-label">
              <p>Địa chỉ: </p>
            </div>
            <TextField
              className="register-form__input-value"
              value={address}
              fullWidth
              sx={{
                "& .MuiInput-underline:before": {
                  display: "none",
                },
                "& .MuiInput-underline:after": {
                  display: "none",
                },
              }}
              placeholder="Địa chỉ của bạn"
              variant="standard"
              onChange={(e) => setAddress(e.target.value)}
            />
          </div> */}

          <div className="w-full register-form__gender mb-1">
            <label className="register-form__gender-label">Giới tính:</label>
            <div>
              <input
                type="checkbox"
                className="register-form__gender-checkbox mr-1"
                checked={gender === "male"}
                onChange={() => setGender("male")}
              />
              <label>Nam</label>
            </div>
            <div>
              <input
                type="checkbox"
                className="register-form__gender-checkbox mr-1"
                checked={gender === "female"}
                onChange={() => setGender("female")}
              />
              <label>Nữ</label>
            </div>
          </div>

          <div className="w-full flex items-center justify-start register-form__upload mb-1">
            <input
              type="file"
              className="register-form__upload-button"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleImageUpload(e.target.files[0]);
                }
              }}
            />
            {imgBase64 && (
              <img
                src={imgBase64}
                alt="Preview"
                className="w-[50px] h-[50px]"
              />
            )}
          </div>

          <div className="w-full register-form__input mb-1">
            <div className="register-form__input-label">
              <p>Password: </p>
            </div>
            <TextField
              className="register-form__input-value"
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
              placeholder="EX: ilovesurveytalk"
              variant="standard"
              onChange={(e) => handlePasswordChange(e.target.value)}
            />
          </div>

          <div className="w-full register-form__input mb-1">
            <div className="register-form__input-label">
              <p className="text-[11px]">Re-Password: </p>
            </div>
            <TextField
              className="register-form__input-value"
              fullWidth
              sx={{
                "& .MuiInput-underline:before": {
                  display: "none", // Loại bỏ gạch chân dưới
                },
                "& .MuiInput-underline:after": {
                  display: "none", // Loại bỏ gạch chân dưới khi focus
                },
              }}
              value={rePassword}
              type="password"
              placeholder="Re-Enter your password"
              variant="standard"
              onChange={(e) => setRePassword(e.target.value)}
            />
          </div>

          <div className="actions w-full mb-2">
            <div className="actions__no-account w-full flex items-center justify-end">
              <p
                onClick={() => navigate("/login")}
                className="text-[13px] font-bold"
              >
                Bạn đã có tài khoản?
              </p>
            </div>
          </div>

          <button
            onClick={() => handleRegisterMember()}
            className="register-form__button mb-5"
          >
            TẠO TÀI KHOẢN
          </button>

          <div className="oauth ">
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
      <div className="register-right-decoration flex w-full h-full justify-end items-center">
        <div className="register-right-decoration__shape bg-cover">
          <img
            className="register-right-decoration__shape__img"
            src={RegisGif}
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default RegistersPage;
