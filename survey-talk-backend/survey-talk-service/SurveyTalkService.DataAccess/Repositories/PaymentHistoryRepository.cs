using SurveyTalkService.DataAccess.Data;
using SurveyTalkService.DataAccess.Repositories.interfaces;
using Microsoft.EntityFrameworkCore;
using SurveyTalkService.DataAccess.Entities;
using SurveyTalkService.BusinessLogic.DTOs.Survey.Filters;

namespace SurveyTalkService.DataAccess.Repositories
{
    public class PaymentHistoryRepository : IPaymentHistoryRepository
    {
        private readonly AppDbContext _appDbContext;

        public PaymentHistoryRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<PaymentHistory> FindByIdAsync(int id)
        {
            return await _appDbContext.PaymentHistories
                .Include(ph => ph.Account)
                .Include(ph => ph.PaymentType)
                .Include(ph => ph.PaymentStatus)
                .FirstOrDefaultAsync(ph => ph.Id == id);
        }
    }
}
