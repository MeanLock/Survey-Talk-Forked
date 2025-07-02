import type React from "react";
import { useState, useMemo, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { Button, TextField, InputAdornment, Chip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./styles.scss";
import { updateFakeData } from "../../../../../redux/fake/fakeSlice";
import type { RootState } from "../../../../../redux/rootReducer";
import { updateAuthUser } from "../../../../../redux/auth/authSlice";
import { callAxiosRestApi } from "../../../../../core/api/rest-api/main/api-call";
import { loginRequiredAxiosInstance } from "../../../../../core/api/rest-api/config/instances/v2";
interface Props {
  balance: number | null;
}

interface MoneyInRecord {
  Id: number;
  Amount: number;
  CreatedAt: string;
  StatusId: number;
}

// Custom cell renderer for Amount column
const AmountCellRenderer = (params: any) => {
  return (
    <span className="amount-cell">{params.value.toLocaleString("vi-VN")}đ</span>
  );
};

// Custom cell renderer for Status column
const StatusCellRenderer = (params: any) => {
  const getStatusInfo = (statusId: number) => {
    switch (statusId) {
      case 1:
        return { label: "Success", className: "status-success" };
      default:
        return { label: "Unknown", className: "status-unknown" };
    }
  };

  const statusInfo = getStatusInfo(params.value);

  return (
    <Chip
      label={statusInfo.label}
      className={`status-chip ${statusInfo.className}`}
      size="small"
    />
  );
};

// Custom cell renderer for Date column
const DateCellRenderer = (params: any) => {
  const formatDate = (dateString: string) => {
    // Convert "16/06/2025 - 18:02:21" to more readable format
    const [datePart, timePart] = dateString.split(" - ");
    const [day, month, year] = datePart.split("/");
    return `${day}/${month}/${year} ${timePart}`;
  };

  return <span className="date-cell">{formatDate(params.value)}</span>;
};

export const MoneyIn: React.FC<Props> = ({ balance }) => {
  //TASK FAKE DATA, PHẢI BỎ KHI ĐÃ CÓ API
  const fake = useSelector((state: RootState) => state.fake);
  const user = useSelector((state: RootState) => state.auth.user);
  // STATES
  const [pushAmount, setPushAmount] = useState<string>("");
  const dispatch = useDispatch();

  const [targetDay, setTargetDay] = useState(null);

  // HOOKS
  useEffect(() => {
    fetchMockAPI();
  }, []);

  const fetchMockAPI = async () => {
    const apiUrl = "https://685b91fb89952852c2d9fd1e.mockapi.io/MoneyFlow";
    const res = await fetch(apiUrl);
    const data = await res.json();
    setTargetDay(data[5]);
  };

  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        headerName: "Mã Giao Dịch",
        field: "Id",
        width: 150,
        cellClass: "transaction-id-cell",
      },
      {
        headerName: "Số Tiền Nạp",
        field: "Amount",
        width: 180,
        cellRenderer: AmountCellRenderer,
      },
      {
        headerName: "Ngày Nạp",
        field: "CreatedAt",
        width: 200,
        cellRenderer: DateCellRenderer,
      },
      {
        headerName: "Trạng Thái",
        field: "StatusId",
        width: 150,
        cellRenderer: StatusCellRenderer,
      },
    ],
    []
  );

  const handlePushMoney = async () => {
    const amount = Number.parseInt(pushAmount);
    try {
      // const response = await callAxiosRestApi({
      //   instance: loginRequiredAxiosInstance,
      //   method: "post",
      //   url: `Payment/account/balance-deposits/create-payment-link`,
      //   data: {
      //     Amount: Number.parseInt(pushAmount),
      //     ReturnUrl: `http://localhost:3007/user/transactions/payment-result?type=1&amount=${amount}`,
      //     CancelUrl: `http://localhost:3007/user/transactions/payment-result?type=1&amount=${amount}`,
      //   },
      // });
      updateMoneyInById(7, amount);
      // if (response.success) {

      //   const PaymentLink = response.data.PaymentLink;
      //   window.open(PaymentLink, "_blank");
      // }
    } catch (error) {
      console.error("Error creating payment link:", error);
    }
  };

  async function updateMoneyInById(id: any, amountToAdd: any) {
    const apiUrl = `https://685b91fb89952852c2d9fd1e.mockapi.io/MoneyFlow/${id}`;

    try {
      // 1. Lấy dữ liệu hiện tại của object
      const res = await fetch(apiUrl);
      const currentData = await res.json();

      // 2. Tính moneyIn mới
      const updatedMoneyIn = (parseInt(currentData.moneyIn) || 0) + amountToAdd;

      // 3. Gửi PUT để cập nhật
      const updateRes = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...currentData,
          moneyIn: updatedMoneyIn,
        }),
      });

      const updated = await updateRes.json();
      console.log("✅ Đã cập nhật thành công:", updated);
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật:", err);
    }
  }

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/[^0-9]/g, "");
    setPushAmount(value);
  };

  const formatDisplayAmount = (value: string) => {
    if (!value) return "";
    return Number.parseInt(value).toLocaleString("vi-VN");
  };

  return (
    <div className="money-in w-full flex flex-col items-start">
      <p className="money-in__remain-title">Số dư khả dụng</p>
      <p className="money-in__remain-value">
        {user?.Balance?.toLocaleString("vi-VN")}đ
      </p>

      <div className="w-full grid grid-cols-2 gap-6 mt-5">
        <div className="money-in-table">
          <h3 className="table-title">Lịch sử nạp tiền</h3>
          <div className="ag-theme-alpine table-container">
            <AgGridReact
              rowData={fake.MoneyInData}
              columnDefs={columnDefs}
              domLayout="autoHeight"
              suppressHorizontalScroll={false}
              pagination={true} // Bật pagination
              paginationPageSize={8}
              rowHeight={50}
              defaultColDef={{
                sortable: true,
                filter: true,
                resizable: true,
              }}
            />
          </div>
        </div>

        <div className="money-in-push">
          <h3 className="push-title">Nạp tiền vào tài khoản</h3>
          <div className="push-form">
            <div className="amount-input-container">
              <TextField
                fullWidth
                label="Số tiền muốn nạp"
                value={formatDisplayAmount(pushAmount)}
                onChange={handleAmountChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">đ</InputAdornment>
                  ),
                }}
                placeholder="Nhập số tiền"
                className="amount-input"
              />
            </div>

            <div className="quick-amounts">
              <p className="quick-amounts-title">Chọn nhanh:</p>
              <div className="quick-amounts-buttons">
                {[50000, 100000, 200000, 500000].map((amount) => (
                  <Button
                    key={amount}
                    variant="outlined"
                    className="quick-amount-btn"
                    onClick={() => setPushAmount(amount.toString())}
                  >
                    {amount.toLocaleString("vi-VN")}đ
                  </Button>
                ))}
              </div>
            </div>

            <Button
              variant="contained"
              fullWidth
              className="push-money-btn"
              onClick={handlePushMoney}
              disabled={!pushAmount || Number.parseInt(pushAmount) <= 0}
            >
              Nạp tiền
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
