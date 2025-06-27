using System;
using System.Collections.Generic;

namespace SurveyTalkService.DataAccess.Entities;

public partial class SurveyOption
{
    public int Id { get; set; }

    public int SurveyQuestionId { get; set; }

    public string Content { get; set; } = null!;

    public byte Order { get; set; }

    public virtual SurveyQuestion SurveyQuestion { get; set; } = null!;
}
