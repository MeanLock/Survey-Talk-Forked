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
  SurveyId: number;
  Version: number;
  NumOfContributors: number;
  NumOfBuyers: number;
  PriceOfVersion: number;
  StartDate: string;
  EndDate: string;
};

export type Survey = {
  Id: number;
  RequesterId: number;
  Title: string;
  Description: string | null;
  SurveyTypeId: number;
  SurveyTopicId: number | null;
  SurveySpecificTopicId: number | null;
  StartDate: string | null;
  EndDate: string | null;
  Kpi: number | null;
  SecurityModeId: number | null;
  TheoryPrice: number | null;
  ExtraPrice: number | null;
  TakerBaseRewardPrice: number | null;
  ProfitPrice: number | null;
  AllocBaseAmount: number | null; // (TheoryPrice + ExtraPrice - ProfitPrice) x 70%
  AllocTimeAmount: number | null; // (TheoryPrice + ExtraPrice - ProfitPrice) x 20%
  AllocLevelAmount: number | null; // (TheoryPrice + ExtraPrice - ProfitPrice) x 10%
  MaxXp: number | null;
  IsAvailable: boolean;
  ConfigJsonString: string;
  PublishedAt: string | null;
  DeletedAt: string | null;
  CreatedAt: string;
  UpdatedAt: string;
  SurveyStatusId: number;
  MainImageUrl: string | null;
  BackgroundImageUrl: string | null;
  CurrentSurveyRewardTracking: CurrentSurveyRewardTracking | null;
  SurveyTakenResults: SurveyTakenResult[] | null;
  Versions: VersionBasicInformations[] | null;
};
export type SurveyList = Survey[];

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
