import { UserPlus, ClipboardCheck, Award, CreditCard } from "lucide-react";
export function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#3E5DAB] mb-4">
            Cách Thức Hoạt Động
          </h2>
          <div className="w-20 h-1 bg-[#FFC40D] mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Chỉ với vài bước đơn giản, bạn có thể bắt đầu kiếm tiền từ các khảo
            sát ngay hôm nay
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
            <div className="bg-[#3E5DAB]/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserPlus size={40} className="text-[#3E5DAB]" />
            </div>
            <h3 className="text-xl font-bold text-[#3E5DAB] mb-4">
              Đăng ký tài khoản
            </h3>
            <p className="text-gray-600">
              Tạo tài khoản miễn phí chỉ trong vài phút với thông tin cơ bản của
              bạn
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
            <div className="bg-[#3E5DAB]/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ClipboardCheck size={40} className="text-[#3E5DAB]" />
            </div>
            <h3 className="text-xl font-bold text-[#3E5DAB] mb-4">
              Tham gia khảo sát
            </h3>
            <p className="text-gray-600">
              Nhận thông báo về các khảo sát phù hợp và hoàn thành chúng trên
              thiết bị của bạn
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
            <div className="bg-[#3E5DAB]/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award size={40} className="text-[#3E5DAB]" />
            </div>
            <h3 className="text-xl font-bold text-[#3E5DAB] mb-4">
              Tích điểm & nhận thưởng
            </h3>
            <p className="text-gray-600">
              Mỗi khảo sát hoàn thành sẽ giúp bạn tích lũy điểm thưởng trong tài
              khoản
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
            <div className="bg-[#3E5DAB]/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard size={40} className="text-[#3E5DAB]" />
            </div>
            <h3 className="text-xl font-bold text-[#3E5DAB] mb-4">Rút tiền</h3>
            <p className="text-gray-600">
              Dễ dàng rút tiền về ví điện tử hoặc tài khoản ngân hàng của bạn
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
