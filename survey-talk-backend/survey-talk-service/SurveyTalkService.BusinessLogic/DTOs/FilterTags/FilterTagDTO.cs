namespace SurveyTalkService.BusinessLogic.DTOs.FilterTags
{

    public class FilterTagDTO
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public string TagColor { get; set; } = null!;

        public int FilterTagTypeId { get; set; }

    }
}