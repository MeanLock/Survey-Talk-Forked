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
    public class TransactionStatisticsService
    {
        // LOGGER
        private readonly ILogger<TransactionStatisticsService> _logger;

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

        public TransactionStatisticsService(
            ILogger<TransactionStatisticsService> logger,
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

        public async Task<ProfitSummaryReportDTO> GetCommunityProfitSummaryReport(StatisticsReportPeriodEnum reportPeriod)
        {
            try
            {
                List<int> publishmentTransactionTypeIds = new List<int> { 1 };
                List<int> transactionStatusIds = new List<int> { 2 };


                if (reportPeriod == StatisticsReportPeriodEnum.Daily)
                {
                    DateOnly today = DateOnly.FromDateTime(_dateHelpers.GetNowByAppTimeZone());
                    DateOnly previousDay = today.AddDays(-1);
                    var profit = await _unitOfWork.SurveyCommunityTransactionRepository.GetProfitByTypesAndStatusesAndPeriodAsync(
                        publishmentTransactionTypeIds,
                        transactionStatusIds,
                        today,
                        today);
                    var previousProfit = await _unitOfWork.SurveyCommunityTransactionRepository.GetProfitByTypesAndStatusesAndPeriodAsync(
                        publishmentTransactionTypeIds,
                        transactionStatusIds,
                        previousDay,
                        previousDay);
                    return new ProfitSummaryReportDTO
                    {
                        PercentChange = previousProfit == 0 ? 100 : Math.Round(((double)(profit - previousProfit) / (double)previousProfit * 100), 2, MidpointRounding.AwayFromZero),
                        TotalRevenue = profit,
                    };

                }
                else if (reportPeriod == StatisticsReportPeriodEnum.Weekly)
                {
                    DateOnly today = DateOnly.FromDateTime(_dateHelpers.GetNowByAppTimeZone());
                    DateOnly startOfWeek = DateOnly.FromDateTime(_dateHelpers.GetDayOfWeek(_dateHelpers.GetNowByAppTimeZone(), DayOfWeek.Monday));
                    DateOnly endOfWeek = startOfWeek.AddDays(6);
                    var profit = await _unitOfWork.SurveyCommunityTransactionRepository.GetProfitByTypesAndStatusesAndPeriodAsync(
                        publishmentTransactionTypeIds,
                        transactionStatusIds,
                        startOfWeek,
                        endOfWeek);
                    var previousStartOfWeek = startOfWeek.AddDays(-7);
                    var previousEndOfWeek = endOfWeek.AddDays(-7);
                    var previousProfit = await _unitOfWork.SurveyCommunityTransactionRepository.GetProfitByTypesAndStatusesAndPeriodAsync(
                        publishmentTransactionTypeIds,
                        transactionStatusIds,
                        previousStartOfWeek,
                        previousEndOfWeek);
                    return new ProfitSummaryReportDTO
                    {
                        PercentChange = previousProfit == 0 ? 100 : Math.Round(((double)(profit - previousProfit) / (double)previousProfit * 100), 2, MidpointRounding.AwayFromZero),
                        TotalRevenue = profit,
                    };

                }
                else if (reportPeriod == StatisticsReportPeriodEnum.Monthly)
                {
                    DateOnly today = DateOnly.FromDateTime(_dateHelpers.GetNowByAppTimeZone());
                    DateOnly startDateOfMonth = DateOnly.FromDateTime(_dateHelpers.GetFirstDayOfMonthByDate(_dateHelpers.GetNowByAppTimeZone()));
                    DateOnly endDateOfMonth = DateOnly.FromDateTime(_dateHelpers.GetLastDayOfMonthByDate(_dateHelpers.GetNowByAppTimeZone()));
                    var profit = await _unitOfWork.SurveyCommunityTransactionRepository.GetProfitByTypesAndStatusesAndPeriodAsync(
                        publishmentTransactionTypeIds,
                        transactionStatusIds,
                        startDateOfMonth,
                        endDateOfMonth);
                    var previousStartDateOfMonth = startDateOfMonth.AddMonths(-1);
                    var previousEndDateOfMonth = endDateOfMonth.AddMonths(-1);
                    var previousProfit = await _unitOfWork.SurveyCommunityTransactionRepository.GetProfitByTypesAndStatusesAndPeriodAsync(
                        publishmentTransactionTypeIds,
                        transactionStatusIds,
                        previousStartDateOfMonth,
                        previousEndDateOfMonth);
                    return new ProfitSummaryReportDTO
                    {
                        PercentChange = previousProfit == 0 ? 100 : Math.Round(((double)(profit - previousProfit) / (double)previousProfit * 100), 2, MidpointRounding.AwayFromZero),
                        TotalRevenue = profit,
                    };

                }
                else if (reportPeriod == StatisticsReportPeriodEnum.Yearly)
                {
                    DateOnly today = DateOnly.FromDateTime(_dateHelpers.GetNowByAppTimeZone());
                    DateOnly startDateOfYear = DateOnly.FromDateTime(_dateHelpers.GetFirstDayOfYearByDate(_dateHelpers.GetNowByAppTimeZone()));
                    DateOnly endDateOfYear = DateOnly.FromDateTime(_dateHelpers.GetLastDayOfYearByDate(_dateHelpers.GetNowByAppTimeZone()));
                    var profit = await _unitOfWork.SurveyCommunityTransactionRepository.GetProfitByTypesAndStatusesAndPeriodAsync(
                        publishmentTransactionTypeIds,
                        transactionStatusIds,
                        startDateOfYear,
                        endDateOfYear);
                    var previousStartDateOfYear = startDateOfYear.AddYears(-1);
                    var previousEndDateOfYear = endDateOfYear.AddYears(-1);
                    var previousProfit = await _unitOfWork.SurveyCommunityTransactionRepository.GetProfitByTypesAndStatusesAndPeriodAsync(
                        publishmentTransactionTypeIds,
                        transactionStatusIds,
                        previousStartDateOfYear,
                        previousEndDateOfYear);
                    return new ProfitSummaryReportDTO
                    {
                        PercentChange = previousProfit == 0 ? 100 : Math.Round(((double)(profit - previousProfit) / (double)previousProfit * 100), 2, MidpointRounding.AwayFromZero),
                        TotalRevenue = profit,
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
                throw new HttpRequestException("Lấy báo cáo lợi nhuận thất bại, lí do: " + ex.Message);
            }
        }

        public async Task<List<ProfitPeriodicReportListItemDTO>> GetCommunityProfitPeriodicReport(StatisticsReportPeriodEnum reportPeriod)
        {
            try
            {
                List<int> publishmentTransactionTypeIds = new List<int> { 1 };
                List<int> transactionStatusIds = new List<int> { 2 };

                List<ProfitPeriodicReportListItemDTO> profitList = new List<ProfitPeriodicReportListItemDTO>();
                if (reportPeriod == StatisticsReportPeriodEnum.Daily)
                {
                    DateOnly today = DateOnly.FromDateTime(_dateHelpers.GetNowByAppTimeZone());
                    // truy về 7 ngày gần nhất, bao gồm hôm nay, trả về mảng List<ProfitPeriodicReportListItemDTO>
                    DateOnly startDate = today.AddDays(-6);
                    for (int i = 0; i < 7; i++)
                    {
                        DateOnly currentDate = startDate.AddDays(i);
                        var profit = await _unitOfWork.SurveyCommunityTransactionRepository.GetProfitByTypesAndStatusesAndPeriodAsync(
                            publishmentTransactionTypeIds,
                            transactionStatusIds,
                            currentDate,
                            currentDate);
                        profitList.Add(new ProfitPeriodicReportListItemDTO
                        {
                            StartDate = currentDate,
                            EndDate = currentDate,
                            Revenue = profit
                        });
                    }

                    return profitList;
                }
                else if (reportPeriod == StatisticsReportPeriodEnum.Weekly)
                {
                    // truy vấn về những ngày trong tuần
                    DateOnly startOfWeek = DateOnly.FromDateTime(_dateHelpers.GetDayOfWeek(_dateHelpers.GetNowByAppTimeZone(), DayOfWeek.Monday));
                    DateOnly endOfWeek = startOfWeek.AddDays(6);
                    for (int i = 0; i < 7; i++)
                    {
                        DateOnly currentDate = startOfWeek.AddDays(i);
                        var profit = await _unitOfWork.SurveyCommunityTransactionRepository.GetProfitByTypesAndStatusesAndPeriodAsync(
                            publishmentTransactionTypeIds,
                            transactionStatusIds,
                            currentDate,
                            currentDate);
                        profitList.Add(new ProfitPeriodicReportListItemDTO
                        {
                            StartDate = currentDate,
                            EndDate = currentDate,
                            Revenue = profit
                        });
                    }
                    return profitList;
                }
                else if (reportPeriod == StatisticsReportPeriodEnum.Monthly)
                {
                    // truy vấn về 4 tuần trong tháng
                    DateOnly startDateOfMonth = DateOnly.FromDateTime(_dateHelpers.GetFirstDayOfMonthByDate(_dateHelpers.GetNowByAppTimeZone()));
                    DateOnly endDateOfMonth = DateOnly.FromDateTime(_dateHelpers.GetLastDayOfMonthByDate(_dateHelpers.GetNowByAppTimeZone()));
                    DateOnly currentStartDate = startDateOfMonth;
                    while (currentStartDate <= endDateOfMonth)
                    {
                        DateOnly currentEndDate = currentStartDate.AddDays(6);
                        if (currentEndDate > endDateOfMonth)
                        {
                            currentEndDate = endDateOfMonth;
                        }
                        var profit = await _unitOfWork.SurveyCommunityTransactionRepository.GetProfitByTypesAndStatusesAndPeriodAsync(
                            publishmentTransactionTypeIds,
                            transactionStatusIds,
                            currentStartDate,
                            currentEndDate);
                        profitList.Add(new ProfitPeriodicReportListItemDTO
                        {
                            StartDate = currentStartDate,
                            EndDate = currentEndDate,
                            Revenue = profit
                        });
                        currentStartDate = currentEndDate.AddDays(1);
                    }
                    return profitList;
                }
                else if (reportPeriod == StatisticsReportPeriodEnum.Yearly)
                {
                    // truy vấn về 12 tháng trong năm
                    DateOnly startDateOfYear = DateOnly.FromDateTime(_dateHelpers.GetFirstDayOfYearByDate(_dateHelpers.GetNowByAppTimeZone()));
                    DateOnly endDateOfYear = DateOnly.FromDateTime(_dateHelpers.GetLastDayOfYearByDate(_dateHelpers.GetNowByAppTimeZone()));
                    DateOnly currentStartDate = startDateOfYear;
                    while (currentStartDate <= endDateOfYear)
                    {
                        DateOnly currentEndDate = currentStartDate.AddMonths(1).AddDays(-1);
                        if (currentEndDate > endDateOfYear)
                        {
                            currentEndDate = endDateOfYear;
                        }
                        var profit = await _unitOfWork.SurveyCommunityTransactionRepository.GetProfitByTypesAndStatusesAndPeriodAsync(
                            publishmentTransactionTypeIds,
                            transactionStatusIds,
                            currentStartDate,
                            currentEndDate);
                        profitList.Add(new ProfitPeriodicReportListItemDTO
                        {
                            StartDate = currentStartDate,
                            EndDate = currentEndDate,
                            Revenue = profit
                        });
                        currentStartDate = currentEndDate.AddDays(1);
                    }
                    return profitList;
                }
                else
                {
                    throw new HttpRequestException("không hỗ trợ thống kê theo thời gian này.");
                }

            }
            catch (Exception ex)
            {
                Console.WriteLine("\n" + ex.StackTrace + "\n");
                throw new HttpRequestException("Lấy báo cáo lợi nhuận thất bại, lí do: " + ex.Message);
            }
        }

        public async Task<List<AccountBalancePeriodicTransactionAmountListItemDTO>> GetAccountBalancePeriodicTransactionAmountReport(StatisticsReportPeriodEnum reportPeriod)
        {
            try
            {
                List<AccountBalancePeriodicTransactionAmountListItemDTO> transactionCountList = new List<AccountBalancePeriodicTransactionAmountListItemDTO>();

                List<int> depositTransactionTypeIds = new List<int> { 5 };
                List<int> withdrawalTransactionTypeIds = new List<int> { 6 };
                List<int> transactionStatusIds = new List<int> { 2 };

                if (reportPeriod == StatisticsReportPeriodEnum.Daily)
                {
                    DateOnly today = DateOnly.FromDateTime(_dateHelpers.GetNowByAppTimeZone());
                    // truy về 7 ngày gần nhất, bao gồm hôm nay, trả về mảng List<AccountBalancePeriodicTransactionCountListItemDTO>
                    DateOnly startDate = today.AddDays(-6);
                    for (int i = 0; i < 7; i++)
                    {
                        DateOnly currentDate = startDate.AddDays(i);
                        var depositCount = await _unitOfWork.AccountBalanceTransactionRepository.FindByTypesAndStatusesAndPeriodAsync(
                            depositTransactionTypeIds,
                            transactionStatusIds,
                            currentDate,
                            currentDate);
                        var withdrawalCount = await _unitOfWork.AccountBalanceTransactionRepository.FindByTypesAndStatusesAndPeriodAsync(
                            withdrawalTransactionTypeIds,
                            transactionStatusIds,
                            currentDate,
                            currentDate);

                        transactionCountList.Add(new AccountBalancePeriodicTransactionAmountListItemDTO
                        {
                            StartDate = currentDate,
                            EndDate = currentDate,
                            DepositTransactionAmount = depositCount.Sum(t => t.Amount),
                            WithdrawalTransactionAmount = withdrawalCount.Sum(t => t.Amount),
                        });
                    }

                    return transactionCountList;
                }
                else if (reportPeriod == StatisticsReportPeriodEnum.Weekly)
                {
                    // truy vấn về những ngày trong tuần
                    DateOnly startOfWeek = DateOnly.FromDateTime(_dateHelpers.GetDayOfWeek(_dateHelpers.GetNowByAppTimeZone(), DayOfWeek.Monday));
                    DateOnly endOfWeek = startOfWeek.AddDays(6);
                    for (int i = 0; i < 7; i++)
                    {
                        DateOnly currentDate = startOfWeek.AddDays(i);
                        var depositCount = await _unitOfWork.AccountBalanceTransactionRepository.FindByTypesAndStatusesAndPeriodAsync(
                            depositTransactionTypeIds,
                            transactionStatusIds,
                            currentDate,
                            currentDate);
                        var withdrawalCount = await _unitOfWork.AccountBalanceTransactionRepository.FindByTypesAndStatusesAndPeriodAsync(
                            withdrawalTransactionTypeIds,
                            transactionStatusIds,
                            currentDate,
                            currentDate);
                        transactionCountList.Add(new AccountBalancePeriodicTransactionAmountListItemDTO
                        {
                            StartDate = currentDate,
                            EndDate = currentDate,
                            DepositTransactionAmount = depositCount.Sum(t => t.Amount),
                            WithdrawalTransactionAmount = withdrawalCount.Sum(t => t.Amount),
                        });
                    }
                    return transactionCountList;
                }
                else if (reportPeriod == StatisticsReportPeriodEnum.Monthly)
                {
                    // truy vấn về 4 tuần trong tháng
                    DateOnly startDateOfMonth = DateOnly.FromDateTime(_dateHelpers.GetFirstDayOfMonthByDate(_dateHelpers.GetNowByAppTimeZone()));
                    DateOnly endDateOfMonth = DateOnly.FromDateTime(_dateHelpers.GetLastDayOfMonthByDate(_dateHelpers.GetNowByAppTimeZone()));
                    DateOnly currentStartDate = startDateOfMonth;
                    while (currentStartDate <= endDateOfMonth)
                    {
                        DateOnly currentEndDate = currentStartDate.AddDays(6);
                        if (currentEndDate > endDateOfMonth)
                        {
                            currentEndDate = endDateOfMonth;
                        }
                        var depositCount = await _unitOfWork.AccountBalanceTransactionRepository.FindByTypesAndStatusesAndPeriodAsync(
                            depositTransactionTypeIds,
                            transactionStatusIds,
                            currentStartDate,
                            currentEndDate);
                        var withdrawalCount = await _unitOfWork.AccountBalanceTransactionRepository.FindByTypesAndStatusesAndPeriodAsync(
                            withdrawalTransactionTypeIds,
                            transactionStatusIds,
                            currentStartDate,
                            currentEndDate);
                        transactionCountList.Add(new AccountBalancePeriodicTransactionAmountListItemDTO
                        {
                            StartDate = currentStartDate,
                            EndDate = currentEndDate,
                            DepositTransactionAmount = depositCount.Sum(t => t.Amount),
                            WithdrawalTransactionAmount = withdrawalCount.Sum(t => t.Amount)
                        });
                        currentStartDate = currentEndDate.AddDays(1);
                    }
                    return transactionCountList;

                }
                else if (reportPeriod == StatisticsReportPeriodEnum.Yearly)
                {
                    // truy vấn về 12 tháng trong năm
                    DateOnly startDateOfYear = DateOnly.FromDateTime(_dateHelpers.GetFirstDayOfYearByDate(_dateHelpers.GetNowByAppTimeZone()));
                    DateOnly endDateOfYear = DateOnly.FromDateTime(_dateHelpers.GetLastDayOfYearByDate(_dateHelpers.GetNowByAppTimeZone()));
                    DateOnly currentStartDate = startDateOfYear;
                    while (currentStartDate <= endDateOfYear)
                    {
                        DateOnly currentEndDate = currentStartDate.AddMonths(1).AddDays(-1);
                        if (currentEndDate > endDateOfYear)
                        {
                            currentEndDate = endDateOfYear;
                        }
                        var depositCount = await _unitOfWork.AccountBalanceTransactionRepository.FindByTypesAndStatusesAndPeriodAsync(
                            depositTransactionTypeIds,
                            transactionStatusIds,
                            currentStartDate,
                            currentEndDate);
                        var withdrawalCount = await _unitOfWork.AccountBalanceTransactionRepository.FindByTypesAndStatusesAndPeriodAsync(
                            withdrawalTransactionTypeIds,
                            transactionStatusIds,
                            currentStartDate,
                            currentEndDate);
                        transactionCountList.Add(new AccountBalancePeriodicTransactionAmountListItemDTO
                        {
                            StartDate = currentStartDate,
                            EndDate = currentEndDate,
                            DepositTransactionAmount = depositCount.Sum(t => t.Amount),
                            WithdrawalTransactionAmount = withdrawalCount.Sum(t => t.Amount)
                        });
                        currentStartDate = currentEndDate.AddDays(1);
                    }
                    return transactionCountList;
                }
                else
                {
                    throw new HttpRequestException("không hỗ trợ thống kê theo thời gian này.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("\n" + ex.StackTrace + "\n");
                throw new HttpRequestException("Lấy báo cáo giao dịch thất bại, lí do: " + ex.Message);
            }
        }

        public async Task<AccountBalanceSummaryTransactionCountDTO> GetAccountBalanceSummaryTransactionCountReport(StatisticsReportPeriodEnum reportPeriod)
        {
            try
            {
                List<int> depositTransactionTypeIds = new List<int> { 5 };
                List<int> withdrawalTransactionTypeIds = new List<int> { 6 };
                List<int> transactionStatusIds = new List<int> { 2 };
                if (reportPeriod == StatisticsReportPeriodEnum.Daily)
                {
                    DateOnly today = DateOnly.FromDateTime(_dateHelpers.GetNowByAppTimeZone());
                    DateOnly previousDay = today.AddDays(-1);
                    var depositCount = await _unitOfWork.AccountBalanceTransactionRepository.FindByTypesAndStatusesAndPeriodAsync(
                        depositTransactionTypeIds,
                        transactionStatusIds,
                        today,
                        today);
                    var previousDepositCount = await _unitOfWork.AccountBalanceTransactionRepository.FindByTypesAndStatusesAndPeriodAsync(
                        depositTransactionTypeIds,
                        transactionStatusIds,
                        previousDay,
                        previousDay);
                    var withdrawalCount = await _unitOfWork.AccountBalanceTransactionRepository.FindByTypesAndStatusesAndPeriodAsync(
                        withdrawalTransactionTypeIds,
                        transactionStatusIds,
                        today,
                        today);
                    var previousWithdrawalCount = await _unitOfWork.AccountBalanceTransactionRepository.FindByTypesAndStatusesAndPeriodAsync(
                        withdrawalTransactionTypeIds,
                        transactionStatusIds,
                        previousDay,
                        previousDay);

                    return new AccountBalanceSummaryTransactionCountDTO
                    {
                        DepositTransactionCount = depositCount.Count(),
                        WithdrawalTransactionCount = withdrawalCount.Count(),
                        DepositTransactionPercentChange = previousDepositCount.Count() == 0 ? 100 : Math.Round(((double)(depositCount.Count() - previousDepositCount.Count()) / previousDepositCount.Count() * 100), 2, MidpointRounding.AwayFromZero),
                        WithdrawalTransactionPercentChange = previousWithdrawalCount.Count() == 0 ? 100 : Math.Round(((double)(withdrawalCount.Count() - previousWithdrawalCount.Count()) / previousWithdrawalCount.Count() * 100), 2, MidpointRounding.AwayFromZero),
                    };
                }
                else if (reportPeriod == StatisticsReportPeriodEnum.Weekly)
                {
                    DateOnly today = DateOnly.FromDateTime(_dateHelpers.GetNowByAppTimeZone());
                    DateOnly startOfWeek = DateOnly.FromDateTime(_dateHelpers.GetDayOfWeek(_dateHelpers.GetNowByAppTimeZone(), DayOfWeek.Monday));
                    DateOnly endOfWeek = startOfWeek.AddDays(6);
                    var depositCount = await _unitOfWork.AccountBalanceTransactionRepository.FindByTypesAndStatusesAndPeriodAsync(
                        depositTransactionTypeIds,
                        transactionStatusIds,
                        startOfWeek,
                        endOfWeek);
                    var previousStartOfWeek = startOfWeek.AddDays(-7);
                    var previousEndOfWeek = endOfWeek.AddDays(-7);
                    var previousDepositCount = await _unitOfWork.AccountBalanceTransactionRepository.FindByTypesAndStatusesAndPeriodAsync(
                        depositTransactionTypeIds,
                        transactionStatusIds,
                        previousStartOfWeek,
                        previousEndOfWeek);
                    var withdrawalCount = await _unitOfWork.AccountBalanceTransactionRepository.FindByTypesAndStatusesAndPeriodAsync(
                        withdrawalTransactionTypeIds,
                        transactionStatusIds,
                        startOfWeek,
                        endOfWeek);
                    var previousWithdrawalCount = await _unitOfWork.AccountBalanceTransactionRepository.FindByTypesAndStatusesAndPeriodAsync(
                        withdrawalTransactionTypeIds,
                        transactionStatusIds,
                        previousStartOfWeek,
                        previousEndOfWeek);
                    return new AccountBalanceSummaryTransactionCountDTO
                    {
                        DepositTransactionCount = depositCount.Count(),
                        WithdrawalTransactionCount = withdrawalCount.Count(),
                        DepositTransactionPercentChange = previousDepositCount.Count() == 0 ? 100 : Math.Round(((double)(depositCount.Count() - previousDepositCount.Count()) / previousDepositCount.Count() * 100), 2, MidpointRounding.AwayFromZero),
                        WithdrawalTransactionPercentChange = previousWithdrawalCount.Count() == 0 ? 100 : Math.Round(((double)(withdrawalCount.Count() - previousWithdrawalCount.Count()) / previousWithdrawalCount.Count() * 100), 2, MidpointRounding.AwayFromZero),
                    };
                }
                else if (reportPeriod == StatisticsReportPeriodEnum.Monthly)
                {
                    DateOnly today = DateOnly.FromDateTime(_dateHelpers.GetNowByAppTimeZone());
                    DateOnly startDateOfMonth = DateOnly.FromDateTime(_dateHelpers.GetFirstDayOfMonthByDate(_dateHelpers.GetNowByAppTimeZone()));
                    DateOnly endDateOfMonth = DateOnly.FromDateTime(_dateHelpers.GetLastDayOfMonthByDate(_dateHelpers.GetNowByAppTimeZone()));
                    var depositCount = await _unitOfWork.AccountBalanceTransactionRepository.FindByTypesAndStatusesAndPeriodAsync(
                        depositTransactionTypeIds,
                        transactionStatusIds,
                        startDateOfMonth,
                        endDateOfMonth);
                    var previousStartDateOfMonth = startDateOfMonth.AddMonths(-1);
                    var previousEndDateOfMonth = endDateOfMonth.AddMonths(-1);
                    var previousDepositCount = await _unitOfWork.AccountBalanceTransactionRepository.FindByTypesAndStatusesAndPeriodAsync(
                        depositTransactionTypeIds,
                        transactionStatusIds,
                        previousStartDateOfMonth,
                        previousEndDateOfMonth);
                    var withdrawalCount = await _unitOfWork.AccountBalanceTransactionRepository.FindByTypesAndStatusesAndPeriodAsync(
                        withdrawalTransactionTypeIds,
                        transactionStatusIds,
                        startDateOfMonth,
                        endDateOfMonth);
                    var previousWithdrawalCount = await _unitOfWork.AccountBalanceTransactionRepository.FindByTypesAndStatusesAndPeriodAsync(
                        withdrawalTransactionTypeIds,
                        transactionStatusIds,
                        previousStartDateOfMonth,
                        previousEndDateOfMonth);
                    return new AccountBalanceSummaryTransactionCountDTO
                    {
                        DepositTransactionCount = depositCount.Count(),
                        WithdrawalTransactionCount = withdrawalCount.Count(),
                        DepositTransactionPercentChange = previousDepositCount.Count() == 0 ? 100 : Math.Round(((double)depositCount.Count() - previousDepositCount.Count()) / previousDepositCount.Count() * 100, 2, MidpointRounding.AwayFromZero),
                        WithdrawalTransactionPercentChange = previousWithdrawalCount.Count() == 0 ? 100 : Math.Round(((double)withdrawalCount.Count() - previousWithdrawalCount.Count()) / previousWithdrawalCount.Count() * 100, 2, MidpointRounding.AwayFromZero),
                    };
                }
                else if (reportPeriod == StatisticsReportPeriodEnum.Yearly)
                {
                    DateOnly today = DateOnly.FromDateTime(_dateHelpers.GetNowByAppTimeZone());
                    DateOnly startDateOfYear = DateOnly.FromDateTime(_dateHelpers.GetFirstDayOfYearByDate(_dateHelpers.GetNowByAppTimeZone()));
                    DateOnly endDateOfYear = DateOnly.FromDateTime(_dateHelpers.GetLastDayOfYearByDate(_dateHelpers.GetNowByAppTimeZone()));
                    var depositCount = await _unitOfWork.AccountBalanceTransactionRepository.FindByTypesAndStatusesAndPeriodAsync(
                        depositTransactionTypeIds,
                        transactionStatusIds,
                        startDateOfYear,
                        endDateOfYear);
                    var previousStartDateOfYear = startDateOfYear.AddYears(-1);
                    var previousEndDateOfYear = endDateOfYear.AddYears(-1);
                    var previousDepositCount = await _unitOfWork.AccountBalanceTransactionRepository.FindByTypesAndStatusesAndPeriodAsync(
                        depositTransactionTypeIds,
                        transactionStatusIds,
                        previousStartDateOfYear,
                        previousEndDateOfYear);
                    var withdrawalCount = await _unitOfWork.AccountBalanceTransactionRepository.FindByTypesAndStatusesAndPeriodAsync(
                        withdrawalTransactionTypeIds,
                        transactionStatusIds,
                        startDateOfYear,
                        endDateOfYear);
                    var previousWithdrawalCount = await _unitOfWork.AccountBalanceTransactionRepository.FindByTypesAndStatusesAndPeriodAsync(
                        withdrawalTransactionTypeIds,
                        transactionStatusIds,
                        previousStartDateOfYear,
                        previousEndDateOfYear);
                    return new AccountBalanceSummaryTransactionCountDTO
                    {
                        DepositTransactionCount = depositCount.Count(),
                        WithdrawalTransactionCount = withdrawalCount.Count(),
                        DepositTransactionPercentChange = previousDepositCount.Count() == 0 ? 100 : Math.Round(((double)(depositCount.Count() - previousDepositCount.Count()) / previousDepositCount.Count() * 100), 2, MidpointRounding.AwayFromZero),
                        WithdrawalTransactionPercentChange = previousWithdrawalCount.Count() == 0 ? 100 : Math.Round(((double)(withdrawalCount.Count() - previousWithdrawalCount.Count()) / previousWithdrawalCount.Count() * 100), 2, MidpointRounding.AwayFromZero),
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
                throw new HttpRequestException("Lấy báo cáo giao dịch thất bại, lí do: " + ex.Message);
            }

        }

        // ///////////////////////////////////////////////////////////



    }
}
