using System.Collections.Generic;

namespace SurveyTalkService.BusinessLogic.DTOs.FilterTags
{
    public class FilterTagSimilarityComparisonResultDTO
    {
        public int CandidateId { get; set; }
        public float SimilarityScore { get; set; }

    }
}