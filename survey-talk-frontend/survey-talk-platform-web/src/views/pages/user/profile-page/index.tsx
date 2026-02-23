import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/rootReducer";
import { useGetAccountDetails } from "@/services/Profile/get-account-details";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, Lock, LogOut, Eye, EyeOff } from "lucide-react";
import { callAxiosRestApi } from "@/core/api/rest-api/main/api-call";
import { loginRequiredAxiosInstance } from "@/core/api/rest-api/config/instances/v2";
import EditIcon from "@mui/icons-material/Edit";
import NotFoundImg from "@/assets/Image/Logo/notfound.png";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { clearAuthToken } from "@/redux/auth/authSlice";

// Loading component placeholder
const SurveyTalkLoading = () => (
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
);

const ProfilePage = () => {
  // STATES
  const [showMode, setShowMode] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const dispatch = useDispatch();

  // TEST ERROR: Uncomment the line below to trigger "Cannot read properties" error
  // const testError = null.someProperty.anotherProperty; // This will throw immediately

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const user = useSelector((state: RootState) => state.auth.user);
  const userId = Number(user.Id);
  const { data: userProfiles, isLoading: isLoadingProfiles } =
    useGetAccountDetails({});

  useEffect(() => {
    if (userProfiles) {
      setFormData({
        fullName: userProfiles.FullName || "",
        email: userProfiles.Email || "",
        phone: userProfiles.Phone || "",
        dob: userProfiles.Dob ? userProfiles.Dob.split("T")[0] : "",
        gender: userProfiles.Gender || "",
        address: userProfiles.Address || "",
      });
    }
  }, [userProfiles]);

  const navigate = useNavigate();
  useEffect(() => {
    setIsChanged(checkIfChanged(formData));
  }, [formData, userProfiles]);

  const checkIfChanged = (newFormData: typeof formData) => {
    if (!userProfiles) return false;

    return (
      newFormData.fullName !== (userProfiles.FullName || "") ||
      newFormData.phone !== (userProfiles.Phone || "") ||
      newFormData.dob !==
        (userProfiles.Dob ? userProfiles.Dob.split("T")[0] : "") ||
      newFormData.gender !== (userProfiles.Gender || "") ||
      newFormData.address !== (userProfiles.Address || "")
    );
  };

  // Handler functions
  const handleProfileUpdate = async () => {
    const response = await callAxiosRestApi({
      instance: loginRequiredAxiosInstance,
      method: "put",
      url: `User/accounts/${userId}`,
      data: {
        FullName: formData.fullName,
        Dob: formData.dob,
        Gender: formData.gender,
        Phone: formData.phone,
      },
    });
    if (response && response.success) {
      toast.success("Cập nhật thông tin thành công!");
      navigate(0);
    } else {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau ...");
    }
    //console.log("Updating profile with data:", formData);
    // TODO: Implement actual update logic
  };

  const handlePasswordChange = () => {
    //console.log("Changing password:", passwordData);
    // TODO: Implement actual password change logic
  };

  const handleLogout = () => {
    dispatch(clearAuthToken());
    navigate("/login");
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result?.toString().split(",")[1]; // remove "data:image/xxx;base64,"
      if (base64) {
        handleUploadAvatar(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadAvatar = async (base64: string) => {
    try {
      const response = await callAxiosRestApi({
        instance: loginRequiredAxiosInstance,
        method: "put",
        url: `User/accounts/${userId}`,
        data: {
          FullName: formData.fullName,
          Dob: formData.dob,
          Gender: formData.gender,
          Phone: formData.phone,
          ImageBase64: base64,
        },
      });
      if (response && response.success) {
        toast.success("Cập nhật ảnh thành công!");
        navigate(0);
      }
      // Optionally refetch profile data or update state
    } catch (error) {
      console.error("Upload avatar failed:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordInputChange = (field: string, value: string) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetChanges = () => {
    if (userProfiles) {
      const resetData = {
        fullName: userProfiles.FullName || "",
        email: userProfiles.Email || "",
        phone: userProfiles.Phone || "",
        dob: userProfiles.Dob ? userProfiles.Dob.split("T")[0] : "",
        gender: userProfiles.Gender || "",
        address: userProfiles.Address || "",
      };
      setFormData(resetData);
      setIsChanged(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-start p-10 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between w-full mb-10">
        <p className="font-bold text-[36px] text-[#3e5dab]">
          Trang quản lý thông tin cá nhân
        </p>
      </div>

      {isLoadingProfiles ? (
        <div className="w-full h-56 flex flex-col items-center justify-center">
          <SurveyTalkLoading />
          <p className="font-bold text-2xl mt-4">Đang tìm kiếm chính bạn!</p>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-10 w-full">
          {/* Left Sidebar */}
          <div className="col-span-3">
            <Card className="w-full">
              <CardContent className="flex flex-col items-center p-6">
                {/* <Avatar className="w-[150px] h-[150px] mb-5">
                  <AvatarImage
                    src={userProfiles?.MainImageUrl || "/placeholder.svg"}
                    alt={userProfiles?.FullName}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-2xl">
                    {userProfiles?.FullName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar> */}

                <div className="relative w-[150px] h-[150px] mb-5">
                  <Avatar className="w-full h-full">
                    <AvatarImage
                      src={userProfiles?.MainImageUrl || "/placeholder.svg"}
                      alt={userProfiles?.FullName}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-2xl">
                      {userProfiles?.FullName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <label htmlFor="avatarUpload">
                    <div className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow cursor-pointer hover:bg-gray-100">
                      <EditIcon fontSize="small" className="text-gray-700" />
                    </div>
                  </label>
                  <input
                    id="avatarUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>

                <h2 className="text-2xl font-semibold mb-1">
                  {userProfiles?.FullName}
                </h2>
                <p className="text-md font-light text-gray-600 mb-6">
                  Customer
                </p>

                <div className="w-full space-y-2">
                  <div
                    onClick={() => setShowMode("profile")}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      showMode === "profile"
                        ? "bg-blue-100 text-blue-700"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <User size={20} />
                    <span>Thông tin cá nhân</span>
                  </div>

                  <div
                    onClick={() => setShowMode("security")}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      showMode === "security"
                        ? "bg-blue-100 text-blue-700"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <Lock size={20} />
                    <span>Mật khẩu & Bảo mật</span>
                  </div>

                  <Separator className="my-2" />

                  <div
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <LogOut size={20} />
                    <span>Đăng xuất</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Content */}
          <div className="col-span-9">
            <Card>
              <CardContent className="p-8">
                {showMode === "profile" && (
                  <div>
                    <h3 className="text-2xl font-semibold mb-6">
                      Thông Tin Cá Nhân
                    </h3>

                    <div className="space-y-6">
                      {/* Gender Selection */}
                      <div>
                        {/* <Label className="text-base font-medium mb-3 block">
                          Giới tính
                        </Label> */}
                        <RadioGroup
                          value={formData.gender}
                          onValueChange={(value) =>
                            handleInputChange("gender", value)
                          }
                          className="flex gap-6"
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
                      </div>

                      {/* Full Name */}
                      <div>
                        <Label
                          htmlFor="fullName"
                          className="text-base font-medium"
                        >
                          Họ và Tên
                        </Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) =>
                            handleInputChange("fullName", e.target.value)
                          }
                          className="mt-2"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <Label
                          htmlFor="email"
                          className="text-base font-medium"
                        >
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          disabled
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className="mt-2"
                        />
                      </div>

                      {/* Phone and Date of Birth */}
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <Label
                            htmlFor="phone"
                            className="text-base font-medium"
                          >
                            Phone Number
                          </Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) =>
                              handleInputChange("phone", e.target.value)
                            }
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="dob"
                            className="text-base font-medium"
                          >
                            Date of Birth
                          </Label>
                          <Input
                            id="dob"
                            type="date"
                            value={formData.dob}
                            onChange={(e) =>
                              handleInputChange("dob", e.target.value)
                            }
                            className="mt-2"
                          />
                        </div>
                      </div>

                      {/* Address */}
                      {/* <div>
                        <Label
                          htmlFor="address"
                          className="text-base font-medium"
                        >
                          Địa chỉ
                        </Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) =>
                            handleInputChange("address", e.target.value)
                          }
                          className="mt-2"
                        />
                      </div> */}

                      {/* Action Buttons */}
                      <div className="flex gap-4 pt-6">
                        <Button
                          variant="outline"
                          onClick={resetChanges}
                          className="px-8 bg-transparent"
                        >
                          Bỏ các thay đổi
                        </Button>
                        <Button
                          onClick={handleProfileUpdate}
                          className="px-8 !bg-[#3e5dab] !hover:bg-[#2d4491] !text-white"
                          disabled={!isChanged}
                        >
                          Lưu các thay đổi
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {showMode === "security" && (
                  <div>
                    <h3 className="text-2xl font-semibold mb-6">
                      Bảo mật & Mật Khẩu
                    </h3>

                    {/* <div className="space-y-6 max-w-md">
                    
                      <div>
                        <Label
                          htmlFor="currentPassword"
                          className="text-base font-medium"
                        >
                          Mật khẩu hiện tại
                        </Label>
                        <div className="relative mt-2">
                          <Input
                            id="currentPassword"
                            type={showPassword ? "text" : "password"}
                            value={passwordData.currentPassword}
                            onChange={(e) =>
                              handlePasswordInputChange(
                                "currentPassword",
                                e.target.value
                              )
                            }
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? (
                              <EyeOff size={20} />
                            ) : (
                              <Eye size={20} />
                            )}
                          </button>
                        </div>
                      </div>

                     
                      <div>
                        <Label
                          htmlFor="newPassword"
                          className="text-base font-medium"
                        >
                          Mật khẩu mới
                        </Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            handlePasswordInputChange(
                              "newPassword",
                              e.target.value
                            )
                          }
                          className="mt-2"
                        />
                      </div>

                     
                      <div>
                        <Label
                          htmlFor="confirmPassword"
                          className="text-base font-medium"
                        >
                          Xác nhận mật khẩu mới
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            handlePasswordInputChange(
                              "confirmPassword",
                              e.target.value
                            )
                          }
                          className="mt-2"
                        />
                      </div>

                    
                      <div className="pt-6">
                        <Button
                          onClick={handlePasswordChange}
                          className="w-full bg-[#3e5dab] hover:bg-[#2d4491]"
                        >
                          Đổi Mật Khẩu
                        </Button>
                      </div>
                    </div> */}

                    <div className="flex flex-col items-center gap-2">
                      <img src={NotFoundImg} className="w-[300px] h-[300px]" />
                      <p className="font-semibold text-xl text-gray-400">
                        Comming soon...
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
