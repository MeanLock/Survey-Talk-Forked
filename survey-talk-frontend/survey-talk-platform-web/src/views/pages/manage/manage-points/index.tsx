import { loginRequiredAxiosInstance } from "@/core/api/rest-api/config/instances/v2";
import { callAxiosRestApi } from "@/core/api/rest-api/main/api-call";
import SurveyTalkLoading from "@/views/components/common/loading";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, Newspaper, Receipt, TrendingUp } from "lucide-react";

type Transaction = {
  Id: number;
  Amount: number;
  Profit: number;
  CreatedAt: string;
  Account: {
    Id: number;
    FullName: string;
    Email: string;
    Phone: string;
    MainImageUrl: string;
  };
  Survey: {
    Id: number;
    Title: string;
    MainImageUrl: string;
  };
  TransactionStatus: {
    Id: number;
    Name: string;
  };
  TransactionType: {
    Id: number;
    Name: string;
  };
};

const ManagePointPage = () => {
  // STATES
  const [totalEarnedPoints, setTotalEarnedPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [transactionHistories, setTransactionHistories] = useState<
    Transaction[]
  >([]);

  // HOOKS
  useEffect(() => {
    setIsLoading(true);
    fetch();
    
  }, []);

  // FUNCTIONS
  const fetch = async () => {
    try {
      const response = await callAxiosRestApi({
        instance: loginRequiredAxiosInstance,
        method: "get",
        url: `Survey/transaction/community/survey-taken-earn/history`,
      });
      if (response && response.success) {
        setTransactionHistories(response.data.TransactionHistory);
        // Calculate total earned points
        const total = response.data.TransactionHistory.reduce(
          (sum: number, transaction: Transaction) => sum + transaction.Amount,
          0
        );
        //console.log("Total Earned Points: ", response.data.TransactionHistory);
       
        setTotalEarnedPoints(total);
        setIsLoading(false);
      }
    } catch (error) {
      //console.log("Error: ", error);
      setIsLoading(false);
    }
  };

  // Helper function to truncate text
  const truncateText = (text: string | number, maxLength = 20) => {
    const str = text.toString();
    return str.length > maxLength ? `${str.substring(0, maxLength)}...` : str;
  };

  return (
    <div className=" p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-[#3E5DAB] flex items-center justify-center gap-3">
            <Coins className="w-10 h-10 text-[#FFC40D]" />
            Trang Quản Lý Điểm
          </h1>
          <p className="text-gray-600 text-lg">
            Theo dõi lịch sử nhận điểm từ các khảo sát
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-96 space-y-4">
            <SurveyTalkLoading />
            <p className="text-xl font-semibold text-gray-700">
              Đang lấy danh sách nhận điểm của bạn...
            </p>
          </div>
        ) : (
          <>
            {/* Summary Card */}
            <Card className="shadow-xl border-0 bg-gradient-to-r from-white to-green-50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-2xl text-[#3E5DAB]">
                  <TrendingUp className="w-7 h-7 text-green-500" />
                  Tổng Quan Điểm Số
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <Coins className="w-6 h-6 text-green-500" />
                      <span className="text-3xl font-bold text-green-600">
                        {totalEarnedPoints.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Tổng điểm đã nhận</p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <Newspaper className="w-6 h-6 text-[#3E5DAB]" />

                      <span className="text-3xl font-bold text-[#3E5DAB]">
                        {transactionHistories.length}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Tổng số survey đã làm
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transaction History Table */}
            <Card className="shadow-xl border-0 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-[#3E5DAB]">
                  <Receipt className="w-6 h-6 text-[#FFC40D]" />
                  Lịch Sử Giao Dịch
                </CardTitle>
              </CardHeader>
              <CardContent>
                {transactionHistories.length === 0 ? (
                  <div className="text-center py-12">
                    <Coins className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">
                      Chưa có giao dịch nào
                    </p>
                    <p className="text-gray-400 text-sm">
                      Hãy tham gia làm khảo sát để nhận điểm!
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gradient-to-r from-[#3E5DAB]/5 to-blue-50">
                          <TableHead className="font-semibold text-[#3E5DAB]">
                            Mã Nhận Điểm
                          </TableHead>
                          <TableHead className="font-semibold text-[#3E5DAB]">
                            ID Khảo Sát
                          </TableHead>
                          <TableHead className="font-semibold text-[#3E5DAB]">
                            Tên Khảo Sát
                          </TableHead>
                          <TableHead className="font-semibold text-[#3E5DAB]">
                            Số Điểm Nhận
                          </TableHead>
                          <TableHead className="font-semibold text-[#3E5DAB]">
                            Loại Giao Dịch
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactionHistories.map((transaction, index) => (
                          <TableRow
                            key={transaction.Id}
                            className={`hover:bg-gray-50 transition-colors ${
                              index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                            }`}
                          >
                            <TableCell className="font-medium">
                              <span
                                className="text-[#3E5DAB] font-mono text-sm"
                                title={transaction.Id.toString()}
                              >
                                {truncateText(transaction.Id, 15)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span
                                className="text-gray-700 font-mono text-sm"
                                title={transaction.Survey.Id.toString()}
                              >
                                {truncateText(transaction.Survey.Id, 15)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span
                                className="text-gray-800"
                                title={transaction.Survey.Title}
                              >
                                {truncateText(transaction.Survey.Title, 30)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-200 font-semibold px-3 py-1">
                                <Coins className="w-3 h-3 mr-1" />
                                {transaction.Amount.toLocaleString()} Points
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="border-[#3E5DAB] text-[#3E5DAB] font-medium"
                              >
                                Nhận điểm làm Khảo Sát
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default ManagePointPage;
