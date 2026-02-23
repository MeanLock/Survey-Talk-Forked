import { Fragment, useEffect, useState, type FC } from "react";
import "./styles.scss";

// IMAGES
import TopBanner from "../../../assets/Image/Home/topBanner.png";
import Gif1 from "../../../assets/Image/Home/gif1.gif";
import Gif2 from "../../../assets/Image/Home/gif2.gif";
import Benefit1 from "../../../assets/Image/Home/benefit1.png";
import Benefit2 from "../../../assets/Image/Home/benefit2.png";
import Benefit3 from "../../../assets/Image/Home/benefit3.png";
import YellowBanner from "../../../assets/Image/Home/bottomYellowBanner.png";
import NotFoundImg from "../../../assets/Image/Logo/notfound.png";

// COMPONENTS
import LinkButton from "../../components/common/system/button/LinkButton";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import type { RootState } from "../../../redux/rootReducer";
import { useSelector } from "react-redux";
import type { SurveyCommunity, SurveyCommunityCard } from "../../../core/types";
import { homeSurveysData } from "../../../core/mockData/mockData";
import { CircularProgress } from "@mui/material";
import { SurveysCarousel } from "./SurveysCarousel";
import { clearAuthToken } from "../../../redux/auth/authSlice";
import { useGetFeatureSurveys } from "@/services/Survey/Home/get-feature-surveys";

const progressVisualizeSteps = [
  {
    index: 1,
    name: "Tạo Khảo Sát",
    icon: <CreateNewFolderIcon sx={{ fontSize: 60, color: "#FFC40D" }} />,
  },
  {
    index: 2,
    name: "Đăng Khảo Sát",
    icon: <DriveFolderUploadIcon sx={{ fontSize: 60, color: "#FFC40D" }} />,
  },
  {
    index: 3,
    name: "Nhận Ý Kiến Phản Hồi",
    icon: <AddReactionIcon sx={{ fontSize: 60, color: "#FFC40D" }} />,
  },
];

const benefitData = [
  {
    index: 1,
    title: "Giúp khảo sát của bạn nổi bật ngay từ cái nhìn đầu tiên!",
    description:
      "Dễ dàng thêm logo, màu sắc và phong cách thương hiệu vào khảo sát của bạn, rồi nhúng vào trang đích hoặc email một cách mượt mà mà không cần viết mã.",
    imageUrl: Benefit1,
  },
  {
    index: 2,
    title: "Cơ hội để bạn tìm kiếm thu nhập",
    description:
      "Những người muốn kiếm thêm thu nhập bằng cách tham gia khảo sát và chia sẻ một số thông tin cá nhân.",
    imageUrl: Benefit3,
  },
  {
    index: 3,
    title: "Khuyến khích người tham gia chia sẻ nhiều hơn!",
    description:
      "Những cá nhân và doanh nghiệp sẵn sàng đầu tư để thu thập ý kiến khảo sát chất lượng, giúp họ đưa ra quyết định chính xác hơn.",
    imageUrl: Benefit2,
  },
];

interface HomePageProps {}

