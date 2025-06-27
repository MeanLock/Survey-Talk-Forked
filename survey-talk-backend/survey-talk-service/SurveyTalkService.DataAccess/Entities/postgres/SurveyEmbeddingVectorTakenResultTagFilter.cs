using Pgvector;

namespace SurveyTalkService.DataAccess.Entities.postgres;

public partial class SurveyEmbeddingVectorTakenResultTagFilter
{
    public int SurveyTakenResultId { get; set; }

    public int AdditionalFilterTagId { get; set; }

    public Vector? EmbeddingVector { get; set; }
}
