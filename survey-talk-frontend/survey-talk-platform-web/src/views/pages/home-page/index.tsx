import { useEffect, useState, type FC } from "react";
import "./styles.scss";

// IMAGES
import TopBanner from "../../../assets/Image/Home/topBanner.png";
import Gif1 from "../../../assets/Image/Home/gif1.gif";
import Benefit1 from "../../../assets/Image/Home/benefit1.png";
import Benefit2 from "../../../assets/Image/Home/benefit2.png";
import Benefit3 from "../../../assets/Image/Home/benefit3.png";
import YellowBanner from "../../../assets/Image/Home/bottomYellowBanner.png";

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
import { requesterFake, takerFake } from "../../../core/mockData/userFake";
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
  const fake = useSelector((state: RootState) => state.fake);

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

  // FUNCTIONS
  // const fetchSurveys = async () => {
  //   try {
  //     // CALL API TO GET SURVEYS FEATURES
  //     const response = homeSurveysData;
  //     if (response) {
  //       setSuitYouBest(response.BestmatchSurveys);
  //       setBigBonus(response.BigbonusSurveys);
  //       setBaseOnFavTopic(response.FavoriteSurveys);
  //       setIsLoading(false);
  //     }
  //   } catch (error) {
  //     console.log("Error while fetching surveys at home: ", error);
  //   }
  // };

  return (
    <div className="home-page w-full flex flex-col items-center">
      <div className="w-full mb-20">
        <img src={TopBanner} className="w-full" />
      </div>
      {user ? (
        <div className="features w-full">
          <div className="features-div w-full flex flex-col items-start p-12">
            <p className="features-div___title">Suit You Best!</p>
            {isLoadingFeatureSurveys && !isFetched ? (
              <CircularProgress />
            ) : (
              <SurveysCarousel prefix="suityoubest" data={suitYouBest} />
            )}
          </div>

          <div className="features-div w-full flex flex-col items-start p-12">
            <p className="features-div___title">Big bonus!</p>
            {isLoadingFeatureSurveys && !isFetched ? (
              <CircularProgress />
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
            ) : (
              <SurveysCarousel prefix="base" data={baseOnFavTopic} />
            )}
          </div>
        </div>
      ) : (
        <>
          <p className="home-page__title mt-10 mx-10">
            Tạo khảo sát một cách khác biệt và thú vị
          </p>
          <p className="home-page__sub-title mx-10">
            Tạo các cuộc khảo sát được thiết kế để cung cấp cho bạn nhiều dữ
            liệu hơn và tốt hơn.
          </p>
          <div className="my-5 py-10 px-20 mx-10">
            <img src={Gif1} />
          </div>

          <div className="progress-visualize w-full flex flex-col items-center mx-10">
            <p className="progress-visualize__title">
              Với giao diện thân thiện với người dùng, bạn sẽ nhận được các phản
              hồi khảo sát và ý kiến phản hồi được cải thiện đáng kể.
            </p>
            <div className="progress-visualize__image w-11/12 p-10 rounded-md my-5 flex items-center justify-around">
              {progressVisualizeSteps.map((p) => (
                <>
                  <div className="progress-visualize__image__icons flex flex-col items-center gap-1">
                    <div className="progress-visualize__image__icons__container flex p-7 items-center justify-center">
                      {p.icon}
                    </div>
                    <p className="progress-visualize__image__icons__text">
                      {p.name}
                    </p>
                  </div>
                  {p.index !== 3 && <div className="divider w-72 h-0.5"></div>}
                </>
              ))}
            </div>
          </div>

          <div className="benefit w-full flex flex-col items-center gap-3 p-14 mt-20 mx-10">
            {benefitData.map((b) =>
              b.index % 2 === 0 ? (
                <div
                  className="benefit__container w-full grid grid-cols-2"
                  key={b.index}
                >
                  {/* Nội dung cho benefit với index chẵn */}
                  <div className="benefit__container__text w-full flex flex-col items-center justify-center">
                    <div className="benefit__container__text__title">
                      <p>{b.title}</p>
                    </div>
                    <p className="benefit__container__text__sub-title">
                      {b.description}
                    </p>
                  </div>
                  <div className="w-full flex items-center justify-end">
                    <img src={b.imageUrl} alt={b.title} />
                  </div>
                </div>
              ) : (
                <div
                  className="benefit__container w-full grid grid-cols-2"
                  key={b.index}
                >
                  {/* Nội dung cho benefit với index lẻ */}
                  <div className="w-full flex items-center justify-start">
                    <img src={b.imageUrl} alt={b.title} />
                  </div>
                  <div className="benefit__container__text w-full flex flex-col items-center gap-2 justify-center">
                    <div className="benefit__container__text__title">
                      <p>{b.title}</p>
                    </div>
                    <p className="benefit__container__text__sub-title">
                      {b.description}
                    </p>
                  </div>
                </div>
              )
            )}

            <div className="w-full flex items-center justify-center mt-20">
              <LinkButton
                title="TẠO KHẢO SÁT NGAY"
                backgroundColor="#3E5DAB"
                color="white"
                link="/createSurveys"
              />
            </div>
          </div>

          <div className="mx-10">
            <div className="banner w-full px-10 py-10 my-30 rounded-md flex justify-center items-center">
              <p className="banner__text">
                Hãy thử tạo những khảo sát mới mẻ và khác biệt!
              </p>
            </div>
          </div>

          <div className="sub-footer w-full flex flex-col items-center py-20">
            <p className="sub-footer__title">
              Bạn trả lời, chúng tôi trả tiền—đơn giản vậy thôi!
            </p>
            <p className="sub-footer__sub-title">
              Một nền tảng giúp bạn kiếm tiền từ dữ liệu!
            </p>
            <p className="sub-footer__sub-title">
              Người dùng có thể bán dữ liệu dưới hai hình thức: tham gia khảo
              sát hoặc giao dịch cổ phiếu dữ liệu.
            </p>
            <div className="w-1/3 flex justify-around items-center mt-10">
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
        </>
      )}
      <div className="w-full mb-10">
        <img src={YellowBanner} className="w-full" />
      </div>
    </div>
  );
};

export default HomePage;
