"use client";

import { useEffect, useState, type FC } from "react";
import {
  Button,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Slider,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  IconButton,
  Grid,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import "./styles.scss";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useBlocker from "../../../../hooks/useBlocker";
import type { SurveyTaking } from "../../../../core/types";
import {
  SurveyTakingData,
  homeSurveysAlternativeData,
  homeSurveysData,
} from "../../../../core/mockData/mockData";
import SurveyTalkLoading from "../../../components/common/loading";
import CatImg from "../../../../assets/Image/Captcha/cat.jpg";
import Dog1Img from "../../../../assets/Image/Captcha/dog.jpg";
import Dog2Img from "../../../../assets/Image/Captcha/dog2.jpg";
import Dog3Img from "../../../../assets/Image/Captcha/dog3.jpg";
import { useDispatch, useSelector } from "react-redux";
import { updateAuthUser } from "../../../../redux/auth/authSlice";
import type { RootState } from "../../../../redux/rootReducer";
import { updateFakeData } from "../../../../redux/fake/fakeSlice";

type SurveyPageProps = {};

interface Answer {
  questionId: number;
  value: any;
}

// Define captcha types
enum CaptchaType {
  MATH = "math",
  IMAGE = "image",
}

// Define image captcha options
interface CaptchaImage {
  src: string;
  alt: string;
  isCorrect: boolean;
}

const SurveyPage: FC<SurveyPageProps> = () => {
  // STATES
  const [isLoading, setIsLoading] = useState(true);
  const [survey, setSurvey] = useState<SurveyTaking | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1); // -1 for intro page
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [canProceed, setCanProceed] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<any[]>([]);
  const [captchaQuestions, setCaptchaQuestions] = useState<number[]>([]);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaValue, setCaptchaValue] = useState({ a: 0, b: 0, result: 0 });
  const [captchaType, setCaptchaType] = useState<CaptchaType>(CaptchaType.MATH);
  const [captchaImages, setCaptchaImages] = useState<CaptchaImage[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [rankingSelections, setRankingSelections] = useState<{
    [key: number]: number;
  }>({});
  const [ecommerceQuestionAsked, setEcommerceQuestionAsked] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fake = useSelector((state: RootState) => state.fake);
  const user = useSelector((state: RootState) => state.auth.user);

  // HOOKS
  const useBlockNavigation = (enabled: boolean) => {
    useEffect(() => {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        if (!enabled) return;
        e.preventDefault();
        e.returnValue = "";
      };
      window.addEventListener("beforeunload", handleBeforeUnload);
      return () =>
        window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [enabled]);
  };
  useBlockNavigation(!isFinished);
  useBlocker(!isFinished);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && currentQuestionIndex >= 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && currentQuestionIndex >= 0) {
      setCanProceed(true);
    }
  }, [timeLeft, currentQuestionIndex]);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      fetchSurvey();
      setIsLoading(false);
    }, 2000);
  }, []);

  // FUNCTIONS
  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const fetchSurvey = () => {
    const surveyData = { ...SurveyTakingData };

    // Shuffle questions and options
    const shuffled = shuffleArray(surveyData.Questions).map((q) => ({
      ...q,
      Options: shuffleArray(q.Options),
    }));

    // Add duplicate e-commerce question with different order
    const ecommerceQuestion = shuffled.find(
      (q) => q.Content === "Sàn thương mại điện tử bạn hay dùng nhất?"
    );
    if (ecommerceQuestion) {
      const duplicateQuestion = {
        ...ecommerceQuestion,
        Id: ecommerceQuestion.Id + 1000,
        Options: shuffleArray([...ecommerceQuestion.Options]),
      };
      shuffled.push(duplicateQuestion);
    }

    setShuffledQuestions(shuffled);

    // Select 2 random questions for captcha
    const randomIndices: any = [];
    while (randomIndices.length < 2) {
      const randomIndex = Math.floor(Math.random() * shuffled.length);
      if (!randomIndices.includes(randomIndex)) {
        randomIndices.push(randomIndex);
      }
    }
    setCaptchaQuestions(randomIndices);

    setSurvey(surveyData);
  };

  const startSurvey = () => {
    setCurrentQuestionIndex(0);
    if (shuffledQuestions[0]) {
      setTimeLeft(shuffledQuestions[0].TimeLimit);
      setCanProceed(false);
    }
  };

  const generateMathCaptcha = () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setCaptchaValue({ a, b, result: a + b });
    setCaptchaAnswer("");
    setCaptchaType(CaptchaType.MATH);
  };

  const generateImageCaptcha = () => {
    // Create the captcha images array with cat and dogs
    const images: CaptchaImage[] = [
      { src: CatImg, alt: "Animal 1", isCorrect: true },
      { src: Dog1Img, alt: "Animal 2", isCorrect: false },
      { src: Dog2Img, alt: "Animal 3", isCorrect: false },
      { src: Dog3Img, alt: "Animal 4", isCorrect: false },
    ];

    // Shuffle the images
    const shuffledImages = shuffleArray(images);
    setCaptchaImages(shuffledImages);
    setSelectedImageIndex(null);
    setCaptchaType(CaptchaType.IMAGE);
  };

  const handleCaptchaSubmit = () => {
    if (captchaType === CaptchaType.MATH) {
      if (Number.parseInt(captchaAnswer) === captchaValue.result) {
        setShowCaptcha(false);
        proceedToNext();
      } else {
        Swal.fire("Sai rồi!", "Vui lòng thử lại", "error");
        generateMathCaptcha();
      }
    } else if (captchaType === CaptchaType.IMAGE) {
      if (
        selectedImageIndex !== null &&
        captchaImages[selectedImageIndex].isCorrect
      ) {
        setShowCaptcha(false);
        proceedToNext();
      } else {
        Swal.fire("Sai rồi!", "Vui lòng thử lại", "error");
        generateImageCaptcha();
      }
    }
  };

  const proceedToNext = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setTimeLeft(shuffledQuestions[nextIndex].TimeLimit);
      setCanProceed(false);
      setRankingSelections({});
    } else {
      setIsFinished(true);
    }
  };

  const handleNext = () => {
    // Check if current question needs captcha
    if (captchaQuestions.includes(currentQuestionIndex)) {
      // Randomly choose between math and image captcha
      const captchaChoice =
        Math.random() > 0.5 ? CaptchaType.MATH : CaptchaType.IMAGE;

      if (captchaChoice === CaptchaType.MATH) {
        generateMathCaptcha();
      } else {
        generateImageCaptcha();
      }

      setShowCaptcha(true);
      return;
    }

    proceedToNext();
  };

  const handleAnswerChange = (questionId: number, value: any) => {
    const existingAnswerIndex = answers.findIndex(
      (a) => a.questionId === questionId
    );
    if (existingAnswerIndex >= 0) {
      const newAnswers = [...answers];
      newAnswers[existingAnswerIndex] = { questionId, value };
      setAnswers(newAnswers);
    } else {
      setAnswers([...answers, { questionId, value }]);
    }

    if (!canProceed && timeLeft === 0) {
      setCanProceed(true);
    }
  };

  const handleRankingClick = (optionId: number) => {
    const currentRank = rankingSelections[optionId];
    const newSelections = { ...rankingSelections };

    if (currentRank) {
      // Remove this selection and adjust others
      delete newSelections[optionId];
      Object.keys(newSelections).forEach((key) => {
        const keyNum = Number.parseInt(key);
        if (newSelections[keyNum] > currentRank) {
          newSelections[keyNum]--;
        }
      });
    } else {
      // Add new selection
      const nextRank = Math.max(0, ...Object.values(newSelections)) + 1;
      newSelections[optionId] = nextRank;
    }

    setRankingSelections(newSelections);
    handleAnswerChange(
      shuffledQuestions[currentQuestionIndex].Id,
      newSelections
    );
  };

  const getCurrentAnswer = (questionId: number) => {
    return answers.find((a) => a.questionId === questionId)?.value;
  };

  const formatSliderValue = (value: number, unit: string) => {
    return `${value.toLocaleString()} ${unit}`;
  };

  const exitSurvey = () => {
    Swal.fire({
      title: "Bạn có chắc muốn thoát?",
      text: "Dữ liệu sẽ không được lưu!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Thoát",
      cancelButtonText: "Ở lại",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/home");
      }
    });
  };

  const handleFinish = () => {
    // Update balance and XP
    // const updatedUser = {
    //   ...auth.user,
    //   Balance: auth.user.Balance + 1700,
    //   Xp: auth.user.Xp + 50,
    // };

    // Dispatch updated user to Redux
    // dispatch(updateAuthUser(updatedUser));
    dispatch(
      updateAuthUser({
        Balance: user?.Balance + 1700,
        Xp: user?.Xp + 50,
        FullName: "Hoàng Minh Lôc",
      })
    );

    // Update homeSurveysData
    const updatedSurveys = homeSurveysData.suitYouBest.map((survey) =>
      survey.Id === 1
        ? {
            ...survey,
            Title: "Khảo sát về xu hướng mua nhà ở mặt đất tại Thành Phố Lớn",
            Description: "hehee",
            MainImageUrl:
              "https://i.pinimg.com/736x/ee/c9/39/eec939e4ce54ef01238dfc11d0a4f43e.jpg",
          }
        : survey
    );
    homeSurveysData.suitYouBest = updatedSurveys;

    // Navigate to /home
    navigate("/home");
  };

  if (isLoading) {
    return (
      <div className="w-full h-[100vh] flex flex-col gap-5 justify-center items-center">
        <SurveyTalkLoading />
        <p className="text-2xl loading-title">
          Chờ xíu nha, sắp có Khảo sát cho bạn làm rồi!
        </p>
      </div>
    );
  }

  if (!survey) return null;

  // Introduction Page
  if (currentQuestionIndex === -1) {
    return (
      <div className="survey-intro">
        <div className="intro-content flex flex-col items-center">
          <img
            src={survey.MainImageUrl || "/placeholder.svg"}
            alt="Survey"
            className="intro-image"
          />
          <h1 className="intro-title">{survey.Title}</h1>
          <p className="intro-description">{survey.Description}</p>
          <Button
            variant="contained"
            size="large"
            onClick={startSurvey}
            className="start-button"
          >
            Bắt Đầu Làm
          </Button>
        </div>
      </div>
    );
  }

  // Completion Page
  if (isFinished) {
    return (
      <div className="survey-complete">
        <div className="complete-content">
          <h1>🎉 Hoàn thành khảo sát!</h1>
          <p>Cảm ơn bạn đã tham gia khảo sát của chúng tôi.</p>
          <p>Số tiền bạn nhận được: 1700 points</p>
          <p>Số XP bạn nhận được là: 50 XP</p>
          <Button
            variant="contained"
            size="large"
            onClick={() => handleFinish()}
          >
            Về Trang Chủ
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const progress =
    ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100;
  const currentAnswer = getCurrentAnswer(currentQuestion.Id);

  return (
    <div className="survey-container">
      {/* Header */}
      <div className="survey-header">
        <IconButton onClick={exitSurvey} className="exit-button">
          <CloseIcon />
          <span>Thoát Phiên Làm</span>
        </IconButton>
      </div>

      {/* Content */}
      <div
        className="survey-content"
        style={{
          backgroundImage: `url(${survey.BackgroundImageUrl})`,
        }}
      >
        <div className="question-overlay">
          <div className="question-container">
            <h2 className="question-title">{currentQuestion.Content}</h2>
            {currentQuestion.Description && (
              <p className="question-description">
                {currentQuestion.Description}
              </p>
            )}

            {/* Question Type 1: Single Choice */}
            {currentQuestion.QuestionTypeId === 1 && (
              <RadioGroup
                value={currentAnswer || ""}
                onChange={(e) =>
                  handleAnswerChange(currentQuestion.Id, e.target.value)
                }
              >
                {currentQuestion.Options.map((option: any) => (
                  <div key={option.SurveyOptionId} className="option-container">
                    {option.MainImageUrl ? (
                      <div className="option-box-with-image">
                        <img
                          src={option.MainImageUrl || "/placeholder.svg"}
                          alt={option.Content}
                          className="option-image"
                        />
                        <span className="option-content">{option.Content}</span>
                        <Radio
                          value={option.SurveyOptionId.toString()}
                          className="option-radio"
                        />
                      </div>
                    ) : (
                      <div className="option-box">
                        <FormControlLabel
                          value={option.SurveyOptionId.toString()}
                          control={<Radio />}
                          label={option.Content}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </RadioGroup>
            )}

            {/* Question Type 2: Multiple Choice */}
            {currentQuestion.QuestionTypeId === 2 && (
              <FormGroup>
                {currentQuestion.Options.map((option: any) => (
                  <div key={option.SurveyOptionId} className="option-container">
                    {option.MainImageUrl ? (
                      <div className="option-box-with-image">
                        <img
                          src={option.MainImageUrl || "/placeholder.svg"}
                          alt={option.Content}
                          className="option-image"
                        />
                        <span className="option-content">{option.Content}</span>
                        <Checkbox
                          checked={(currentAnswer || []).includes(
                            option.SurveyOptionId.toString()
                          )}
                          onChange={(e) => {
                            const currentValues = currentAnswer || [];
                            const newValues = e.target.checked
                              ? [
                                  ...currentValues,
                                  option.SurveyOptionId.toString(),
                                ]
                              : currentValues.filter(
                                  (v: string) =>
                                    v !== option.SurveyOptionId.toString()
                                );
                            handleAnswerChange(currentQuestion.Id, newValues);
                          }}
                          className="option-checkbox"
                        />
                      </div>
                    ) : (
                      <div className="option-box">
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={(currentAnswer || []).includes(
                                option.SurveyOptionId.toString()
                              )}
                              onChange={(e) => {
                                const currentValues = currentAnswer || [];
                                const newValues = e.target.checked
                                  ? [
                                      ...currentValues,
                                      option.SurveyOptionId.toString(),
                                    ]
                                  : currentValues.filter(
                                      (v: string) =>
                                        v !== option.SurveyOptionId.toString()
                                    );
                                handleAnswerChange(
                                  currentQuestion.Id,
                                  newValues
                                );
                              }}
                            />
                          }
                          label={option.Content}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </FormGroup>
            )}

            {/* Question Type 3: Slider */}
            {currentQuestion.QuestionTypeId === 3 && (
              <div className="slider-container">
                <Slider
                  value={currentAnswer || currentQuestion.ConfigJson.Min}
                  min={currentQuestion.ConfigJson.Min}
                  max={currentQuestion.ConfigJson.Max}
                  step={currentQuestion.ConfigJson.Step}
                  onChange={(_, value) =>
                    handleAnswerChange(currentQuestion.Id, value)
                  }
                  valueLabelDisplay="on"
                  valueLabelFormat={(value) =>
                    formatSliderValue(value, currentQuestion.ConfigJson.Unit)
                  }
                />
                <div className="slider-labels">
                  <span>
                    {formatSliderValue(
                      currentQuestion.ConfigJson.Min,
                      currentQuestion.ConfigJson.Unit
                    )}
                  </span>
                  <span>
                    {formatSliderValue(
                      currentQuestion.ConfigJson.Max,
                      currentQuestion.ConfigJson.Unit
                    )}
                  </span>
                </div>
              </div>
            )}

            {/* Question Type 7: Ranking */}
            {currentQuestion.QuestionTypeId === 7 && (
              <div className="ranking-container">
                {currentQuestion.Options.map((option: any) => (
                  <div
                    key={option.SurveyOptionId}
                    className={`ranking-option ${
                      rankingSelections[option.SurveyOptionId] ? "selected" : ""
                    }`}
                    onClick={() => handleRankingClick(option.SurveyOptionId)}
                  >
                    <span className="ranking-number">
                      {rankingSelections[option.SurveyOptionId] || ""}
                    </span>
                    <span className="ranking-content">{option.Content}</span>
                  </div>
                ))}
              </div>
            )}

            <Button
              variant="contained"
              size="large"
              onClick={handleNext}
              disabled={!canProceed || timeLeft > 0}
              className="next-button"
            >
              {timeLeft > 0
                ? `Đợi ${timeLeft}s để tiếp tục`
                : currentQuestionIndex < shuffledQuestions.length - 1
                ? "Tiếp theo"
                : "Hoàn thành"}
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="survey-footer">
        <LinearProgress
          variant="determinate"
          value={progress}
          className="progress-bar"
        />
        <span className="progress-text">
          {currentQuestionIndex + 1} / {shuffledQuestions.length}
        </span>
      </div>

      {/* Math Captcha Dialog */}
      {captchaType === CaptchaType.MATH && (
        <Dialog open={showCaptcha} onClose={() => {}} maxWidth="xs">
          <DialogTitle>Xác thực</DialogTitle>
          <DialogContent>
            <Typography variant="h6" gutterBottom>
              {captchaValue.a} + {captchaValue.b} = ?
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label="Nhập kết quả"
              type="number"
              fullWidth
              variant="outlined"
              value={captchaAnswer}
              onChange={(e) => setCaptchaAnswer(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCaptchaSubmit}>Xác nhận</Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Image Captcha Dialog */}
      {captchaType === CaptchaType.IMAGE && (
        <Dialog open={showCaptcha} onClose={() => {}} maxWidth="sm" fullWidth>
          <DialogTitle>Xác thực</DialogTitle>
          <DialogContent>
            <Typography variant="h6" gutterBottom align="center">
              Chọn hình ảnh con mèo
            </Typography>
            <div className="w-full grid grid-cols-2">
              {captchaImages.map((image, index) => (
                <div
                  key={index}
                  className={`captcha-image-container ${
                    selectedImageIndex === index ? "selected" : ""
                  } flex items-center justify-center`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    className="captcha-image w-[100px] h-[100px] rounded-md"
                  />
                </div>
              ))}
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCaptchaSubmit}
              disabled={selectedImageIndex === null}
            >
              Xác nhận
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default SurveyPage;
