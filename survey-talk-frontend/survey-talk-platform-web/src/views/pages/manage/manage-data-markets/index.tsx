import { ToBeContinue } from "@/views/components/common/tobecontinue/ToBeContinue";

const ManageDataMarketPage = () => {
  return (
    <div className="data-market-screen w-full min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 rounded-lg">
        <h1 className="text-6xl font-bold mb-4 text-gray-600">Coming Soon</h1>
        <p className="text-xl text-gray-600">
          Chức năng Data Market sẽ ra mắt trong thời gian tới
        </p>
        <div className="mt-10 flex items-center justify-center">
          <ToBeContinue />
        </div>
      </div>
    </div>
  );
};

export default ManageDataMarketPage;
