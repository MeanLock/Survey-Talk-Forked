import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"; // Corrected import for React Router
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify"; // Assuming toast is already configured
// import { callAxiosRestApi } from "@/core/api/rest-api/main/api-call";
import {
  loginRequiredAxiosInstance,
  publicAxiosInstance,
} from "@/core/api/rest-api/config/instances/v2";
import { callAxiosRestApi } from "@/core/api/rest-api/main/api-call";

const AccountVerification: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Corrected hook for React Router
  const email = searchParams.get("email") || "của bạn"; // Default text if email is not in query

  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);

  // Concatenate OTP digits into a single string
  const verificationCode = otpDigits.join("");

  useEffect(() => {
    // Focus the first input on component mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    // Automatically trigger verification if all 6 digits are entered
    if (verificationCode.length === 6 && !isVerifying) {
      handleAccountVerificationCode();
    }
  }, [verificationCode]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleOtpChange = (index: number, value: string) => {
    const newOtpDigits = [...otpDigits];

    if (value.length > 1) {
      // Handle paste event
      const pasted = value.substring(0, 6);
      for (let i = 0; i < pasted.length; i++) {
        if (i < 6 && pasted[i].match(/^\d$/)) {
          newOtpDigits[i] = pasted[i];
        }
      }
      setOtpDigits(newOtpDigits);
      // Move focus to the last pasted digit's input or the last input if all 6 are filled
      const nextFocusIndex = Math.min(pasted.length - 1, 5);
      if (inputRefs.current[nextFocusIndex]) {
        inputRefs.current[nextFocusIndex]?.focus();
      }
    } else if (value.match(/^\d*$/)) {
      // Only allow digits
      newOtpDigits[index] = value;
      setOtpDigits(newOtpDigits);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleAccountVerificationCode = async () => {
    if (verificationCode.length !== 6) {
      toast.error("Vui lòng nhập đủ 6 số mã xác thực.");
      return;
    }

    setIsVerifying(true);
    try {
      const response = await callAxiosRestApi({
        instance: publicAxiosInstance,
        method: "post",
        url: "User/auth/account-verification",
        data: { Email: email, VerifyCode: verificationCode },
      });

      if (response && response.success) {
        toast.success("Xác thực thành công, chào mừng bạn tới với SurveyTalk!");
        navigate("/login"); // Navigate to home page using react-router-dom
      } else {
        if (!response) {
          toast.error("Có lỗi xảy ra, vui lòng thử lại");
        } else {
          toast.error(
            response.data.message ||
              "Mã xác thực không hợp lệ. Vui lòng thử lại."
          );
        }
      }
    } catch (error) {
      console.error("Error while verification: ", error);
      toast.error(
        "Đã xảy ra lỗi trong quá trình xác thực. Vui lòng thử lại sau."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white">
        <CardHeader className="text-center space-y-2 pb-6">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-3xl font-bold text-[#3E5DAB]">
            Chào mừng bạn!
          </CardTitle>
          <CardDescription className="text-gray-600 text-base">
            Vui lòng nhập mã xác thực đã được gửi tới email{" "}
            <span className="font-semibold text-[#3E5DAB]">{email}</span> để
            hoàn tất đăng ký.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center gap-2">
            {otpDigits.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => (inputRefs.current[index] = el) as any}
                type="text" // Use text to allow paste, then validate
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-md focus:border-[#3E5DAB] focus:ring-[#3E5DAB] transition-all duration-200"
                inputMode="numeric" // Suggest numeric keyboard on mobile
                pattern="[0-9]" // HTML5 pattern for numeric input
                autoComplete="one-time-code" // For autofill on some browsers
                disabled={isVerifying}
              />
            ))}
          </div>
          <Button
            onClick={handleAccountVerificationCode}
            disabled={isVerifying || verificationCode.length !== 6}
            className="w-full bg-gradient-to-r from-[#3E5DAB] to-blue-600 hover:from-blue-600 hover:to-[#3E5DAB] text-white py-3 text-lg font-semibold shadow-lg transition-all duration-300"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Đang xác thực...
              </>
            ) : (
              <>
                <Mail className="w-5 h-5 mr-2" />
                Xác thực tài khoản
              </>
            )}
          </Button>
          <p className="text-center text-sm text-gray-500 mt-4">
            Chưa nhận được mã?{" "}
            <span className="text-[#3E5DAB] font-medium cursor-pointer hover:underline">
              Gửi lại mã
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountVerification;
