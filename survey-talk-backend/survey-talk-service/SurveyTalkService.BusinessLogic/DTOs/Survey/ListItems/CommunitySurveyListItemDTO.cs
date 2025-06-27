using SurveyTalkService.DataAccess.Entities;

namespace SurveyTalkService.BusinessLogic.DTOs.Survey.ListItems
{

    public class CommunitySurveyListItemDTO : SurveyListItemDTO
    {
        public SurveyRewardTracking CurrentSurveyRewardTracking { get; set; }
    }
}
