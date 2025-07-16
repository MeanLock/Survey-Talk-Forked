import "./style.scss";
import ShakeHandImg from "../../../assets/Image/AboutUs/shakehand.jpg";

const AboutUsPage = () => {
  return (
    <div className="w-full p-10 flex flex-col items-center min-h-fit">
      <p className="page-title">Xin chào,</p>
      <p className="page-title">chúng tôi là Survey Talk</p>

      <div className="blue-div relative flex flex-col justify-center mt-10 mb-100 w-[1280px] h-[420px] rounded-md items-center">
        <p>
          Một website cho phép người dùng kiếm tiền bằng cách bán dữ liệu theo
          hai hình thức:
        </p>
        <p>
          Khảo sát (Survey): Hoàn thành khảo sát từ doanh nghiệp và nhận thưởng.
        </p>
        <p>
          Cổ phiếu dữ liệu (Data Shares): Chia sẻ dữ liệu cá nhân, nhận tiền từ
          quyền truy cập. Người dùng kiểm soát dữ liệu của mình và kiếm lợi
          nhuận minh bạch.
        </p>
        {/* <img
          className="shake-image absolute top-[320px] w-[1100px]"
          src={ShakeHandImg}
          alt=""
        /> */}
      </div>
    </div>
  );
};

export default AboutUsPage;
