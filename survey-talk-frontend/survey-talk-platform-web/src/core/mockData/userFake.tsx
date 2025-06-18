import { homeSurveysAlternativeData, homeSurveysData } from "./mockData";

export const takerFake = {
  FullName: "Hoàng Minh Lộc",
  MainImageUrl:
    "https://i.pinimg.com/736x/80/dd/bf/80ddbfee8cf5f2f3e98ad7dadef8b7f9.jpg",
  SuitYouBest: homeSurveysData.suitYouBest,
  Point: 10000,
  Level: 1,
  Xp: 150,
  MoneyInData: [
    { Id: 1, Amount: 20000, CreatedAt: "16/06/2025 - 18:02:21", StatusId: 1 },
    { Id: 2, Amount: 10000, CreatedAt: "16/06/2025 - 18:05:00", StatusId: 1 },
    { Id: 3, Amount: 10000, CreatedAt: "16/06/2025 - 18:12:24", StatusId: 1 },
    { Id: 4, Amount: 10000, CreatedAt: "16/06/2025 - 18:38:32", StatusId: 1 },
    { Id: 5, Amount: 10000, CreatedAt: "16/06/2025 - 18:45:57", StatusId: 1 },
    { Id: 6, Amount: 10000, CreatedAt: "16/06/2025 - 18:50:11", StatusId: 1 },
    { Id: 7, Amount: 10000, CreatedAt: "16/06/2025 - 19:00:45", StatusId: 1 },
    { Id: 8, Amount: 10000, CreatedAt: "16/06/2025 - 19:15:30", StatusId: 1 },
    { Id: 9, Amount: 10000, CreatedAt: "16/06/2025 - 19:24:46", StatusId: 1 },
  ],
  MoneyOutData: [
    {
      Id: 1,
      Amount: 50000,
      CreatedAt: "16/06/2025 - 20:23:44",
      AccountId: "089 689 3636",
      BankName: "MB Bank - Ngân Hàng Quân Đội VN",
      StatusId: 1,
      SuccessAt: "16/06/2025 - 20:23:44",
    },
  ],
};

export const requesterFake = {
  FullName: "Ha Nguyen Hao",
  MainImageUrl:
    "https://i.pinimg.com/736x/b2/81/22/b28122c859a4f9280df9df2c499abdd3.jpg",
  SuitYouBest: homeSurveysAlternativeData.suitYouBest,
  Point: 1000000,
  Level: 2,
  Xp: 275,
  MoneyInData: [
    { Id: 1, Amount: 20000, CreatedAt: "16/06/2025 - 18:02:21", StatusId: 1 },
    { Id: 2, Amount: 10000, CreatedAt: "16/06/2025 - 18:05:00", StatusId: 1 },
    { Id: 3, Amount: 10000, CreatedAt: "16/06/2025 - 18:12:24", StatusId: 1 },
    { Id: 4, Amount: 10000, CreatedAt: "16/06/2025 - 18:38:32", StatusId: 1 },
    { Id: 5, Amount: 10000, CreatedAt: "16/06/2025 - 18:45:57", StatusId: 1 },
    { Id: 6, Amount: 10000, CreatedAt: "16/06/2025 - 18:50:11", StatusId: 1 },
    { Id: 7, Amount: 10000, CreatedAt: "16/06/2025 - 19:00:45", StatusId: 1 },
    { Id: 8, Amount: 10000, CreatedAt: "16/06/2025 - 19:15:30", StatusId: 1 },
    { Id: 9, Amount: 10000, CreatedAt: "16/06/2025 - 19:24:46", StatusId: 1 },
  ],
  MoneyOutData: [
    {
      Id: 1,
      Amount: 50000,
      CreatedAt: "16/06/2025 - 20:23:44",
      AccountId: "089 689 3636",
      BankName: "MB Bank - Ngân Hàng Quân Đội VN",
      StatusId: 1,
      SuccessAt: "16/06/2025 - 20:23:44",
    },
  ],
};
