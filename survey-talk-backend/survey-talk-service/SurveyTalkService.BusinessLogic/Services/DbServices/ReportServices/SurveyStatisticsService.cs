using Microsoft.Extensions.Logging;
using SurveyTalkService.Common.AppConfigurations.App.interfaces;
using SurveyTalkService.Common.AppConfigurations.FilePath.interfaces;
using SurveyTalkService.DataAccess.Data;
using SurveyTalkService.BusinessLogic.Helpers;
using SurveyTalkService.DataAccess.UOW;
using SurveyTalkService.BusinessLogic.Services.AWSServices.S3;
using SurveyTalkService.BusinessLogic.Services.OpenAIServices._4oMini;
using SurveyTalkService.BusinessLogic.Services.EmbeddingVectorServices;
using Microsoft.EntityFrameworkCore;
using SurveyTalkService.Common.AppConfigurations.BusinessSetting.interfaces;
using Duende.IdentityServer.Extensions;
using SurveyTalkService.BusinessLogic.DTOs.Report;
using SurveyTalkService.BusinessLogic.Enums;
using SurveyTalkService.BusinessLogic.DTOs.Survey.Filters;

namespace SurveyTalkService.BusinessLogic.Services.DbServices.ReportServices
{
    public class SurveyStatisticsService
    {
        // LOGGER
        private readonly ILogger<SurveyStatisticsService> _logger;

        // CONFIG
        public readonly IAppConfig _appConfig;
        private readonly IFilePathConfig _filePathConfig;
        private readonly ISurveyConfig _surveyConfig;

        // DB CONTEXT
        private readonly AppDbContext _appDbContext;
        private readonly PostgresDbContext _postgresDbContext;

        // HELPERS
        private readonly BcryptHelpers _bcryptHelpers;
        private readonly JwtHelpers _jwtHelpers;
        private readonly FileHelpers _fileHelpers;
        private readonly ImageHelpers _imageHelpers;
        private readonly DateHelpers _dateHelpers;


        // UNIT OF WORK
        private readonly IUnitOfWork _unitOfWork;

        // REPOSITORIES


        // AWS SERVICE
        private readonly AWSS3Service _awsS3Service;

        // OPENAI SERVICE
        private readonly OpenAI4oMiniService _openAI4oMiniService;

        // EMBEDDING VECTOR SERVICE
        private readonly SurveyEmbeddingVectorService _surveyEmbeddingVectorService;

        public SurveyStatisticsService(
            ILogger<SurveyStatisticsService> logger,
            AppDbContext appDbContext,
            PostgresDbContext postgresDbContext,

            BcryptHelpers bcryptHelpers,
            JwtHelpers jwtHelpers,
            DateHelpers dateHelpers,
            IUnitOfWork unitOfWork,



            FileHelpers fileHelpers,
            ImageHelpers imageHelpers,
            IFilePathConfig filePathConfig,
            AWSS3Service awsS3Service,
            OpenAI4oMiniService openAI4oMiniService,
            SurveyEmbeddingVectorService surveyEmbeddingVectorService,
            IAppConfig appConfig,
            ISurveyConfig surveyConfig
            )
        {
            _logger = logger;
            _appDbContext = appDbContext;
            _postgresDbContext = postgresDbContext;

            _bcryptHelpers = bcryptHelpers;
            _jwtHelpers = jwtHelpers;
            _dateHelpers = dateHelpers;
            _unitOfWork = unitOfWork;



            _fileHelpers = fileHelpers;
            _imageHelpers = imageHelpers;
            _filePathConfig = filePathConfig;


            _awsS3Service = awsS3Service;
            _openAI4oMiniService = openAI4oMiniService;
            _surveyEmbeddingVectorService = surveyEmbeddingVectorService;
            _appConfig = appConfig;
            _surveyConfig = surveyConfig;
        }



        /////////////////////////////////////////////////////////////

