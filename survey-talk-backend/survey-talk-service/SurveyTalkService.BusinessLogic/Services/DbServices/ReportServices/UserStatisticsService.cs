using Microsoft.Extensions.Logging;
using SurveyTalkService.Common.AppConfigurations.App.interfaces;
using SurveyTalkService.Common.AppConfigurations.FilePath.interfaces;
using SurveyTalkService.DataAccess.Data;
using SurveyTalkService.BusinessLogic.Helpers;
using SurveyTalkService.DataAccess.UOW;
using SurveyTalkService.BusinessLogic.Services.AWSServices.S3;
using SurveyTalkService.BusinessLogic.DTOs.Survey.Session.V1;
using SurveyTalkService.DataAccess.Entities;
using SurveyTalkService.BusinessLogic.DTOs.Survey.Filters;
using Newtonsoft.Json.Linq;
using SurveyTalkService.BusinessLogic.Exceptions;
using Newtonsoft.Json;
using SurveyTalkService.DataAccess.Repositories.interfaces;
using SurveyTalkService.BusinessLogic.DTOs.Survey.Session;
using SurveyTalkService.BusinessLogic.Enums;
using SurveyTalkService.BusinessLogic.DTOs.Survey.JsonConfigs;
using SurveyTalkService.BusinessLogic.DTOs.Survey.TakenResult.V1;
using SurveyTalkService.BusinessLogic.DTOs.Survey.TakenResult;
using SurveyTalkService.BusinessLogic.Services.OpenAIServices._4oMini;
using SurveyTalkService.BusinessLogic.Services.EmbeddingVectorServices;
using SurveyTalkService.DataAccess.Entities.postgres;
using Pgvector;
using SurveyTalkService.BusinessLogic.DTOs.FilterTag;
using Microsoft.EntityFrameworkCore;
using SurveyTalkService.Common.AppConfigurations.BusinessSetting.interfaces;
using Duende.IdentityServer.Extensions;
using SurveyTalkService.BusinessLogic.DTOs.Report;

namespace SurveyTalkService.BusinessLogic.Services.DbServices.ReportServices
{
    public class UserStatisticsService
    {
        // LOGGER
        private readonly ILogger<UserStatisticsService> _logger;

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

