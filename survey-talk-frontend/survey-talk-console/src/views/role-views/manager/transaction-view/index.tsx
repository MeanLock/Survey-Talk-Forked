"use client"

import { createContext, type FC, useEffect, useMemo, useState } from "react"
import "./styles.scss"
import { AgGridReact } from "ag-grid-react"
import {
  CButton,
  CButtonGroup,
  CCard,
  CCol,
  CRow,
  CSpinner,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react"
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community"
import { Eye } from "phosphor-react"

ModuleRegistry.registerModules([AllCommunityModule])

// Mock data for withdrawal requests
export const WithdrawMoneyRequestMockData = [
  {
    Id: 1,
    CustomerName: "Hoàng Minh Lộc",
    CreateDate: "2025-06-25 ",
    StatusId: 1,
    TransferDate: null,
    TransactionInformations: {
      Id: 1,
      BankId: "970415",
      BankName: "MB",
      AccountNo: "0896893636",
      Amount: 50000,
      AccountName: "HOANG MINH LOC",
    },
  },
  {
    Id: 2,
    CustomerName: "Minh Lộc",
    CreateDate: "2024-01-18 ",
    StatusId: 2,
    TransferDate: "2024-01-15 09:15:00",
    TransactionInformations: {
      Id: 2,
      BankId: "970422",
      BankName: "MB Bank",
      AccountNo: "9876543210",
      Amount: 75000,
      AccountName: "TRAN THI B",
    },
  },
  {
    Id: 3,
    CustomerName: "DUONG XUAN BACH",
    CreateDate: "2024-06-17 ",
    StatusId: 2,
    TransferDate: "2024-01-15 ",
    TransactionInformations: {
      Id: 3,
      BankId: "970436",
      BankName: "Vietcombank",
      AccountNo: "5555666677",
      Amount: 10000,
      AccountName: "LE VAN C",
    },
  },
  {
    Id: 4,
    CustomerName: "HOANG MINH LOC",
    CreateDate: "2024-06-16 ",
    StatusId: 2,
    TransferDate: "2024-01-13 08:30:00",
    TransactionInformations: {
      Id: 4,
      BankId: "970418",
      BankName: "BIDV",
      AccountNo: "1111222233",
      Amount: 30000,
      AccountName: "PHAM THI D",
    },
  },
  {
    Id: 5,
    CustomerName: "TRAN QUANG PHAT THINH",
    CreateDate: "2024-06-17 ",
    StatusId: 2,
    TransferDate: "2024-01-15 09:15:00",
    TransactionInformations: {
      Id: 5,
      BankId: "970407",
      BankName: "Techcombank",
      AccountNo: "7777888899",
      Amount: 8500,
      AccountName: "DANG VAN E",
    },
  },
  {
    Id: 6,
    CustomerName: "TRAN QUANG PHAT THINH",
    CreateDate: "2024-06-17",
    StatusId: 2,
    TransferDate: "2024-01-11 14:20:00",
    TransactionInformations: {
      Id: 6,
      BankId: "970432",
      BankName: "VPBank",
      AccountNo: "4444555566",
      Amount: 65000,
      AccountName: "TRAN QUANG PHAT THINH",
    },
  },
  {
    Id: 7,
    CustomerName: "TRAN QUANG PHAT THINH",
    CreateDate: "2024-06-17 ",
    StatusId: 2,
    TransferDate: "2024-01-15 09:15:00",
    TransactionInformations: {
      Id: 7,
      BankId: "970403",
      BankName: "Sacombank",
      AccountNo: "2222333344",
      Amount: 45000,
      AccountName: "LY VAN G",
    },
  },
  {
    Id: 8,
    CustomerName: "TRAN QUANG PHAT THINH",
    CreateDate: "2024-06-17 ",
    StatusId: 2,
    TransferDate: "2024-01-09 10:45:00",
    TransactionInformations: {
      Id: 8,
      BankId: "970448",
      BankName: "OCB",
      AccountNo: "8888999900",
      Amount: 9000,
      AccountName: "HOANG THI H",
    },
  }
]

type TransactionViewProps = {}

interface TransactionViewContextProps {
  handleDataChange: () => void
  updateTransactionStatus: (id: number, status: number) => void
}

interface GridState {
  columnDefs: any[]
  rowData: any[]
}

interface QRModalProps {
  visible: boolean
  onClose: () => void
  transaction: any
  onConfirm: () => void
  onCancel: () => void
}

export const TransactionViewContext = createContext<TransactionViewContextProps | null>(null)

const QRModal: FC<QRModalProps> = ({ visible, onClose, transaction, onConfirm, onCancel }) => {
  if (!transaction) return null

  const { BankName, AccountNo, Amount, AccountName } = transaction.TransactionInformations
  const qrUrl = `https://img.vietqr.io/image/${BankName}-${AccountNo}-compact.png?amount=${Amount}&addInfo=Survey Talk Chuyen Tien&accountName=${AccountName}`

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  return (
    <CModal visible={visible} onClose={onClose} size="lg">
      <CModalHeader>
        <CModalTitle>Chi tiết yêu cầu rút tiền</CModalTitle>
      </CModalHeader>
      <CModalBody className="text-center">
        <div className="mb-4">
          <h5>Thông tin khách hàng</h5>
          <p>
            <strong>Tên:</strong> {transaction.CustomerName}
          </p>
          <p>
            <strong>Số tiền rút:</strong> {formatCurrency(Amount)}
          </p>
          <p>
            <strong>Ngân hàng:</strong> {transaction.TransactionInformations.BankName}
          </p>
          <p>
            <strong>Số tài khoản:</strong> {AccountNo}
          </p>
          <p>
            <strong>Tên tài khoản:</strong> {AccountName}
          </p>
        </div>

        <div className="mb-4">
          <h6>Mã QR chuyển khoản</h6>
          <img
            src={qrUrl || "/placeholder.svg"}
            alt="QR Code"
            style={{ maxWidth: "300px", width: "100%" }}
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg?height=300&width=300"
            }}
          />
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="danger" onClick={onCancel} style={{color:'white'}}>
          Hủy
        </CButton>
        <CButton color="success" onClick={onConfirm} style={{color:'white'}}>
          Xác nhận chuyển thành công
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

const state_creator = (table: any[], updateStatus: (id: number, status: number) => void) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Chưa xử lý"
    return new Date(dateString).toLocaleString("vi-VN")
  }

  const state = {
    columnDefs: [
      { headerName: "ID", field: "Id", flex: 0.3 },
      { headerName: "Họ và Tên", field: "CustomerName", flex: 0.9 },
      {
        headerName: "Số tiền rút",
        field: "TransactionInformations.Amount",
        flex: 0.8,
        cellRenderer: (params: any) => {
          return formatCurrency(params.data.TransactionInformations.Amount)
        },
      },
     
      {
        headerName: "Thời gian chuyển",
        field: "TransferDate",
        flex: 1,
        cellRenderer: (params: any) => {
          return formatDate(params.data.TransferDate)
        },
      },
      {
        headerName: "Status",
        field: "StatusId",
        flex: 0.8,
        cellClass: "d-flex align-items-center",
        cellRenderer: (params: any) => {
          const status = {
            title: params.data.StatusId === 1 ? "Chờ xử lý" : "Thành công",
            color: params.data.StatusId === 1 ? "warning" : "success",
            bg: "light",
          }
          return (
            <CCard
              textColor={status.color}
              style={{ width: "120px" }}
              className={`text-center fw-bold rounded-pill px-2 border-2 border-${status.color} bg-${status.bg}`}
            >
              {status.title}
            </CCard>
          )
        },
      },
      {
        headerName: "Option",
        cellClass: "d-flex justify-content-center py-0",
        cellRenderer: (params: any) => {
          return (
            <CButtonGroup style={{ width: "100%", height: "100%" }} role="group">
              <EyeButton transaction={params.data} updateStatus={updateStatus} />
            </CButtonGroup>
          )
        },
        flex: 0.5,
      },
    ],
    rowData: table,
  }
  return state
}

