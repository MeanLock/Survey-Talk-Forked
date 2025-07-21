import type { RootState } from "@/redux/rootReducer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export function CallToAction() {
  const token = useSelector((state: RootState) => state.auth.token);

  const navigate = useNavigate();
  return (
    <section className="py-20 bg-gradient-to-br from-[#3E5DAB] to-[#2a4180] text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Bạn đã sẵn sàng kiếm tiền từ khảo sát chưa?
        </h2>
        <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
          Tham gia ngay hôm nay và bắt đầu kiếm thu nhập thụ động từ việc chia
          sẻ ý kiến của bạn
        </p>
        {!token && (
          <button
            onClick={() => navigate("/register")}
            className="bg-[#FFC40D] hover:bg-[#e6b00c] text-[#3E5DAB] font-bold px-8 py-4 rounded-lg text-lg shadow-lg transition-all transform hover:scale-105"
          >
            Tạo tài khoản miễn phí ngay hôm nay
          </button>
        )}
        <p className="mt-6 text-gray-200">
          Đã có hơn 100,000 người dùng đăng ký và kiếm tiền thành công
        </p>
      </div>
    </section>
  );
}
