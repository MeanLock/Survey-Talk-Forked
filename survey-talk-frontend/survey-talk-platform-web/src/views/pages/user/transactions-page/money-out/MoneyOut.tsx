

import { useSelector, useDispatch } from "react-redux";
import { useState, useMemo, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import {
  Button,
  TextField,
  InputAdornment,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Box,
  Typography,
  Alert,
} from "@mui/material";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./styles.scss";
import { banks } from "../../../../../core/mockData/banks";
import type { RootState } from "../../../../../redux/rootReducer";
import { updateAuthUser } from "../../../../../redux/auth/authSlice";
import { callAxiosRestApi } from "@/core/api/rest-api/main/api-call";
import { loginRequiredAxiosInstance } from "@/core/api/rest-api/config/instances/v2";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

type Props = {
  balance: number;
};

interface MoneyOutRecord {
  Id: string;
  CustomerName: string;
  CreateDate: number;
  StatusId: number;
  TransferDate: number | null;
  BankId: string;
  BankName: string;
  AccountNo: string;
  Amount: number;
  AccountName: string;
}

interface Bank {
  id: number;
  name: string;
  code: string;
  bin: string;
  shortName: string;
  logo: string;
  transferSupported: number;
  lookupSupported: number;
  short_name: string;
  support: number;
  isTransfer: number;
  swift_code: string;
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
        return { label: "Đang xử lý", className: "status-processing" };
      case 2:
        return { label: "Thành công", className: "status-success" };
      case 3:
        return { label: "Thất bại", className: "status-failed" };
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
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    const [datePart, timePart] = dateString.split(" - ");
    const [day, month, year] = datePart.split("/");
    return `${day}/${month}/${year} ${timePart}`;
  };

  return <span className="date-cell">{formatDate(params.value)}</span>;
};

