export type SurveyCommunityCard = {
  Id: number;
  RequesterId: number;
  Title: string;
  Description: string | null;
  SurveyTypeId: number;
  SurveyTopicId: number;
  SurveySpecificTopicId: number;
  StartDate: string;
  EndDate: string | null;
  Kpi: number;
  SecurityModeId: number;
  TheoryPrice: number | null;
  ExtraPrice: number | null;
  TakerBaseRewardPrice: number | null;
  ProfitPrice: number | null;
  AllocBaseAmount: number | null;
  AllocTimeAmount: number | null;
  AllocLevelAmount: number | null;
  MaxXp: number | null;
  IsAvailable: boolean;
  SlotsLeft: number | null;
  ConfigJsonString: string;
  PublishedAt: string | null;
  DeletedAt: string | null;
  CreatedAt: string | null;
  UpdatedAt: string | null;
  SurveyStatusId: number;
  MainImageUrl: string;
  BackgroundImageUrl: string;
  CurrentSurveyRewardTracking: CurrentSurveyRewardTracking;
};

export type SurveyFeatures = {
  suitYouBest: SurveyCommunityCard[];
  bigBonus: SurveyCommunityCard[];
  baseOnFavTopic: SurveyCommunityCard[];
};

export type CurrentSurveyRewardTracking = {
  Id: number;
  SurveyId: number;
  RewardPrice: number;
  RewardXp: number;
  CreatedAt: string;
};

export type SurveyStatus = {
  id: number;
  name: string;
};

export type SurveyTopic = {
  id: number;
  name: string;
};

export type SurveyTakenResult = {
  Id: number;
  SurveyId: number;
  TakerId: number;
  IsValid: boolean;
  InvalidReason: string | null;
  MoneyEarned: number | null;
  XpEarned: number | null;
  CompletedAt: string;
  Taker: {
    Id: number;
    FullName: string;
    Dob: string;
    Gender: string;
    MainImageUrl: string;
  };
};

export type VersionBasicInformations = {
  Version: number;
  SurveyVersionStatusId: number;
  ContributorCount: number;
  CurrentVersionPrice: number;
  ExpiredAt: string;
  PublishAt: string;
};

// SURVEY COMMUNITY

// 1. Cho Customer ở trang chính
export type SurveyCommunityFeatures = {
  suitYouBest: SurveyCommunity[];
  bigBonus: SurveyCommunity[];
  baseOnFavTopic: SurveyCommunity[];
};

// 2. Cho Customer ở danh sách khảo sát
export type SurveyCommunity = {
  Id: number;
  Title: string;
  Description: string;
  SurveyTopicId: number;
  SurveySpecificTopicId: number;
  StartDate: string | null;
  EndDate: string | null;
  SecurityModeId: number;
  IsAvailable: boolean;
  PublishedAt: string | null;
  TakerBaseRewardPrice: number | null;
  ConfigJsonString: string;
  SurveyPrivateData: {
    RequesterId: number;
    SurveyTypeId: number;
    Kpi: number;
    TheoryPrice: number;
    ExtraPrice: number;
    ProfitPrice: number;
    AllocBaseAmount: number;
    AllocTimeAmount: number;
    AllocLevelAmount: number;
    MaxXp: number;
    DeletedAt: string;
    CreatedAt: string;
    UpdatedAt: string;
  } | null;
  SurveyStatusId: number;
  MainImageUrl: string | null;
  BackgroundImageUrl: string | null;
  QuestionCount: number;
  SlotsLeft: number | null;
  CurrentSurveyRewardTracking: CurrentSurveyRewardTracking | null;
};

// 3. Cho Requester ở trang manage
export type SurveyCommunityMe = {
  Id: number;
  Title: string;
  Description: string;
  SurveyTopicId: number;
  SurveySpecificTopicId: number;
  StartDate: string;
  EndDate: string;
  SecurityModeId: number;
  IsAvailable: boolean;
  PublishedAt: string | null;
  TakerBaseRewardPrice: number | null;
  ConfigJsonString: string;
  SurveyPrivateData: {
    RequesterId: number;
    SurveyTypeId: number;
    Kpi: number;
    TheoryPrice: number;
    ExtraPrice: number;
    ProfitPrice: number;
    AllocBaseAmount: number;
    AllocTimeAmount: number;
    AllocLevelAmount: number;
    MaxXp: number;
    DeletedAt: string;
    CreatedAt: string;
    UpdatedAt: string;
  } | null;
  SurveyStatusId: number;
  MainImageUrl: string | null;
  BackgroundImageUrl: string | null;
  QuestionCount: number;
  SlotsLeft: number | null;
  CurrentSurveyRewardTracking: CurrentSurveyRewardTracking | null;
  SurveyTakenResult: SurveyTakenResult[];
};

// 4. Cho Taker lấy ra làm
export type QuestionConfigJson = {
  [key: string]: any;
};

