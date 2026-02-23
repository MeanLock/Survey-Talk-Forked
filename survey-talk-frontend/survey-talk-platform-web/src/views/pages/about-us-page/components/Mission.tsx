export function Mission() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
            <img
              src="https://images.unsplash.com/photo-1579389083078-4e7018379f7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
              alt="Growing coins illustration"
              className="rounded-lg shadow-lg max-w-full h-auto"
            />
          </div>
          <div className="md:w-1/2 flex flex-col items-start">
            <h2 className="text-3xl md:text-4xl font-bold text-[#3E5DAB] mb-6">
              Sứ Mệnh Của Chúng Tôi
            </h2>
            <div className="w-20 h-1 bg-[#FFC40D] mb-8"></div>
            <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed">
              Chúng tôi tin rằng mọi người đều xứng đáng có cơ hội kiếm thêm thu
              nhập một cách dễ dàng và minh bạch. Sứ mệnh của chúng tôi là kết
              nối người dùng với các cuộc khảo sát uy tín từ các thương hiệu
              lớn, giúp bạn kiếm thu nhập thụ động chỉ bằng cách chia sẻ ý kiến
              của mình.
            </p>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              Chúng tôi cam kết xây dựng một nền tảng an toàn, đáng tin cậy và
              công bằng cho tất cả người dùng, đồng thời cung cấp dữ liệu có giá
              trị cho các đối tác kinh doanh của chúng tôi.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
