import type { RootState } from "@/redux/rootReducer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export function Hero() {
  const auth = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const handleStart = () => {
    if (auth.token) {
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  return (
    <section className="bg-gradient-to-br from-[#3E5DAB] to-[#2a4180] text-white py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Kiếm Tiền Dễ Dàng Từ Các Khảo Sát Uy Tín
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              Tham gia cộng đồng hơn 100,000 người đang kiếm tiền mỗi ngày chỉ
              với vài phút điền khảo sát.
            </p>
            <button
              onClick={() => handleStart()}
              className="!bg-[#FFC40D] !hover:bg-[#e6b00c] !text-[#3E5DAB] font-bold px-8 py-4 rounded-lg text-lg shadow-lg transition-all transform hover:scale-105"
            >
              Bắt đầu ngay
            </button>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
              alt="Person earning money from surveys"
              className="rounded-lg shadow-2xl max-w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
