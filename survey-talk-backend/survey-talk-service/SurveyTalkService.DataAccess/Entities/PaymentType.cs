using System;
using System.Collections.Generic;

namespace SurveyTalkService.DataAccess.Entities;

public partial class PaymentType
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string OperationType { get; set; } = null!;

    public virtual ICollection<PaymentHistory> PaymentHistories { get; set; } = new List<PaymentHistory>();
}
