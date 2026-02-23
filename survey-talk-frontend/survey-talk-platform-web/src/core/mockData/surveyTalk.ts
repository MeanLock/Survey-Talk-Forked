import type { SurveyTakingSession } from "../types";

export const TakinSessionData: SurveyTakingSession[] = [
  {
    TakingAllow: true,
    Message: "Get Session Successfully",
    TakingSession: {
      Id: 1,
      RequesterId: 6, // Luôn luôn là 6
      Title: "Khảo Sát xu hướng tập luyện của người dùng",
      Description: "Description Survey 1",
      SurveyTypeId: 1,
      SurveyTopicId: 1,
      SurveySpecificTopicId: 1,
      MainImageUrl: "https://i.pinimg.com/736x/f2/bd/6b/f2bd6b9f355d1029ce8274f827e6cbcc.jpg",
      BackgroundImageUrl: "string",
      SurveyStatusId: 2,
      Version: null,
      MarketSurveyVersionStatusId: null,
      SecurityModeId: 1,
      ConfigJson: {
        BackgroundGradient1Color: "string",
        BackgroundGradient2Color: "string",
        TitleColor: "string",
        ContentColor: "string",
        ButtonBackgroundColor: "string",
        ButtonContentColor: "string",
        Password: null,
        Brightness: 100,
        IsPause: false,
        SkipStartPage: false,
        Background: "string",
      },
      Questions: [],
    },
  },
];
