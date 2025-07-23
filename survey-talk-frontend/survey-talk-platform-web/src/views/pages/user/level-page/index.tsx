"use client";

import { useGetAccountDetails } from "@/services/Profile/get-account-details";
import "./styles.scss";
import SurveyTalkLoading from "@/views/components/common/loading";
import { useEffect, useState } from "react";
import { callAxiosRestApi } from "@/core/api/rest-api/main/api-call";
import { loginRequiredAxiosInstance } from "@/core/api/rest-api/config/instances/v2";
import { Button } from "@mui/material";
import { SurveyCard } from "./components/SurveyCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Trophy,
  Star,
  Zap,
  TrendingUp,
  Award,
  Loader2,
  Sparkles,
  Target,
} from "lucide-react";
import { LevelProgressBar } from "./components/LevelProgressBar";
import NotFoundImg from "@/assets/Image/Logo/notfound.png";

const LevelPage = () => {
  const [isCanUpLevel, setIsCanUpLevel] = useState(false);
  const [isShowUpdateLevelSurvey, setIsShowUpdateLevelSurvey] = useState(false);
  const [updateLevelSurvey, setUpdateLevelSurvey] = useState(null);
  const [isLoadingSurvey, setIsLoadingSurvey] = useState(false);

  const { data: userProfiles, isLoading: isLoadingProfiles } =
    useGetAccountDetails({});

  // HOOKS
  useEffect(() => {
    setUpdateLevelSurvey(null);
    setIsShowUpdateLevelSurvey(false);
    if (userProfiles) {
      const TheoryXP = userProfiles.Level * 100;
      if (TheoryXP < userProfiles.Xp) {
        setIsCanUpLevel(true);
      } else {
        setIsCanUpLevel(false);
      }
    }
  }, [userProfiles]);

  // FUNCTIONS
  const handleGetUpdateLevelSurveys = async () => {
    setIsLoadingSurvey(true);
    try {
      const response = await callAxiosRestApi({
        instance: loginRequiredAxiosInstance,
        method: "get",
        url: `Survey/core/level-update-community-survey`,
      });
      if (response && response.success) {
        setUpdateLevelSurvey(response.data.Survey);
        setIsShowUpdateLevelSurvey(true);
      }
    } catch (error) {
      //console.log("Error: ", error);
    } finally {
      setIsLoadingSurvey(false);
    }
  };

  const getXpForNextLevel = () => {
    return (userProfiles.Level + 1) * 100;
  };

  const getCurrentLevelXp = () => {
    return userProfiles.Level * 100;
  };

  const getProgressPercentage = () => {
    const currentLevelXp = getCurrentLevelXp();
    const nextLevelXp = getXpForNextLevel();
    const progressInCurrentLevel = userProfiles.Xp - currentLevelXp;
    const xpNeededForCurrentLevel = nextLevelXp - currentLevelXp;
;
    return Math.min(
      (userProfiles.Xp / xpNeededForCurrentLevel) * 100,
      100
    );
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-[#3E5DAB] flex items-center justify-center gap-3">
            Trang Quản Lý Level
          </h1>
          <p className="text-gray-600 text-lg">
            Theo dõi tiến trình và nâng cấp level của bạn
          </p>
        </div>

        {isLoadingProfiles ? (
          <div className="flex flex-col items-center justify-center h-96 space-y-4">
            <SurveyTalkLoading />
            <p className="text-xl font-semibold text-gray-700">
              Đang lấy cấp độ của bạn...
            </p>
          </div>
        ) : (
          <>
            {/* Level Information Card */}
            <Card className="shadow-xl border-0 bg-gradient-to-r from-white to-blue-50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-2xl text-[#3E5DAB]">
                  <Award className="w-7 h-7 text-[#FFC40D]" />
                  Thông Tin Level Hiện Tại
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Current Level */}
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-r from-[#3E5DAB] to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-bold text-white">
                        {userProfiles.Level}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Cấp độ hiện tại</p>
                  </div>

                  {/* Current XP */}
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <Zap className="w-6 h-6 text-[#FFC40D]" />
                      <span className="text-3xl font-bold text-[#3E5DAB]">
                        {userProfiles.Xp}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">XP hiện tại</p>
                  </div>

                  {/* Next Level XP */}
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <Target className="w-6 h-6 text-green-500" />
                      <span className="text-2xl font-bold text-green-600">
                        {getXpForNextLevel() - getCurrentLevelXp() - userProfiles.Xp}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      XP cần cho level tiếp theo
                    </p>
                  </div>
                </div>
                <Separator />
                {/* Progress to Next Level */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      Tiến trình đến Level {userProfiles.Level + 1}
                    </span>
                    <span className="text-sm text-gray-500">
                      {userProfiles.Xp}/
                      {getXpForNextLevel() - getCurrentLevelXp()} XP
                    </span>
                  </div>
                  <Progress
                    value={getProgressPercentage()}
                    className="h-3 bg-gray-200"
                  />
                </div>

                {/* Can Level Up Section */}
                {isCanUpLevel && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-green-600" />
                      <p className="font-semibold text-green-800">
                        Chúc mừng! Bạn có thể nâng cấp level!
                      </p>
                    </div>
                    <p className="text-green-700 text-sm">
                      Bạn đã có thể nâng Level bằng việc làm thêm các Survey
                      Update Level
                    </p>
                    <Button
                      onClick={handleGetUpdateLevelSurveys}
                      disabled={isLoadingSurvey}
                      variant="contained"
                      sx={{
                        background: "linear-gradient(45deg, #16a34a, #059669)",
                        "&:hover": {
                          background:
                            "linear-gradient(45deg, #15803d, #047857)",
                        },
                        color: "white",
                        fontWeight: "600",
                        textTransform: "none",
                        borderRadius: "8px",
                        padding: "8px 16px",
                      }}
                    >
                      {isLoadingSurvey ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Đang tải...
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Làm khảo sát ngay
                        </>
                      )}
                    </Button>

                    {/* No Survey Available Message */}
                    {isShowUpdateLevelSurvey && !updateLevelSurvey && (
                      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-4 mt-4">
                        <div className="flex flex-col justify-center items-center gap-2">
                          <img
                            src={NotFoundImg}
                            className="w-[100px] h-[100px] object-cover"
                          />
                          <p className="font-semibold text-orange-800">
                            Hiện chưa có Survey nào để nâng cấp
                          </p>
                        </div>
                        <p className="text-orange-700 text-sm mt-2">
                          Vui lòng đợi trong tương lai. Chúng tôi sẽ cập nhật
                          thêm các survey mới để bạn có thể nâng cấp level!
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Level Progress Bar */}
            <Card className="shadow-xl border-0 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-[#3E5DAB]">
                  <Star className="w-6 h-6 text-[#FFC40D]" />
                  Tiến Trình Level Tổng Quan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LevelProgressBar
                  currentLevel={userProfiles.Level}
                  currentXp={userProfiles.Xp}
                />
              </CardContent>
            </Card>

            {/* Survey Update Level */}
            {isShowUpdateLevelSurvey && updateLevelSurvey && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[#3E5DAB] text-center">
                  Khảo Sát Nâng Cấp Level
                </h2>
                <div className="flex justify-center">
                  <SurveyCard data={updateLevelSurvey} />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LevelPage;
