import { Tab, Tabs } from "@mui/material";
import { useState } from "react";
import "./styles.scss";
import { MoneyIn } from "./money-in/MoneyIn";
import { MoneyOut } from "./money-out/MoneyOut";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../redux/rootReducer";
const TransactionsPage = () => {
  // REDUX
  const auth = useSelector((state: RootState) => state.auth);

  // STATES
  const [tab, setTab] = useState(1);

  // FUNCTIONS
  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <div className="transaction-screen w-full flex flex-col p-10 items-center">
      <div className="transaction-screen__title w-full flex justify-start">
        <p>Quản Lý Giao Dịch Của Bạn</p>
      </div>

      <div className="mt-5 ml-5 w-full">
        <Tabs
          value={tab}
          onChange={handleChangeTab}
          textColor="primary"
          indicatorColor="primary"
          aria-label="secondary tabs example"
        >
          <Tab value={1} label="Nạp Tiền" />
          <Tab value={2} label="Rút Tiền" />
        </Tabs>
      </div>

      <div className="w-full p-5">
        {tab === 1 ? <MoneyIn balance={100000} /> : <MoneyOut />}
      </div>
    </div>
  );
};

export default TransactionsPage;
