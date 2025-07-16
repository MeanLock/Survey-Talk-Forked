import { useState, type FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { callAxiosRestApi } from "../../../core/api/rest-api/main/api-call";
import { publicAxiosInstance } from "../../../core/api/rest-api/config/instances/v2";
import { errorAlert, successAlert } from "../../../core/utils/alert.util";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import RegisGif from "../../../assets/Image/Register/Regis.gif";
import Swal from "sweetalert2";
import Logo from "../../../assets/Image/Logo/logo.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Facebook, Mail, Upload, Eye, EyeOff } from "lucide-react";

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

const formSchema = z
  .object({
    email: z.string().email("Email không hợp lệ"),
    fullName: z
      .string()
      .min(2, "Tên phải có ít nhất 2 ký tự")
      .regex(/^[A-Z]/, "Chữ cái đầu tiên phải viết hoa"),
    YOB: z.string().min(1, "Ngày sinh không được để trống"),
    phone: z
      .string()
      .min(10, "Số điện thoại phải có từ 10 đến 15 chữ số")
      .max(15, "Số điện thoại phải có từ 10 đến 15 chữ số"),
    password: z
      .string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .regex(
        /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{6,}$/,
        "Mật khẩu phải có ít nhất 1 ký tự viết hoa, 1 ký tự đặc biệt và ít nhất 6 ký tự"
      ),
    rePassword: z.string(),
    gender: z.enum(["male", "female"]),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Nhập lại mật khẩu không khớp!",
    path: ["rePassword"],
  });

interface RegisterPageProps {
  disableCustomTheme?: boolean;
}

const RegistersPage: FC<RegisterPageProps> = (props) => {
  // REDUX
  const dispatch = useDispatch();

  // STATES
  const [loading, setLoading] = useState(false);
  const [imgBase64, setImgBase64] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  // HOOKS
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      fullName: "",
      YOB: "",
      phone: "",
      password: "",
      rePassword: "",
      gender: "male",
    },
  });

  const handleRegisterMember = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    // Gọi API
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
      // Hiển thị thông báo đăng ký thành công
      await successAlert(
        "Đăng ký tài khoản thành công, vui lòng xác thực tài khoản."
      );

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
        handleRegisterMember(values); // Gọi lại hàm đăng ký để người dùng nhập lại mã
      }
    } else if (!addMember.isAppError) {
      errorAlert(addMember.message.content + ". Vui lòng thử lại!");
    }
    setLoading(false);
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
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Ex: example@gmail.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và Tên</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Ex: Nguyen Van A"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="YOB"
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

                <FormField
                  control={form.control}
                  name="phone"
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
                      className="flex items-center space-x-2"
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
                        if (e.target.files?.[0]) {
                          handleImageUpload(e.target.files[0]);
                        }
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
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="EX: ilovesurveytalk"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
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
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Re-Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showRePassword ? "text" : "password"}
                            placeholder="Re-Enter your password"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
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
                    className="text-sm font-bold p-0 h-auto"
                  >
                    Bạn đã có tài khoản?
                  </Button>
                </div>

                <Button
                  type="submit"
                  variant="default"
                  className="w-full mb-4"
                  disabled={loading}
                >
                  {loading ? "ĐANG TẠO..." : "TẠO TÀI KHOẢN"}
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
                <Button variant="outline" size="icon" className="h-12 w-12">
                  <Facebook className="h-6 w-6 text-blue-600" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12"
                  onClick={() => handleGoogleLogin()}
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