        public UserStatisticsService(
            ILogger<UserStatisticsService> logger,
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

        public async Task<AccountRegistrationSummaryCountDTO> GetAccountRegistrationSummaryReport(StatisticsReportPeriodEnum reportPeriod)
        {
            try
            {

                if (reportPeriod == StatisticsReportPeriodEnum.Daily)
                {
                    DateOnly today = DateOnly.FromDateTime(_dateHelpers.GetNowByAppTimeZone());
                    DateOnly previousDay = today.AddDays(-1);
                    var registrationCount = await _unitOfWork.AccountRepository.CountAccountRegistrationByPeriodAsync(today, today);
                    var previousRegistrationCount = await _unitOfWork.AccountRepository.CountAccountRegistrationByPeriodAsync(previousDay, previousDay);
                    return new AccountRegistrationSummaryCountDTO
                    {
                        NewRegistrationCount = registrationCount,
                        PercentChange = previousRegistrationCount == 0 ? 100 :  Math.Round(((double)(registrationCount - previousRegistrationCount) / (double)previousRegistrationCount * 100), 2, MidpointRounding.AwayFromZero),
                    };

                }
                else if (reportPeriod == StatisticsReportPeriodEnum.Weekly)
                {
                    DateOnly today = DateOnly.FromDateTime(_dateHelpers.GetNowByAppTimeZone());
                    DateOnly startOfWeek = DateOnly.FromDateTime(_dateHelpers.GetDayOfWeek(_dateHelpers.GetNowByAppTimeZone(), DayOfWeek.Monday));
                    DateOnly endOfWeek = startOfWeek.AddDays(6);
                    var registrationCount = await _unitOfWork.AccountRepository.CountAccountRegistrationByPeriodAsync(startOfWeek, endOfWeek);
                    var previousStartOfWeek = startOfWeek.AddDays(-7);
                    var previousEndOfWeek = endOfWeek.AddDays(-7);
                    var previousRegistrationCount = await _unitOfWork.AccountRepository.CountAccountRegistrationByPeriodAsync(previousStartOfWeek, previousEndOfWeek);
                    return new AccountRegistrationSummaryCountDTO
                    {
                        NewRegistrationCount = registrationCount,
                        PercentChange = previousRegistrationCount == 0 ? 100 : Math.Round(((double)(registrationCount - previousRegistrationCount) / (double)previousRegistrationCount * 100), 2, MidpointRounding.AwayFromZero),
                    };

                }
                else if (reportPeriod == StatisticsReportPeriodEnum.Monthly)
                {
                    DateOnly today = DateOnly.FromDateTime(_dateHelpers.GetNowByAppTimeZone());
                    DateOnly startDateOfMonth = DateOnly.FromDateTime(_dateHelpers.GetFirstDayOfMonthByDate(_dateHelpers.GetNowByAppTimeZone()));
                    DateOnly endDateOfMonth = DateOnly.FromDateTime(_dateHelpers.GetLastDayOfMonthByDate(_dateHelpers.GetNowByAppTimeZone()));

                    var previousStartDateOfMonth = startDateOfMonth.AddMonths(-1);
                    var previousEndDateOfMonth = endDateOfMonth.AddMonths(-1);

                    var registrationCount = await _unitOfWork.AccountRepository.CountAccountRegistrationByPeriodAsync(startDateOfMonth, endDateOfMonth);
                    var previousRegistrationCount = await _unitOfWork.AccountRepository.CountAccountRegistrationByPeriodAsync(previousStartDateOfMonth, previousEndDateOfMonth);
                    return new AccountRegistrationSummaryCountDTO
                    {
                        NewRegistrationCount = registrationCount,
                        PercentChange = previousRegistrationCount == 0 ? 100 : Math.Round(((double)(registrationCount - previousRegistrationCount) / (double)previousRegistrationCount * 100), 2, MidpointRounding.AwayFromZero),
                    };

                }
                else if (reportPeriod == StatisticsReportPeriodEnum.Yearly)
                {
                    DateOnly today = DateOnly.FromDateTime(_dateHelpers.GetNowByAppTimeZone());
                    DateOnly startDateOfYear = DateOnly.FromDateTime(_dateHelpers.GetFirstDayOfYearByDate(_dateHelpers.GetNowByAppTimeZone()));
                    DateOnly endDateOfYear = DateOnly.FromDateTime(_dateHelpers.GetLastDayOfYearByDate(_dateHelpers.GetNowByAppTimeZone()));

                    var previousStartDateOfYear = startDateOfYear.AddYears(-1);
                    var previousEndDateOfYear = endDateOfYear.AddYears(-1);

                    var registrationCount = await _unitOfWork.AccountRepository.CountAccountRegistrationByPeriodAsync(startDateOfYear, endDateOfYear);
                    var previousRegistrationCount = await _unitOfWork.AccountRepository.CountAccountRegistrationByPeriodAsync(previousStartDateOfYear, previousEndDateOfYear);
                    return new AccountRegistrationSummaryCountDTO
                    {
                        NewRegistrationCount = registrationCount,
                        PercentChange = previousRegistrationCount == 0 ? 100 : Math.Round(((double)(registrationCount - previousRegistrationCount) / (double)previousRegistrationCount * 100), 2, MidpointRounding.AwayFromZero),
                    };
                }
                else
                {
                    throw new HttpRequestException("không hỗ trợ thống kê theo thời gian này.");
                }


            }
            catch (Exception ex)
            {
                Console.WriteLine("\n" + ex.StackTrace + "\n");
                throw new HttpRequestException("Lấy báo cáo đăng ký tài khoản thất bại, lí do: " + ex.Message);
            }
        }

        


        // ///////////////////////////////////////////////////////////



    }
}
