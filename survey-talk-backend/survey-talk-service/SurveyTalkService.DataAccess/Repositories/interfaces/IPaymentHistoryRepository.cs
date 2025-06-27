using SurveyTalkService.DataAccess.Data;
using SurveyTalkService.DataAccess.Entities;

namespace SurveyTalkService.DataAccess.Repositories.interfaces
{
    public interface IPaymentHistoryRepository
    {
        Task<PaymentHistory> FindByIdAsync(int id);
    }
}