const EyeButton: FC<{ transaction: any; updateStatus: (id: number, status: number) => void }> = ({
  transaction,
  updateStatus,
}) => {
  const [modalVisible, setModalVisible] = useState(false)

  const handleConfirm = () => {
    updateStatus(transaction.Id, 2)
    setModalVisible(false)
  }

  const handleCancel = () => {
    setModalVisible(false)
  }

  return (
    <>
      <CButton
        color="white"
        onClick={() => setModalVisible(true)}
        style={{ border: "none", background: "transparent" }}
      >
        <Eye size={30} color="purple" weight="duotone" />
      </CButton>

      <QRModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        transaction={transaction}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  )
}

const TransactionView: FC<TransactionViewProps> = () => {
  const [state, setState] = useState<GridState | null>(null)
  const [withdrawalData, setWithdrawalData] = useState(WithdrawMoneyRequestMockData)

  const updateTransactionStatus = (id: number, status: number) => {
    const updatedData = withdrawalData.map((item) => {
      if (item.Id === id) {
        return {
          ...item,
          StatusId: status,
          TransferDate: status === 2 ? new Date().toISOString() : null,
        }
      }
      return item
    })
    setWithdrawalData(updatedData)
    setState(state_creator(updatedData, updateTransactionStatus))
  }

  const handleDataChange = async () => {
    setState(state_creator(withdrawalData, updateTransactionStatus))
  }

  useEffect(() => {
    handleDataChange()
  }, [withdrawalData])

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      filter: true,
      autoHeight: true,
      resizable: true,
      wrapText: true,
      cellClass: "d-flex align-items-center",
      editable: false,
    }
  }, [])

  return (
    <TransactionViewContext.Provider
      value={{
        handleDataChange: handleDataChange,
        updateTransactionStatus: updateTransactionStatus,
      }}
    >
      <CRow>
        <h3 className="transaction__title mb-5">Yêu cầu rút tiền</h3>
        <CCol xs={12}>
          {state === null ? (
            <CButton className="w-100" color="secondary" disabled>
              <CSpinner as="span" size="sm" aria-hidden="true" />
              Loading...
            </CButton>
          ) : (
            <div id="withdrawal-table" className="">
              <AgGridReact
                columnDefs={state.columnDefs}
                rowData={state.rowData}
                defaultColDef={defaultColDef}
                rowHeight={70}
                headerHeight={40}
                pagination={true}
                paginationPageSize={10}
                paginationPageSizeSelector={[10, 20, 50, 100]}
                domLayout="autoHeight"
              />
            </div>
          )}
        </CCol>
      </CRow>
    </TransactionViewContext.Provider>
  )
}

export default TransactionView
