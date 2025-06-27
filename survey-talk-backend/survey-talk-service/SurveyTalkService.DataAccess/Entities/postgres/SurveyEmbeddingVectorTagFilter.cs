using Pgvector;

namespace SurveyTalkService.DataAccess.Entities.postgres;

public partial class SurveyEmbeddingVectorTagFilter
{
    public int SurveyId { get; set; }

    public int FilterTagId { get; set; }

    public Vector? EmbeddingVector { get; set; }
}