export type QuestionOption = {
  SurveyOptionId: number;
  Content: string | null;
  Order: number;
  MainImageUrl: string | null;
};

export type SurveyQuestion = {
  Id: number;
  QuestionTypeId: number;
  Version: number | null;
  MainImageUrl: string | null;
  Content: string | null;
  Description: string | null;
  TimeLimit: number;
  IsVoice: boolean;
  Order: number;
  ConfigJson: QuestionConfigJson;
  Options: QuestionOption[];
};

export type SurveyTaking = {
  Id: number;
  RequesterId: number;
  Title: string;
  Description: string;
  MarketSurveyVersionStatusId: number | null;
  SurveyTypeId: number;
  SurveyTopicId: number;
  SurveySpecificTopicId: number;
  SurveyStatusId: number;
  MainImageUrl: string | null;
  Version: number | null;
  SecurityModeId: number;
  BackgroundImageUrl: string | null;
  ConfigJson: {
    BackgroundGradient1Color: string | null;
    BackgroundGradient2Color: string | null;
    TitleColor: string | null;
    ContentColor: string | null;
    ButtonBackgroundColor: string | null;
    ButtonContentColor: string | null;
    Password: string | null;
    Brightness: number | null; //(OPTIONAL)
  };
  Questions: SurveyQuestion[];
};

// Các Survey được lấy ra từ /api/Survey/core/community/surveys (CUSTOMER)
// export type SurveyFromSurveyListCustomer = {
//   Id: number;
//   Title: string;
//   Description: string;
//   SurveyTopicId: number;
//   SurveySpecificTopicId: number;
//   StartDate: string; // FORMAT: YYYY-MM-DD
//   EndDate: string; // FORMAT: YYYY-MM-DD
//   SecurityModeId: number;
//   IsAvailable: boolean;
//   PublishedAt: string; // FORMAT: YYYY-MM-DDTH:M:SZ
//   TakerBaseRewardPrice: number;
//   ConfigJsonString: string;
//   SurveyStatusId: number;
//   SlotsLeft: number;
//   MainImageUrl: string | null;
//   BackgroundImageUrl: string | null;
//   QuestionCount: number;
//   CurrentSurveyRewardTracking: CurrentSurveyRewardTracking;
// };

// DATA MARKET
export type SurveyDataMarket = {
  Id: number;
  Title: string;
  Description: string;
  SurveyTopicId: number;
  SurveySpecificTopicId: number;
  StartDate: string | null;
  EndDate: string | null;
  SecurityModeId: number;
  IsAvailable: boolean;
  PublishedAt: string | null;
  TakerBaseRewardPrice: number | null;
  ConfigJsonString: string;
  SurveyPrivateData: {
    RequesterId: number;
    SurveyTypeId: number;
    Kpi: number;
    TheoryPrice: number;
    ExtraPrice: number;
    ProfitPrice: number;
    AllocBaseAmount: number;
    AllocTimeAmount: number;
    AllocLevelAmount: number;
    MaxXp: number;
    DeletedAt: string;
    CreatedAt: string;
    UpdatedAt: string;
  } | null;
  SurveyStatusId: number;
  MainImageUrl: string | null;
  BackgroundImageUrl: string | null;
  QuestionCount: number;
  SlotsLeft: number | null;
  VersionTrackings: VersionBasicInformations[];
};

export type DataMarketOption = {
  Id: number;
  SurveyQuestionId: number;
  Content: string;
  Order: number;
  MainImageUrl: string | null;
};

export type DataMarketQuestion = {
  Id: number;
  SurveyId: number;
  QuestionTypeId: number;
  Content: string | null;
  Description: string | null;
  TimeLimit: number;
  IsVoiced: boolean;
  Order: number;
  ConfigJsonString: string;
  DeletedAt: string | null;
  Version: number;
  MainImageUrl: string | null;
  Options: DataMarketOption[] | null;
};

export type SurveyDataMarketDetails = {
  Id: number;
  Title: string;
  Description: string;
  SurveyTopicId: number;
  SurveySpecificTopicId: number;
  StartDate: string;
  EndDate: string | null;
  SecurityModeId: number;
  IsAvailable: boolean;
  PublishedAt: string;
  TakerBaseRewardPrice: number | null;
  ConfigJsonString: string;
  SurveyPrivateData: {
    RequesterId: number;
    SurveyTypeId: number;
    Kpi: number | null;
    TheoryPrice: number | null;
    ExtraPrice: number | null;
    ProfitPrice: number | null;
    AllocBaseAmount: number | null;
    AllocTimeAmount: number | null;
    AllocLevelAmount: number | null;
    MaxXp: number | null;
    DeletedAt: string | null;
    CreatedAt: string | null;
    UpdatedAt: string | null;
  } | null;
  SurveyStatusId: number;
  MainImageUrl: string | null;
  BackgroundImageUrl: string | null;
  QuestionCount: number | null;
  VersionTrackings: VersionBasicInformations[];
  Questions: DataMarketQuestion[];
};
