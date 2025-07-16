import "./style.scss";
import ShakeHandImg from "../../../assets/Image/AboutUs/shakehand.jpg";
import Logo from "@/assets/Image/Logo/logo.png";

const AboutUsPage = () => {
  return (
    <div className="w-full p-10 flex flex-col items-center min-h-fit">
      <p className="page-title">Xin chào,</p>
      <p className="page-title">chúng tôi là Survey Talk</p>

      <div className="blue-div relative flex flex-col justify-center mt-10 mb-10 w-[1280px] h-[420px] rounded-md items-center">
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
      </div>

      <img
        className="shake-image w-[1500px] object-cover"
        src={ShakeHandImg}
        alt=""
      />

      <div className="bg-[#E5F2FF] p-5 grid grid-cols-3 mt-10 rounded-2xl">
        <div className="w-full flex items-center flex-col gap-4 px-5">
          <div className="px-5 py-2 bg-[#FFC40D] rounded-xl">
            <p className="text-2xl text-[#3e5dab] font-semibold">Nhiệm Vụ</p>
          </div>
          <div>
            <p className="text-[#3e5dab] text-center">
              Dễ dàng thêm logo, màu sắc và phong cách thương hiệu vào khảo sát
              của bạn, rồi nhúng vào trang đích hoặc email một cách mượt mà mà
              không cần viết mã.
            </p>
          </div>
        </div>

        <div className="w-full flex items-center flex-col gap-4 px-5">
          <div className="px-5 py-2 bg-[#FFC40D] rounded-xl">
            <p className="text-2xl text-[#3e5dab] font-semibold">Thành tựu</p>
          </div>
          <div>
            <p className="text-[#3e5dab] text-center">
              Dễ dàng thêm logo, màu sắc và phong cách thương hiệu vào khảo sát
              của bạn, rồi nhúng vào trang đích hoặc email một cách mượt mà mà
              không cần viết mã.
            </p>
          </div>
        </div>

        <div className="w-full flex items-center flex-col gap-4 px-5">
          <div className="px-5 py-2 bg-[#FFC40D] rounded-xl">
            <p className="text-2xl text-[#3e5dab] font-semibold">Tầm Nhìn</p>
          </div>
          <div>
            <p className="text-[#3e5dab] text-center">
              Chúng tôi mong muốn đem lại cho người dùng một nền tảng trao đổi
              dữ liệu một cách minh bạch và công khai ...
            </p>
          </div>
        </div>
      </div>

      <div className="w-full bg-[#FFEAA8] grid grid-cols-12 mt-10">
        <div className="col-span-4 flex items-center justify-center">
          <img src={Logo} />
        </div>

        <div className="col-span-8 grid grid-cols-2 gap-5">
          <div className="flex flex-col items-start justify-end gap-2 text-[#3e5dab]">
            <p className="font-bold text-2xl">Số Điện Thoại</p>
            <p>+84 092 123 2521</p>
          </div>

          <div className="flex flex-col items-start justify-end gap-2 text-[#3e5dab]">
            <p className="font-bold text-2xl">Địa Chỉ</p>
            <p>BE5.1024 Phân Khu Beverly Hills, Vinhomes GrandPark, Thủ Đức</p>
          </div>

          <div className="flex flex-col items-start justify-start gap-2 text-[#3e5dab]">
            <p className="font-bold text-2xl">Facebook</p>
            <p>https://www.facebook.com/surveytalkvn</p>
          </div>

          <div className="flex flex-col items-start justify-start gap-2 text-[#3e5dab]">
            <p className="font-bold text-2xl">Email</p>
            <p>surveytalkvn@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
