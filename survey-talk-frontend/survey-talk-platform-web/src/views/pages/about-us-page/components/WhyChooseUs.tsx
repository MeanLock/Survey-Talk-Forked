import { Shield, Clock, Lock } from "lucide-react";
export function WhyChooseUs() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#3E5DAB] mb-4">
            Tại Sao Chọn Chúng Tôi
          </h2>
          <div className="w-20 h-1 bg-[#FFC40D] mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Chúng tôi cam kết mang đến trải nghiệm tốt nhất cho người dùng với
            các ưu điểm vượt trội
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
            <div className="bg-[#FFC40D]/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <Shield size={32} className="text-[#3E5DAB]" />
            </div>
            <h3 className="text-xl font-bold text-[#3E5DAB] mb-4">
              Khảo sát chất lượng cao
            </h3>
            <p className="text-gray-600">
              Chúng tôi hợp tác với các thương hiệu và công ty nghiên cứu uy tín
              để mang đến những khảo sát chất lượng cao, phù hợp với người dùng
              Việt Nam.
            </p>
          </div>
          <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
            <div className="bg-[#FFC40D]/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <Clock size={32} className="text-[#3E5DAB]" />
            </div>
            <h3 className="text-xl font-bold text-[#3E5DAB] mb-4">
              Thanh toán nhanh chóng
            </h3>
            <p className="text-gray-600">
              Hệ thống thanh toán tự động, giúp bạn nhận tiền nhanh chóng và an
              toàn trong vòng 24 giờ sau khi yêu cầu rút tiền.
            </p>
          </div>
          <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
            <div className="bg-[#FFC40D]/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <Lock size={32} className="text-[#3E5DAB]" />
            </div>
            <h3 className="text-xl font-bold text-[#3E5DAB] mb-4">
              Bảo mật thông tin người dùng
            </h3>
            <p className="text-gray-600">
              Chúng tôi đặt sự an toàn dữ liệu lên hàng đầu, áp dụng các biện
              pháp bảo mật tiên tiến để bảo vệ thông tin cá nhân của bạn.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