const HomePage: FC<HomePageProps> = () => {
  // REDUX
  const user = useSelector((state: RootState) => state.auth.user);

  // STATES
  const [isLoading, setIsLoading] = useState(true);
  const [surveys, setSurveys] = useState([]);

  const [suitYouBest, setSuitYouBest] = useState<SurveyCommunity[] | null>(
    null
  );
  const [bigBonus, setBigBonus] = useState<SurveyCommunity[] | null>(null);
  const [baseOnFavTopic, setBaseOnFavTopic] = useState<
    SurveyCommunity[] | null
  >(null);

  // HOOKS
  const {
    data: surveysFeatureFromAPI,
    isLoading: isLoadingFeatureSurveys,
    isFetched, // đảm bảo đã fetch xong
  } = useGetFeatureSurveys({});

  useEffect(() => {
    if (surveysFeatureFromAPI) {
      setSuitYouBest(surveysFeatureFromAPI.BestmatchSurveys ?? null);
      setBigBonus(surveysFeatureFromAPI.BigbonusSurveys ?? null);
      setBaseOnFavTopic(surveysFeatureFromAPI.FavoriteSurveys ?? null);
    }
  }, [surveysFeatureFromAPI]);

  return (
    <div className="home-page w-full flex flex-col items-center">
      {user ? (
        <div className="features w-full">
          <div className="w-full mb-20 relative">
            <img src={TopBanner} className="w-full object-cover" />
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-[#3e5dab]/35 z-10 p-20 flex flex-col items-center justify-center gap-10">
              <div className="bg-[#FFC40D] rounded-lg p-5">
                <p className="text-[#3e5dab] text-4xl font-extrabold">
                  DANH SÁCH KHẢO SÁT PHÙ HỢP VỚI BẠN!
                </p>
              </div>

              {/* <div className="bg-white/20 p-2 rounded-xl border-1 border-white">
                <img src={Gif2} className="w-[700px] object-cover" />
              </div> */}
            </div>
          </div>

          <div className="features-div w-full flex flex-col items-start p-12">
            <p className="features-div___title">Suit You Best!</p>
            {isLoadingFeatureSurveys && !isFetched ? (
              <CircularProgress />
            ) : suitYouBest && suitYouBest.length === 0 ? (
              <div className="w-full flex-1 flex flex-col gap-4 items-center justify-center mt-10">
                <img src={NotFoundImg} className="w-[200px] h-[200px]" />
                <p className="font-bold text-gray-400">
                  Chưa có khảo sát nào phù hợp với bạn
                </p>
              </div>
            ) : (
              <SurveysCarousel prefix="suityoubest" data={suitYouBest} />
            )}
          </div>

          <div className="features-div w-full flex flex-col items-start p-12">
            <p className="features-div___title">Big bonus!</p>
            {isLoadingFeatureSurveys && !isFetched ? (
              <CircularProgress />
            ) : bigBonus && bigBonus.length === 0 ? (
              <div className="w-full flex-1 flex flex-col gap-4 items-center justify-center mt-10">
                <img src={NotFoundImg} className="w-[200px] h-[200px]" />
                <p className="font-bold text-gray-400">
                  Chưa có khảo sát nào big bonus
                </p>
              </div>
            ) : (
              <SurveysCarousel prefix="bigbonus" data={bigBonus} />
            )}
          </div>

          <div className="features-div w-full flex flex-col items-start p-12 mb-10">
            <p className="features-div___title">
              Base On Your Favorite Topics!
            </p>
            {isLoadingFeatureSurveys && !isFetched ? (
              <CircularProgress />
            ) : baseOnFavTopic && baseOnFavTopic.length === 0 ? (
              <div className="w-full flex-1 flex flex-col gap-4 items-center justify-center mt-10">
                <img src={NotFoundImg} className="w-[200px] h-[200px]" />
                <p className="font-bold text-gray-400">
                  Chưa có khảo sát nào phù hợp với chủ đề yêu thích của bạn
                </p>
              </div>
            ) : (
              <SurveysCarousel prefix="base" data={baseOnFavTopic} />
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Title Section */}
          <div className="max-w-7xl mx-auto px-4 md:px-10">
            <h1 className="home-page__title text-3xl md:text-5xl font-bold text-[#3E5DAB] text-center mt-10 mb-4 animate-fadeIn">
              Tạo khảo sát một cách khác biệt và thú vị
            </h1>
            <p className="home-page__sub-title text-lg md:text-xl text-gray-600 text-center mb-10">
              Tạo các cuộc khảo sát được thiết kế để cung cấp cho bạn nhiều dữ
              liệu hơn và tốt hơn.
            </p>
            {/* GIF Section */}
            <div className="my-5 py-5 md:py-10 flex justify-center">
              <img
                src={Gif1}
                alt="Survey Creation Animation"
                className="rounded-lg shadow-lg w-full mx-auto"
              />
            </div>
          </div>
          {/* Progress Visualize Section */}
          <div className="progress-visualize w-full flex flex-col items-center bg-gray-50 py-16 px-4 mt-10">
            <div className="max-w-7xl mx-auto">
              <p className="progress-visualize__title text-xl md:text-2xl text-center text-gray-700 mb-10 max-w-4xl mx-auto">
                Với giao diện thân thiện với người dùng, bạn sẽ nhận được các
                phản hồi khảo sát và ý kiến phản hồi được cải thiện đáng kể.
              </p>
              <div className="progress-visualize__image w-full bg-white p-6 md:p-10 rounded-xl shadow-md my-5 grid grid-cols-5 ">
                {progressVisualizeSteps.map((p, index) => (
                  <Fragment key={p.index}>
                    <div className="progress-visualize__image__icons flex flex-col items-center justify-center gap-3 py-4">
                      <div className="progress-visualize__image__icons__container flex p-5 items-center justify-center bg-white rounded-full shadow-md hover:shadow-lg transition-shadow duration-300">
                        {p.icon}
                      </div>
                      <p className="progress-visualize__image__icons__text text-lg font-semibold text-[#3E5DAB]">
                        {p.name}
                      </p>
                    </div>
                    {index < progressVisualizeSteps.length - 1 && (
                      <div className="flex items-center justify-center">
                        <div className="divider w-0.5 h-16 md:w-24 md:h-0.5 bg-gray-300 my-2 md:my-0"></div>
                      </div>
                    )}
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
          {/* Benefits Section */}
          <div className="benefit w-full flex flex-col items-center gap-16 py-16 px-4 mt-10 max-w-7xl mx-auto">
            {benefitData.map((b) => (
              <div
                className={`benefit__container w-full grid grid-cols-1 ${
                  b.index % 2 === 0
                    ? "md:grid-cols-[1fr_1fr]"
                    : "md:grid-cols-[1fr_1fr]"
                } gap-8 items-center`}
                key={b.index}
              >
                {b.index % 2 === 0 ? (
                  <>
                    <div className="benefit__container__text w-full flex flex-col items-center md:items-start justify-center">
                      <div className="benefit__container__text__title mb-4">
                        <h3 className="text-2xl md:text-3xl font-bold text-[#3E5DAB]">
                          {b.title}
                        </h3>
                      </div>
                      <p className="benefit__container__text__sub-title text-gray-600 text-lg">
                        {b.description}
                      </p>
                    </div>
                    <div className="w-full flex items-center justify-center md:justify-end">
                      <img
                        src={b.imageUrl}
                        alt={b.title}
                        className="rounded-lg shadow-lg max-w-full"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-full flex items-center justify-center md:justify-start order-last md:order-first">
                      <img
                        src={b.imageUrl}
                        alt={b.title}
                        className="rounded-lg shadow-lg max-w-full"
                      />
                    </div>
                    <div className="benefit__container__text w-full flex flex-col items-center md:items-start gap-2 justify-center">
                      <div className="benefit__container__text__title mb-4">
                        <h3 className="text-2xl md:text-3xl font-bold text-[#3E5DAB]">
                          {b.title}
                        </h3>
                      </div>
                      <p className="benefit__container__text__sub-title text-gray-600 text-lg">
                        {b.description}
                      </p>
                    </div>
                  </>
                )}
              </div>
            ))}
            {/* CTA Button */}
            <div className="w-full flex items-center justify-center mt-10">
              <LinkButton
                title="TẠO KHẢO SÁT NGAY"
                backgroundColor="#3E5DAB"
                color="white"
                link="/survey/new"
                // className="animate-bounce"
              />
            </div>
          </div>
          {/* Banner */}
          <div className="w-full px-4 max-w-7xl mx-auto my-16">
            <div className="banner w-full px-6 py-10 md:px-10 md:py-16 rounded-xl flex justify-center items-center bg-gradient-to-r from-[#3E5DAB] to-[#2d4580] shadow-lg">
              <p className="banner__text text-xl md:text-3xl font-bold text-white text-center">
                Hãy thử tạo những khảo sát mới mẻ và khác biệt!
              </p>
            </div>
          </div>
          {/* Sub-footer */}
          <div className="sub-footer w-full flex flex-col items-center py-16 px-4 bg-gray-50">
            <div className="max-w-7xl mx-auto text-center">
              <h2 className="sub-footer__title text-2xl md:text-4xl font-bold text-[#3E5DAB] mb-4">
                Bạn trả lời, chúng tôi trả tiền—đơn giản vậy thôi!
              </h2>
              <p className="sub-footer__sub-title text-lg md:text-xl text-gray-700 mb-2">
                Một nền tảng giúp bạn kiếm tiền từ dữ liệu!
              </p>
              <p className="sub-footer__sub-title text-lg md:text-xl text-gray-700 mb-10">
                Người dùng có thể bán dữ liệu dưới hai hình thức:{" "}
                <strong className="text-[#FFC40D]">Tham gia khảo sát</strong>{" "}
                hoặc{" "}
                <strong className="text-[#FFC40D]">
                  Giao dịch cổ phiếu dữ liệu
                </strong>
                .
              </p>
              <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-10">
                <LinkButton
                  title="Khám Phá"
                  color="#3E5DAB"
                  backgroundColor="white"
                  link="/explore"
                />
                <LinkButton
                  title="Liên Hệ"
                  color="#3E5DAB"
                  backgroundColor="white"
                  link="/contact"
                />
              </div>
            </div>
          </div>
        </>
      )}
      <div className="w-full mb-10">
        <img src={YellowBanner} className="w-full" />
      </div>
    </div>
  );
};

export default HomePage;