export const MoneyOut: React.FC<Props> = ({ balance }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [withdrawalHistory, setWithdrawalHistory] = useState<MoneyOutRecord[]>(
    []
  );
  const navigate = useNavigate();
  // Fetch withdrawal history
  useEffect(() => {
    const fetchWithdrawalHistory = async () => {
      try {
        const response = await fetch(
          "https://6857de4821f5d3463e566b36.mockapi.io/withdrawalRequests"
        );
        const data = await response.json();
        // Filter records for current user
        const userWithdrawals = data.filter(
          (record: any) => record.CustomerName === user?.FullName
        );
        setWithdrawalHistory(userWithdrawals);
      } catch (error) {
        console.error("Error fetching withdrawal history:", error);
      }
    };

    fetchWithdrawalHistory();
  }, [user?.FullName]);

  // STATES
  const [bankId, setBankId] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [amount, setAmount] = useState("");
  const [accountName, setAccountName] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        headerName: "Mã Giao Dịch",
        field: "Id",
        width: 120,
      },
      {
        headerName: "Số Tiền Rút",
        field: "Amount",
        width: 150,
        cellRenderer: AmountCellRenderer,
      },
      {
        headerName: "Ngân Hàng",
        field: "BankName",
        width: 200,
      },
      {
        headerName: "Thời gian gửi YC",
        field: "CreateDate",
        width: 160,
        cellRenderer: (params: any) => {
          const date = new Date(params.value * 1000);
          return date.toLocaleString("vi-VN");
        },
      },
      {
        headerName: "Trạng Thái",
        field: "StatusId",
        width: 130,
        cellRenderer: StatusCellRenderer,
      },
      {
        headerName: "Thời gian thành công",
        field: "TransferDate",
        width: 160,
        cellRenderer: (params: any) => {
          if (!params.value) return "-";
          const date = new Date(params.value * 1000);
          return date.toLocaleString("vi-VN");
        },
      },
    ],
    []
  );
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!bankId) {
      newErrors.bankId = "Vui lòng chọn ngân hàng";
    }

    if (!accountNo.trim()) {
      newErrors.accountNo = "Vui lòng nhập số tài khoản";
    }

    if (!accountName.trim()) {
      newErrors.accountName = "Vui lòng nhập tên tài khoản";
    }

    const amountNum = Number.parseInt(amount);
    if (!amount || amountNum <= 0) {
      newErrors.amount = "Vui lòng nhập số tiền";
    } else if (amountNum < 50000) {
      newErrors.amount = "Số tiền rút tối thiểu là 50,000đ";
    } else if (amountNum > balance) {
      newErrors.amount = "Số dư không đủ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleWithdrawMoney = async () => {
    if (!validateForm()) return;

    const selectedBank = banks.find((bank) => bank.code === bankId);
    if (!selectedBank) return;

    try {
      const withdrawalResponse = await callAxiosRestApi({
        instance: loginRequiredAxiosInstance,
        method: "post",
        url: `Payment/account/balance-withdrawal`,
        data: {
          Amount: Number.parseInt(amount),
          BankAccountNumber: accountNo,
          BankCode: bankId,
          Description: `Rút tiền về tài khoản ${accountNo} - ${selectedBank.name}`,
        },
      });

      if (!withdrawalResponse.success) {
        toast.error(`Rút tiền tạm thời lỗi, thử lại sau!`);
        return;
      }
      const newWithdrawal = {
        CustomerName: user?.FullName,
        CreateDate: Math.floor(Date.now() / 1000), // Current timestamp in seconds
        StatusId: 1, // Pending
        TransferDate: null,
        BankId: bankId,
        BankName: selectedBank.name,
        AccountNo: accountNo,
        Amount: Number.parseInt(amount),
        AccountName: accountName,
      };

      // Create withdrawal request
      const response = await fetch(
        "https://6857de4821f5d3463e566b36.mockapi.io/withdrawalRequests",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newWithdrawal),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create withdrawal request");
      }


      // Reset form
      setBankId("");
      setAccountNo("");
      setAmount("");
      setAccountName("");
      setErrors({});

      // Refresh withdrawal history
      const updatedHistoryResponse = await fetch(
        "https://6857de4821f5d3463e566b36.mockapi.io/withdrawalRequests"
      );
      const updatedHistory = await updatedHistoryResponse.json();
      const userWithdrawals = updatedHistory.filter(
        (record : any) => record.CustomerName === user?.FullName
      );
      navigate(0);
      setWithdrawalHistory(userWithdrawals);
      toast.success(`Rút tiền thành công!`);
    } catch (error) {
      console.error("Error creating withdrawal request:", error);
      // Handle error (show error message to user)
    }
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/[^0-9]/g, "");
    setAmount(value);
  };

  const formatDisplayAmount = (value: string) => {
    if (!value) return "";
    return Number.parseInt(value).toLocaleString("vi-VN");
  };

  async function updateMoneyOutById(id: any, amountToAdd: any) {
    const apiUrl = `https://685b91fb89952852c2d9fd1e.mockapi.io/MoneyFlow/${id}`;

    try {
      // 1. Lấy dữ liệu hiện tại của object
      const res = await fetch(apiUrl);
      const currentData = await res.json();

      // 2. Tính moneyOut mới
      const updatedMoneyOut =
        (parseInt(currentData.moneyIn) || 0) + amountToAdd;

      // 3. Gửi PUT để cập nhật
      const updateRes = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...currentData,
          moneyOut: updatedMoneyOut,
        }),
      });

      const updated = await updateRes.json();
      console.log("✅ Đã cập nhật thành công:", updated);
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật:", err);
    }
  }

  const selectedBank = banks.filter((bank) => bank.code === bankId)[0];

  return (
    <div className="money-out w-full flex flex-col items-start">
      <p className="money-out__remain-title">Số dư khả dụng</p>
      <p className="money-out__remain-value">
        {balance.toLocaleString("vi-VN")}đ
      </p>

      <div className="w-full grid grid-cols-2 gap-6 mt-5">
        <div className="money-out-table">
          <h3 className="table-title">Lịch sử rút tiền</h3>
          <div className="ag-theme-alpine table-container">
            <AgGridReact
              rowData={withdrawalHistory}
              columnDefs={columnDefs}
              domLayout="normal"
              rowHeight={50}
              paginationPageSize={5}
              pagination={true}
              suppressHorizontalScroll={false}
              defaultColDef={{
                sortable: true,
                filter: true,
                resizable: true,
              }}
            />
          </div>
        </div>

        <div className="money-out-withdraw">
          <h3 className="withdraw-title">Tạo yêu cầu rút tiền</h3>
          <div className="withdraw-form">
            <FormControl
              fullWidth
              className="bank-select"
              error={!!errors.bankId}
            >
              <InputLabel>Chọn ngân hàng</InputLabel>
              <Select
                value={bankId}
                label="Chọn ngân hàng"
                onChange={(e) => setBankId(e.target.value)}
                renderValue={(selected) => {
                  if (!selected) return "";
                  const bank = banks.find((b) => b.code === selected);
                  return (
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar src={bank?.logo} sx={{ width: 24, height: 24 }} />
                      <Typography>{bank?.shortName}</Typography>
                    </Box>
                  );
                }}
              >
                {banks.map((bank) => (
                  <MenuItem key={bank.code} value={bank.code}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar src={bank.logo} sx={{ width: 32, height: 32 }} />
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {bank.shortName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {bank.name}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {errors.bankId && (
                <Typography className="error-text">{errors.bankId}</Typography>
              )}
            </FormControl>

            <TextField
              fullWidth
              label="Số tài khoản"
              value={accountNo}
              onChange={(e) => setAccountNo(e.target.value)}
              placeholder="Nhập số tài khoản"
              className="account-input"
              error={!!errors.accountNo}
              helperText={errors.accountNo}
            />

            <TextField
              fullWidth
              label="Tên tài khoản"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="Nhập tên chủ tài khoản"
              className="account-name-input"
              error={!!errors.accountName}
              helperText={errors.accountName}
            />

            <TextField
              fullWidth
              label="Số tiền muốn rút"
              value={formatDisplayAmount(amount)}
              onChange={handleAmountChange}
              InputProps={{
                endAdornment: <InputAdornment position="end">đ</InputAdornment>,
              }}
              placeholder="Nhập số tiền (tối thiểu 50,000đ)"
              className="amount-input"
              error={!!errors.amount}
              helperText={errors.amount}
            />

            {Number.parseInt(amount) > balance && (
              <Alert severity="error" className="balance-error">
                Số dư không đủ. Số dư hiện tại: {balance}đ
              </Alert>
            )}

            <Button
              variant="contained"
              fullWidth
              className="withdraw-money-btn"
              onClick={handleWithdrawMoney}
              disabled={
                !bankId ||
                !accountNo.trim() ||
                !accountName.trim() ||
                !amount ||
                Number.parseInt(amount) < 50000 ||
                Number.parseInt(amount) > balance
              }
            >
              Tạo yêu cầu rút tiền
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
