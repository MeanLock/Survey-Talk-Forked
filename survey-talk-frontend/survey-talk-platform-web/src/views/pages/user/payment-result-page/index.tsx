import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateAuthUser } from "../../../../redux/auth/authSlice";
import type { RootState } from "../../../../redux/rootReducer";
import { useRefetchUser } from "@/hooks/useRefetchUser";

const PaymentResultPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const refetchUser = useRefetchUser();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = useSelector((state: RootState) => state.auth);

  console.log("Auth: ", auth);

  useEffect(() => {
    const type = searchParams.get("type");
    const amount = Number(searchParams.get("amount"));
    const status = searchParams.get("status");

    if (
      type === "1" &&
      status === "PAID" &&
      !isNaN(amount) &&
      auth.user &&
      (auth.user.Balance || auth.user.Balance === 0)
    ) {
      refetchUser();
      navigate("/user/transactions");
    } else {
      // Nếu không hợp lệ, điều hướng về trang giao dịch
      if (type !== "1") {
        alert("Type sai");
      } else if (status !== "PAID") {
        alert("Status sai");
      } else if (isNaN(amount)) {
        alert("Amount không hợp lệ");
      } else if (!auth.user) {
        alert("User không tồn tại");
      } else if (!auth.user.Balance || auth.user.Balance !== 0) {
        alert("Không có balance");
      }
      navigate("/user/transactions");
    }
  }, []);

  return (
    <div className="w-full flex justify-center items-center">
      Đang xử lý giao dịch...
    </div>
  );
};

export default PaymentResultPage;
