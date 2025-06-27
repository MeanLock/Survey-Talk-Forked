using SurveyTalkService.DataAccess.Data;
using SurveyTalkService.DataAccess.Repositories.interfaces;
using Microsoft.EntityFrameworkCore;
using SurveyTalkService.DataAccess.Entities;
using SurveyTalkService.BusinessLogic.DTOs.Survey.Filters;

namespace SurveyTalkService.DataAccess.Repositories
{
    public class SurveyQuestionRepository : ISurveyQuestionRepository
    {
        private readonly AppDbContext _appDbContext;

        public SurveyQuestionRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<IEnumerable<SurveyQuestion>> FindBySurveyIdAndIsDeletedContainAsync(int surveyId,  bool isDeletedContain)
        {
            return await _appDbContext.SurveyQuestions
                .Where(sq => sq.SurveyId == surveyId && (isDeletedContain == true || sq.DeletedAt == null))
                .Include(sq => sq.QuestionType)
                .Include(sq => sq.SurveyOptions)
                .ToListAsync();
        }

    }
}
