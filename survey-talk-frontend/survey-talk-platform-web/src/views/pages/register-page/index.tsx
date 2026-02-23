import type { FC } from "react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { callAxiosRestApi } from "@/core/api/rest-api/main/api-call";
import { publicAxiosInstance } from "@/core/api/rest-api/config/instances/v2";
import { errorAlert } from "@/core/utils/alert.util"; // Assuming these are custom utilities
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import RegisGif from "@/assets/Image/Register/Regis.gif"; // Assuming correct path
import Logo from "@/assets/Image/Logo/logo.png"; // Assuming correct path
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Facebook, Mail, Upload, Eye, EyeOff, Loader2 } from "lucide-react";

// SHADCN UI
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface RegisterPageProps {
  disableCustomTheme?: boolean;
}

type RegisterFormValues = {
  email: string;
  fullName: string;
  YOB: string;
  phone: string;
  password: string;
  rePassword: string;
  gender: string;
};

const RegistersPage: FC<RegisterPageProps> = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imgBase64, setImgBase64] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const form = useForm<RegisterFormValues>({
    defaultValues: {
      email: "",
      fullName: "",
      YOB: "",
      phone: "",
      password: "",
      rePassword: "",
      gender: "male",
    },
    mode: "onBlur",
  });

  const handleRegisterMember = async (values: RegisterFormValues) => {
    if (values.password !== values.rePassword) {
      errorAlert("Nhập lại mật khẩu không khớp!");
      return;
    }
    setLoading(true);
    const addMember = await callAxiosRestApi({
      instance: publicAxiosInstance,
      method: "post",
      url: "User/auth/register/customer",
      data: {
        RegisterInfo: {
          Email: values.email,
          Password: values.password,
          FullName: values.fullName,
          Dob: values.YOB,
          Gender: values.gender,
          Address: null,
          Phone: values.phone,
          ImageBase64: imgBase64,
        },
      },
    });
    if (addMember.success) {
      navigate(`/account-verification?email=${values.email}`);
    } else if (!addMember.isAppError) {
      errorAlert(addMember.message.content + ". Vui lòng thử lại!");
    }
    setLoading(false);
  };

  const handleGoogleLogin = () => {
    // Logic for Google Login
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImgBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-gray-50">
      <div className="hidden lg:flex w-full h-full items-center justify-center bg-[#3e5dab]">
        <div className="w-full h-full flex items-center justify-center p-8">
          <img
            className="max-w-full max-h-full object-contain"
            src={RegisGif || "/placeholder.svg"}
            alt="Registration decoration"
          />
        </div>
      </div>
      <div className="w-full flex items-center justify-center p-4 lg:p-8">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center pb-4">
            <img
              src={Logo || "/placeholder.svg"}
              className="w-[120px] h-[65px] mx-auto mb-2 object-contain"
              alt="Logo"
            />
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleRegisterMember)}
                className="space-y-3"
              >
                <FormField
                  control={form.control}
                  name="email"
                  rules={{
                    required: "Email là bắt buộc",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Email không hợp lệ",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fullName"
                  rules={{
                    required: "Họ tên là bắt buộc",
                    minLength: {
                      value: 2,
                      message: "Tên phải có ít nhất 2 ký tự",
                    },
                    pattern: {
                      value: /^[A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯẠ-ỹ]/,
                      message: "Chữ cái đầu tiên phải viết hoa",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và Tên</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="YOB"
                  rules={{ required: "Ngày sinh là bắt buộc" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày sinh</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Controller
                  control={form.control}
                  name="phone"
                  rules={{
                    required: "Số điện thoại là bắt buộc",
                    minLength: { value: 10, message: "Tối thiểu 10 chữ số" },
                    maxLength: { value: 15, message: "Tối đa 15 chữ số" },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SĐT</FormLabel>
                      <FormControl>
                        <PhoneInput
                          inputStyle={{
                            border: "1px solid #e2e8f0",
                            borderRadius: "6px",
                            width: "100%",
                            height: "40px",
                            fontSize: "14px",
                          }}
                          country={"vn"}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giới tính</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-row space-x-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="male" id="male" />
                            <Label htmlFor="male">Nam</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="female" id="female" />
                            <Label htmlFor="female">Nữ</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <Label>Ảnh đại diện</Label>
                  <div className="flex items-center space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        document.getElementById("image-upload")?.click()
                      }
                      className="flex items-center space-x-2 !bg-transparent !border-[#3e5dab] !text-[#3e5dab] !hover:bg-[#3e5dab]/10"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Chọn ảnh</span>
                    </Button>
                    <input
                      id="image-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0])
                          handleImageUpload(e.target.files[0]);
                      }}
                    />
                    {imgBase64 && (
                      <img
                        src={imgBase64 || "/placeholder.svg"}
                        alt="Preview"
                        className="w-[50px] h-[50px] rounded-full object-cover"
                      />
                    )}
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="password"
                  rules={{
                    required: "Mật khẩu là bắt buộc",
                    pattern: {
                      value: /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{6,}$/,
                      message:
                        "Ít nhất 1 chữ in hoa, 1 ký tự đặc biệt và 6 ký tự",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 !bg-[#3e5dab]/50 !text-white"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rePassword"
                  rules={{
                    required: "Vui lòng nhập lại mật khẩu",
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nhập lại mật khẩu</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showRePassword ? "text" : "password"}
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 !bg-[#3e5dab]/50 !text-white"
                            onClick={() => setShowRePassword(!showRePassword)}
                          >
                            {showRePassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="w-full flex items-center justify-end mb-2">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => navigate("/login")}
                    className="text-sm font-bold p-0 h-auto !hover:bg-[#3e5dab]/50 !bg-transparent !text-[#3e5dab] !hover:text-[#3e5dab]/90"
                  >
                    Bạn đã có tài khoản?
                  </Button>
                </div>
                <Button
                  type="submit"
                  className="w-full mb-4 !bg-[#3e5dab] !text-white !hover:bg-[#3e5dab]/90"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ĐANG TẠO...
                    </>
                  ) : (
                    "TẠO TÀI KHOẢN"
                  )}
                </Button>
              </form>
            </Form>
            <div className="w-full">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <Separator className="flex-1" />
                <span className="text-sm text-muted-foreground">
                  hoặc đăng nhập với
                </span>
                <Separator className="flex-1" />
              </div>
              <div className="flex justify-center items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 !border-[#3e5dab] !text-[#3e5dab] !hover:bg-[#3e5dab]/10 bg-transparent"
                >
                  <Facebook className="h-6 w-6 text-blue-600" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 !border-[#3e5dab] !text-[#3e5dab] !hover:bg-[#3e5dab]/10 bg-transparent"
                  onClick={handleGoogleLogin}
                >
                  <Mail className="h-6 w-6 text-red-500" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegistersPage;
