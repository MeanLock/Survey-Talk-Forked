using Pgvector;

namespace SurveyTalkService.DataAccess.Entities.postgres;

public partial class TakerEmbeddingVectorTagFilter
{
    public int TakerId { get; set; }

    public int FilterTagId { get; set; }

    public Vector? EmbeddingVector { get; set; }
}
