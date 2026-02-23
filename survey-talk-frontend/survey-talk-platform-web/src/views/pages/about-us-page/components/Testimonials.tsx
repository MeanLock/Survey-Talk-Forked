export function Testimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#3E5DAB] mb-4">
            Người Dùng Nói Gì Về Chúng Tôi
          </h2>
          <div className="w-20 h-1 bg-[#FFC40D] mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hàng ngàn người đã thành công kiếm thêm thu nhập thông qua nền tảng
            của chúng tôi
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="flex items-center mb-6">
              <img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="Nguyễn Thị Minh"
                className="w-16 h-16 rounded-full mr-4"
              />
              <div className="flex flex-col items-start">
                <h4 className="font-bold text-[#3E5DAB]">Nguyễn Thị Minh</h4>
                <p className="text-gray-500">Sinh viên, Hà Nội</p>
              </div>
            </div>
            <p className="text-gray-600 italic">
              "Tôi đã kiếm được hơn 2 triệu đồng trong tháng đầu tiên chỉ bằng
              cách làm khảo sát trong thời gian rảnh. Đây là cách tuyệt vời để
              sinh viên như tôi có thêm thu nhập!"
            </p>
            <div className="flex text-[#FFC40D] mt-4">
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
            </div>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="flex items-center mb-6">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Trần Văn Hùng"
                className="w-16 h-16 rounded-full mr-4"
              />
              <div className="flex flex-col items-start">
                <h4 className="font-bold text-[#3E5DAB]">Trần Văn Hùng</h4>
                <p className="text-gray-500">Nhân viên văn phòng, TP.HCM</p>
              </div>
            </div>
            <p className="text-gray-600 italic">
              "Ban đầu tôi khá hoài nghi, nhưng sau 3 tháng sử dụng, tôi đã nhận
              được thanh toán đều đặn. Giao diện dễ sử dụng và các khảo sát rất
              thú vị."
            </p>
            <div className="flex text-[#FFC40D] mt-4">
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
            </div>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="flex items-center mb-6">
              <img
                src="https://randomuser.me/api/portraits/women/68.jpg"
                alt="Lê Thị Hương"
                className="w-16 h-16 rounded-full mr-4"
              />
              <div className="flex flex-col items-start">
                <h4 className="font-bold text-[#3E5DAB]">Lê Thị Hương</h4>
                <p className="text-gray-500">Nội trợ, Đà Nẵng</p>
              </div>
            </div>
            <p className="text-gray-600 italic">
              "Tôi làm khảo sát khi con ngủ trưa và buổi tối. Đây là cách tuyệt
              vời để tôi có thể đóng góp vào thu nhập gia đình mà vẫn chăm sóc
              được các con."
            </p>
            <div className="flex text-[#FFC40D] mt-4">
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>☆</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
