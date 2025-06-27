using System;
using System.Collections.Generic;

namespace SurveyTalkService.DataAccess.Entities;

public partial class PaymentHistory
{
    public int Id { get; set; }

    public int AccountId { get; set; }

    public decimal Amount { get; set; }

    public int PaymentTypeId { get; set; }

    public int PaymentStatusId { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Account Account { get; set; } = null!;

    public virtual PaymentStatus PaymentStatus { get; set; } = null!;

    public virtual PaymentType PaymentType { get; set; } = null!;
}
