import React, { createContext, useEffect, useState } from "react";
import "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../../../redux/rootReducer";
import {
  clearAuthToken,
  updateAuthUser,
} from "../../../../redux/auth/authSlice";
import { JwtUtil } from "../../../../core/utils/jwt.util";
import { DefaultLayoutHeader } from "./DefaultLayoutHeader";
import { DefaultLayoutContent } from "./DefaultLayoutContent";
import { DefaultLayoutFooter } from "./DefaultLayoutFooter";
import {
  _nonLoginNav,
  _footerNav,
  _loginNav,
} from "../../../../router/_roleNav";
import Swal from "sweetalert2";
import { callAxiosRestApi } from "../../../../core/api/rest-api/main/api-call";
import { loginRequiredAxiosInstance } from "../../../../core/api/rest-api/config/instances/v2";
import { getAccountMe } from "@/services/Profile/get-accounts-me";
import { getAccountStatus } from "@/services/Profile/get-account-status";
import { MessageSquare, Star } from "lucide-react";
import AnimatedLikeIcon from "../../common/rating-icon";

interface DefaultLayoutContextProps {
  isAdmin: boolean;
  isLogin: boolean;
}

export const DefaultLayoutContext = createContext<DefaultLayoutContextProps>({
  isAdmin: false,
  isLogin: false,
});

