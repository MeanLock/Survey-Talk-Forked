using System;
using System.Collections.Generic;

namespace SurveyTalkService.DataAccess.Entities;

public partial class DataPurchase
{
    public int Id { get; set; }

    public int BuyerId { get; set; }

    public int MarketSurveyId { get; set; }

    public byte Version { get; set; }

    public DateTime PurchasedAt { get; set; }

    public decimal PurchasedPrice { get; set; }

    public virtual Account Buyer { get; set; } = null!;

    public virtual ICollection<DataPurchaseDetail> DataPurchaseDetails { get; set; } = new List<DataPurchaseDetail>();

    public virtual Survey MarketSurvey { get; set; } = null!;
}