        public async Task<CommunitySurveySummaryCountDTO> GetSurveyCommunitySummaryReport(StatisticsReportPeriodEnum reportPeriod)
        {
            try
            {
                SurveyFilterObject surveyFilterObject = new SurveyFilterObject
                {
                    SurveyTypeId = 2,
                    IsDeletedContain = false,
                    SurveyStatusIds = new List<int> { 2, 3 },
                    // IsInvalidTakenResultContain = false
                };
                var surveys = await _unitOfWork.SurveyRepository.FindByFilterObjectAsync(surveyFilterObject);

                var communitySurveySummaryCountDTO = new CommunitySurveySummaryCountDTO();

                if (reportPeriod == StatisticsReportPeriodEnum.Daily)
                {
                    DateOnly today = DateOnly.FromDateTime(_dateHelpers.GetNowByAppTimeZone());
                    // surveys = surveys.Where(s => s.EndDate.HasValue && s.EndDate.Value == today).ToList();
                    communitySurveySummaryCountDTO.Published = surveys.Count(s => (s.SurveyStatusTrackings
                                .OrderByDescending(sst => sst.CreatedAt)
                                .FirstOrDefault()?.SurveyStatusId ?? 1) == 2 && s.PublishedAt.HasValue && DateOnly.FromDateTime(s.PublishedAt.Value) == today);

                }
                else if (reportPeriod == StatisticsReportPeriodEnum.Weekly)
                {
                    DateOnly startOfWeek = DateOnly.FromDateTime(_dateHelpers.GetDayOfWeek(_dateHelpers.GetNowByAppTimeZone(), DayOfWeek.Monday));
                    DateOnly endOfWeek = startOfWeek.AddDays(6);

                    communitySurveySummaryCountDTO.Published = surveys.Count(s => (s.SurveyStatusTrackings
                                .OrderByDescending(sst => sst.CreatedAt)
                                .FirstOrDefault()?.SurveyStatusId ?? 1) == 2 && s.PublishedAt.HasValue && DateOnly.FromDateTime(s.PublishedAt.Value) >= startOfWeek && DateOnly.FromDateTime(s.PublishedAt.Value.Date) <= endOfWeek);
                }
                else if (reportPeriod == StatisticsReportPeriodEnum.Monthly)
                {
                    DateOnly startDateOfMonth = DateOnly.FromDateTime(_dateHelpers.GetFirstDayOfMonthByDate(_dateHelpers.GetNowByAppTimeZone()));
                    DateOnly endDateOfMonth = DateOnly.FromDateTime(_dateHelpers.GetLastDayOfMonthByDate(_dateHelpers.GetNowByAppTimeZone()));

                    communitySurveySummaryCountDTO.Published = surveys.Count(s => (s.SurveyStatusTrackings
                                .OrderByDescending(sst => sst.CreatedAt)
                                .FirstOrDefault()?.SurveyStatusId ?? 1) == 2 && s.PublishedAt.HasValue && DateOnly.FromDateTime(s.PublishedAt.Value) >= startDateOfMonth && DateOnly.FromDateTime(s.PublishedAt.Value.Date) <= endDateOfMonth);
                }
                else if (reportPeriod == StatisticsReportPeriodEnum.Yearly)
                {
                    DateOnly startDateOfYear = DateOnly.FromDateTime(_dateHelpers.GetFirstDayOfYearByDate(_dateHelpers.GetNowByAppTimeZone()));
                    DateOnly endDateOfYear = DateOnly.FromDateTime(_dateHelpers.GetLastDayOfYearByDate(_dateHelpers.GetNowByAppTimeZone()));

                    communitySurveySummaryCountDTO.Published = surveys.Count(s => (s.SurveyStatusTrackings
                                .OrderByDescending(sst => sst.CreatedAt)
                                .FirstOrDefault()?.SurveyStatusId ?? 1) == 2 && s.PublishedAt.HasValue && DateOnly.FromDateTime(s.PublishedAt.Value) >= startDateOfYear && DateOnly.FromDateTime(s.PublishedAt.Value.Date) <= endDateOfYear);
                }
                else
                {
                    throw new HttpRequestException("Không hỗ trợ thống kê theo thời gian này.");
                }

                communitySurveySummaryCountDTO.OnDeadline = surveys.Count(s => (s.SurveyStatusTrackings
                            .OrderByDescending(sst => sst.CreatedAt)
                            .FirstOrDefault()?.SurveyStatusId ?? 1) == 2 && s.EndDate.HasValue && s.EndDate.Value == DateOnly.FromDateTime(_dateHelpers.GetNowByAppTimeZone()));
                communitySurveySummaryCountDTO.NearDeadline = surveys.Count(s => (s.SurveyStatusTrackings
                            .OrderByDescending(sst => sst.CreatedAt)
                            .FirstOrDefault()?.SurveyStatusId ?? 1) == 2 && s.EndDate.HasValue && s.EndDate.Value > DateOnly.FromDateTime(_dateHelpers.GetNowByAppTimeZone()));
                communitySurveySummaryCountDTO.LateForDeadline = surveys.Count(s => (s.SurveyStatusTrackings
                            .OrderByDescending(sst => sst.CreatedAt)
                            .FirstOrDefault()?.SurveyStatusId ?? 1) == 3 && s.EndDate.HasValue && s.EndDate.Value < DateOnly.FromDateTime(_dateHelpers.GetNowByAppTimeZone()));


                foreach (var survey in surveys)
                {
                    int currentTakenResultCount = await _unitOfWork.SurveyTakenResultRepository.CountBySurveyIdAsync(survey.Id, false);
                    int surveyStatusId = survey.SurveyStatusTrackings
                            .OrderByDescending(sst => sst.CreatedAt)
                            .FirstOrDefault()?.SurveyStatusId ?? 1;
                    Console.WriteLine($"Survey ID: {survey.Id}, Current Taken Result Count: {surveyStatusId}");

                    if (surveyStatusId == 3)
                    {
                        int availableTakenResultSlot = (survey.Kpi ?? 0) - currentTakenResultCount;
                        communitySurveySummaryCountDTO.Achieved += 1;
                    }
                }

                return communitySurveySummaryCountDTO;

            }
            catch (Exception ex)
            {
                Console.WriteLine("\n" + ex.StackTrace + "\n");
                throw new HttpRequestException("Lấy báo cáo thống kê cộng đồng khảo sát thất bại, lí do: " + ex.Message);
            }


        }

        


        // ///////////////////////////////////////////////////////////



    }
}