const DefaultLayout = () => {
  // HOOKS
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // STATES
  const [isLoading, setIsLoading] = useState(true);
  const [navItems, setNavItems] = useState<any>([]);
  const [userInformations, setUserInformations] = useState<any>(null);
  const [footerNavItems, setFooterNavItems] = useState<
    {
      label: string;
      path: string;
    }[]
  >([]);
  const [showRatingWidget, setShowRatingWidget] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const location = window.location.pathname;
  // REDUX
  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    setIsLoading(true);
    setFooterNavItems(_footerNav);
    if (!auth.token) {
      setNavItems(_nonLoginNav);
      dispatch(clearAuthToken());
    } else if (auth.token && JwtUtil.isTokenValid(auth.token)) {
      // CALL API TO GET USER INFORMATIONS
      fetchForUpdate();
      setNavItems(_loginNav);
    } else {
      //console.log("Không valid rồiiiii");
      alert("Không valid");
      dispatch(clearAuthToken());
    }
  }, [location, auth.token]); // Re-fetch when location or auth token changes

  useEffect(() => {
    setIsLoading(true);
    setFooterNavItems(_footerNav);
    if (!auth.token) {
      setNavItems(_nonLoginNav);
      dispatch(clearAuthToken());
    } else if (auth.token && JwtUtil.isTokenValid(auth.token)) {
      // CALL API TO GET USER INFORMATIONS
      fetchForFirst();
      setNavItems(_loginNav);
    } else {
      //console.log("Không valid rồiiiii");
      alert("Không valid");
      dispatch(clearAuthToken());
    }
  }, []);

  // FUNCTIONS
  const fetchForFirst = async () => {
    try {
      const user = await getAccountMe();
      const status = await getAccountStatus();

      if (user) {
        dispatch(
          updateAuthUser({
            token: auth.token,
            user: user.user,
          })
        );

        setUserInformations(user.user);

        if (!user.user.Profile) {
          Swal.fire({
            title: "Chỉ còn 1 bước nữa thôi!",
            text: "Cập nhật thông tin ngay để bắt đầu các chức năng của trang web",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Vào làm",
            cancelButtonText: "Hủy",
            allowOutsideClick: false,
            allowEscapeKey: false,
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/survey/filter-survey");
            } else {
              dispatch(clearAuthToken());
              navigate("/login");
            }
          });
        } else if (
          user.user.Profile.CountryRegion === null ||
          user.user.Profile.AverageIncome === null ||
          user.user.Profile.DistrictCode === null ||
          user.user.Profile.JobField === null ||
          user.user.Profile.MaritalStatus === null ||
          user.user.Profile.WardCode === null
        ) {
          Swal.fire({
            title: "Chỉ còn 1 bước nữa thôi!",
            text: "Cập nhật thông tin ngay để bắt đầu các chức năng của trang web",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Vào làm",
            cancelButtonText: "Hủy",
            allowOutsideClick: false,
            allowEscapeKey: false,
          }).then((result) => {
            //console.log("Hủy cập nhật thông tin: ", result.isConfirmed);
            if (result.isConfirmed) {
              navigate("/survey/filter-survey");
            } else {
              //console.log("Hủy cập nhật thông tin: ", result.isConfirmed);
             
              dispatch(clearAuthToken());
              navigate("/login");
            }
          });
        } else {
          if (status) {
            if (status.status.IsFilterSurveyNeeded) {
              // Hiện pop-up thông báo cần làm Khảo Sát đầu vào
              Swal.fire({
                title: "Khảo sát đầu vào",
                text: "Bạn cần hoàn thành khảo sát đầu vào để sử dụng các tính năng của trang web",
                icon: "info",
                showCancelButton: true,
                confirmButtonText: "Vào làm Khảo Sát Đầu Vào",
                cancelButtonText: "Hủy",
                allowOutsideClick: false,
                allowEscapeKey: false,
              }).then((result) => {
                if (result.isConfirmed) {
                  navigate(
                    `/survey/${status.status.FilterSurveyId}/taking?taking_subject=Verified&is_filter_survey=true`
                  );
                } else {
                  dispatch(clearAuthToken());
                  navigate("/login");
                }
              });
            } else {
              if (status.status.IsRatingNeeded) {
                // Hiển thị icon rating widget
                setShowRatingWidget(true);
              }
            }
          }
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error in fetch:", error);
      setIsLoading(false);
    }
  };

  // Hàm xử lý submit rating
  const handleSubmitRating = async () => {
    try {
      const response = await callAxiosRestApi({
        instance: loginRequiredAxiosInstance,
        method: "post",
        url: `Misc/platform-feedback`,
        data: {
          FeedBack: {
            RatingScore: rating,
            Comment: feedback,
          },
        },
      });

      if (response && response.success) {
        Swal.fire({
          title: "Cảm ơn!",
          text: "Đánh giá của bạn đã được gửi thành công",
          icon: "success",
          confirmButtonText: "OK",
        });
        setShowRatingWidget(false);
        setRating(0);
        setFeedback("");
      } else {
        Swal.fire({
          title: "Lỗi!",
          text: "Có lỗi xảy ra khi gửi đánh giá",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      Swal.fire({
        title: "Lỗi!",
        text: "Có lỗi xảy ra khi gửi đánh giá",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const fetchForUpdate = async () => {
    try {
      const user = await getAccountMe();
      if (user) {
        dispatch(
          updateAuthUser({
            token: auth.token,
            user: user.user,
          })
        );
        setUserInformations(user.user);
      }
      setIsLoading(false);
    } catch (error) {}
  };

  return (
    <DefaultLayoutContext.Provider
      value={{
        isAdmin: userInformations && userInformations.isAdmin,
        isLogin: userInformations ? true : false,
      }}
    >
      <div className="default-layout flex flex-col w-full h-screen">
        {/* HEADER */}
        <DefaultLayoutHeader
          navItems={navItems}
          userInformations={userInformations}
        />

        {/* MAIN WRAPPER */}
        <div className="flex flex-col flex-grow w-full mt-[83px]">
          <div className="flex-grow m-0 p-0">
            <div className="w-full min-h-[calc(100vh-83px-95px)]">
              {/* trừ header */}
              <DefaultLayoutContent />
            </div>
          </div>

          {/* Rating Widget - Fixed Position */}
          {showRatingWidget && (
            <div
              onClick={() => {
                Swal.fire({
                  title: "Đánh giá trang web",
                  html: `
                    <div style="padding: 20px; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
                      <!-- Rating Section -->
                      <div style="margin-bottom: 30px;">
                        <p style="margin-bottom: 15px; font-size: 16px; font-weight: 500; color: #374151;">
                          Đánh giá trải nghiệm của bạn:
                        </p>
                        <div style="display: flex; justify-content: center; gap: 8px; margin-bottom: 10px;" id="rating-stars">
                          ${Array.from({ length: 5 })
                            .map(
                              (_, i) => `
                            <button
                              type="button"
                              style="
                                background: none; 
                                border: none; 
                                cursor: pointer; 
                                transition: all 0.2s ease; 
                                padding: 8px;
                                border-radius: 8px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                              "
                              class="rating-star"
                              data-rating="${i + 1}"
                              onmouseover="this.querySelector('svg').style.fill='#F59E0B'; this.querySelector('svg').style.stroke='#F59E0B'; this.style.transform='scale(1.1)'"
                              onmouseout="
                                if(!this.classList.contains('selected')) { 
                                  this.querySelector('svg').style.fill='transparent'; 
                                  this.querySelector('svg').style.stroke='#D1D5DB';
                                  this.style.transform='scale(1)';
                                }
                              "
                            >
                              <svg width="28" height="28" viewBox="0 0 24 24" fill="transparent" stroke="#D1D5DB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
                              </svg>
                            </button>
                          `
                            )
                            .join("")}
                        </div>
                        <input type="hidden" id="selected-rating" value="0" />
                        <p style="font-size: 12px; color: #6B7280; text-align: center; margin-top: 8px;">
                          Nhấp vào sao để đánh giá
                        </p>
                      </div>
                      
                      <!-- Feedback Section -->
                      <div>
                        <p style="margin-bottom: 12px; font-size: 16px; font-weight: 500; color: #374151;">
                          Chia sẻ đóng góp của bạn để chúng tớ cải thiện hơn! 
                        </p>
                        <textarea
                          id="feedback-text"
                          style="
                            width: 100%; 
                            padding: 12px 16px; 
                            border: 2px solid #E5E7EB; 
                            border-radius: 12px; 
                            resize: none; 
                            font-family: inherit; 
                            font-size: 14px; 
                            line-height: 1.5;
                            transition: border-color 0.2s ease;
                            box-sizing: border-box;
                          "
                          rows="4"
                          placeholder="Hãy chia sẻ trải nghiệm của bạn với chúng tôi..."
                          onfocus="this.style.borderColor='#3B82F6'; this.style.outline='none'"
                          onblur="this.style.borderColor='#E5E7EB'"
                        ></textarea>
                      </div>
                    </div>
                  `,
                  showCancelButton: true,
                  confirmButtonText: "✨ Gửi đánh giá",
                  cancelButtonText: "❌ Hủy",
                  customClass: {
                    popup: "swal-custom-popup",
                    title: "swal-custom-title",
                    confirmButton: "swal-custom-confirm",
                    cancelButton: "swal-custom-cancel",
                  },
                  buttonsStyling: false,
                  preConfirm: () => {
                    const selectedRating = parseInt(
                      (
                        document.getElementById(
                          "selected-rating"
                        ) as HTMLInputElement
                      )?.value || "0"
                    );
                    const feedbackText =
                      (
                        document.getElementById(
                          "feedback-text"
                        ) as HTMLTextAreaElement
                      )?.value || "";

                    if (selectedRating === 0) {
                      Swal.showValidationMessage(
                        "Vui lòng chọn số sao đánh giá"
                      );
                      return false;
                    }

                    return {
                      rating: selectedRating,
                      feedback: feedbackText,
                    };
                  },
                  didOpen: () => {
                    // Add custom CSS styles
                    const style = document.createElement("style");
                    style.textContent = `
                      .swal-custom-popup {
                        border-radius: 16px !important;
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
                      }
                      .swal-custom-title {
                        font-size: 24px !important;
                        font-weight: 600 !important;
                        color: #1F2937 !important;
                        margin-bottom: 20px !important;
                      }
                      .swal-custom-confirm {
                        background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%) !important;
                        color: white !important;
                        border: none !important;
                        border-radius: 12px !important;
                        padding: 12px 24px !important;
                        font-weight: 600 !important;
                        font-size: 14px !important;
                        transition: all 0.2s ease !important;
                        margin: 0 8px !important;
                      }
                      .swal-custom-confirm:hover {
                        transform: translateY(-1px) !important;
                        box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3) !important;
                      }
                      .swal-custom-cancel {
                        background: #F3F4F6 !important;
                        color: #6B7280 !important;
                        border: none !important;
                        border-radius: 12px !important;
                        padding: 12px 24px !important;
                        font-weight: 600 !important;
                        font-size: 14px !important;
                        transition: all 0.2s ease !important;
                        margin: 0 8px !important;
                      }
                      .swal-custom-cancel:hover {
                        background: #E5E7EB !important;
                        transform: translateY(-1px) !important;
                      }
                    `;
                    document.head.appendChild(style);

                    // Add click handlers for rating stars
                    const stars = document.querySelectorAll(".rating-star");
                    const ratingInput = document.getElementById(
                      "selected-rating"
                    ) as HTMLInputElement;

                    stars.forEach((star, index) => {
                      star.addEventListener("click", () => {
                        const rating = index + 1;
                        ratingInput.value = rating.toString();

                        // Update star colors and add selected class
                        stars.forEach((s, i) => {
                          const starElement = s as HTMLElement;
                          const svgElement = starElement.querySelector("svg");

                          if (i < rating) {
                            // Selected stars: filled yellow
                            if (svgElement) {
                              svgElement.style.fill = "#F59E0B";
                              svgElement.style.stroke = "#F59E0B";
                            }
                            starElement.style.transform = "scale(1.1)";
                            starElement.classList.add("selected");
                          } else {
                            // Unselected stars: transparent fill, gray stroke
                            if (svgElement) {
                              svgElement.style.fill = "transparent";
                              svgElement.style.stroke = "#D1D5DB";
                            }
                            starElement.style.transform = "scale(1)";
                            starElement.classList.remove("selected");
                          }
                        });
                      });
                    });
                  },
                }).then(async (result) => {
                  if (result.isConfirmed && result.value) {
                    setRating(result.value.rating);
                    setFeedback(result.value.feedback);

                    try {
                      const response = await callAxiosRestApi({
                        instance: loginRequiredAxiosInstance,
                        method: "post",
                        url: `Misc/platform-feedback`,
                        data: {
                          Feedback: {
                            RatingScore: result.value.rating,
                            Comment: result.value.feedback,
                          },
                        },
                      });

                      if (response && response.success) {
                        Swal.fire({
                          title: "Cảm ơn!",
                          text: "Đánh giá của bạn đã được gửi thành công",
                          icon: "success",
                          confirmButtonText: "OK",
                        });
                        setShowRatingWidget(false);
                      } else {
                        Swal.fire({
                          title: "Lỗi!",
                          text: "Có lỗi xảy ra khi gửi đánh giá",
                          icon: "error",
                          confirmButtonText: "OK",
                        });
                      }
                    } catch (error) {
                      console.error("Error submitting rating:", error);
                      Swal.fire({
                        title: "Lỗi!",
                        text: "Có lỗi xảy ra khi gửi đánh giá",
                        icon: "error",
                        confirmButtonText: "OK",
                      });
                    }
                  }
                });
              }}
              className="fixed right-5 bottom-10"
            >
              {/* Floating Rating Icon */}
              <AnimatedLikeIcon />
            </div>
          )}
          {/* FOOTER */}
          <DefaultLayoutFooter navItems={footerNavItems} />
        </div>
      </div>
    </DefaultLayoutContext.Provider>
  );
};

export default DefaultLayout;
