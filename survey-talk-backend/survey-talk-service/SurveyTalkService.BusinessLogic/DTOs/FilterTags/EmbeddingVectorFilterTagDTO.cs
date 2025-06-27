namespace SurveyTalkService.BusinessLogic.DTOs.FilterTags
{

    public class EmbeddingVectorFilterTagDTO
    {
        public int FilterTagId { get; set; }
        public float[]? EmbeddingVector { get; set; } 

    }
}