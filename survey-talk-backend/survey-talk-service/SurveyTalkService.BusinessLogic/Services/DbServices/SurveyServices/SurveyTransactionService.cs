using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SurveyTalkService.Common.AppConfigurations.App.interfaces;
using SurveyTalkService.Common.AppConfigurations.FilePath.interfaces;
using SurveyTalkService.DataAccess.Data;
using SurveyTalkService.BusinessLogic.Helpers;
using SurveyTalkService.DataAccess.UOW;
using SurveyTalkService.DataAccess.Repositories.interfaces;
using SurveyTalkService.BusinessLogic.Services.AWSServices.S3;
using SurveyTalkService.DataAccess.Entities;
using SurveyTalkService.BusinessLogic.DTOs.Survey.Publishment;
using SurveyTalkService.BusinessLogic.DTOs.Survey.Filters;
using System.Security.Cryptography;
using Pgvector;
using SurveyTalkService.DataAccess.Entities.postgres;

namespace SurveyTalkService.BusinessLogic.Services.DbServices.SurveyServices
{
    public class SurveyTransactionService
    {
        // LOGGER
        private readonly ILogger<SurveyTransactionService> _logger;

        // CONFIG
        public readonly IAppConfig _appConfig;
        private readonly IFilePathConfig _filePathConfig;

        // DB CONTEXT
        private readonly AppDbContext _appDbContext;
        private readonly PostgresDbContext _postgresDbContext;

        // HELPERS
        private readonly BcryptHelpers _bcryptHelpers;
        private readonly JwtHelpers _jwtHelpers;
        private readonly FileHelpers _fileHelpers;
        private readonly DateHelpers _dateHelpers;


        // UNIT OF WORK
        private readonly IUnitOfWork _unitOfWork;

        // REPOSITORIES
        private readonly IGenericRepository<Account> _accountGenericRepository;
        private readonly IGenericRepository<Survey> _surveyGenericRepository;
        private readonly IGenericRepository<SurveyTimeRateConfig> _surveyTimeRateConfigGenericRepository;
        private readonly IGenericRepository<SurveyTakerSegment> _surveyTakerSegmentGenericRepository;
        private readonly IGenericRepository<SurveyTagFilter> _surveyTagFilterGenericRepository;
        private readonly IGenericRepository<SurveyStatusTracking> _surveyStatusTrackingGenericRepository;
        private readonly IGenericRepository<SurveyRewardTracking> _surveyRewardTrackingGenericRepository;
        private readonly IGenericRepository<SurveyCommunityTransaction> _surveyCommunityTransactionGenericRepository;

        // AWS SERVICE
        private readonly AWSS3Service _awsS3Service;

        public SurveyTransactionService(
            ILogger<SurveyTransactionService> logger,
            AppDbContext appDbContext,
            PostgresDbContext postgresDbContext,
            BcryptHelpers bcryptHelpers,
            JwtHelpers jwtHelpers,
            IUnitOfWork unitOfWork,

            IGenericRepository<Account> accountGenericRepository,
            IGenericRepository<Survey> surveyGenericRepository,
            IGenericRepository<SurveyTimeRateConfig> surveyTimeRateConfigGenericRepository,
            IGenericRepository<SurveyTakerSegment> surveyTakerSegmentGenericRepository,
            IGenericRepository<SurveyTagFilter> surveyTagFilterGenericRepository,
            IGenericRepository<SurveyStatusTracking> surveyStatusTrackingGenericRepository,
            IGenericRepository<SurveyRewardTracking> surveyRewardTrackingGenericRepository,
            IGenericRepository<SurveyCommunityTransaction> surveyCommunityTransactionGenericRepository,

            FileHelpers fileHelpers,
            DateHelpers dateHelpers,
            IFilePathConfig filePathConfig,
            AWSS3Service awsS3Service,
            IAppConfig appConfig
            )
        {
            _logger = logger;
            _appDbContext = appDbContext;
            _postgresDbContext = postgresDbContext;
            _bcryptHelpers = bcryptHelpers;
            _jwtHelpers = jwtHelpers;
            _unitOfWork = unitOfWork;

            _accountGenericRepository = accountGenericRepository;
            _surveyGenericRepository = surveyGenericRepository;
            _surveyTimeRateConfigGenericRepository = surveyTimeRateConfigGenericRepository;
            _surveyTakerSegmentGenericRepository = surveyTakerSegmentGenericRepository;
            _surveyTagFilterGenericRepository = surveyTagFilterGenericRepository;
            _surveyStatusTrackingGenericRepository = surveyStatusTrackingGenericRepository;
            _surveyRewardTrackingGenericRepository = surveyRewardTrackingGenericRepository;
            _surveyCommunityTransactionGenericRepository = surveyCommunityTransactionGenericRepository;

            _fileHelpers = fileHelpers;
            _filePathConfig = filePathConfig;
            _dateHelpers = dateHelpers;


            _awsS3Service = awsS3Service;
            _appConfig = appConfig;
        }



        // ///////////////////////////////////////////////////////////

        public async Task<decimal> CalculateTheoryPrice(int surveyId, int userId, PublishPriceCalculationRequestDTO publishPriceCalculationRequest)
        {
            // Validate the request
            if (publishPriceCalculationRequest.Kpi <= 0 || publishPriceCalculationRequest.RS <= 0)
            {
                throw new HttpRequestException("Invalid MaxKpi or RS value.");
            }
            try
            {
                SurveyFilterObject surveyFilterObject = new SurveyFilterObject
                {
                    RequesterId = userId,
                    SurveyTypeId = 2, // Community survey
                    IsDeletedContain = false,
                    // IsInvalidTakenResultContain = false,
                    IsAvailable = false, // Only get unpublished surveys
                    SurveyStatusIds = new List<int> { 1 } // Only get surveys with status "Draft"
                };
                var survey = await _unitOfWork.SurveyRepository.FindByIdAndFilterObjectAsync(surveyId, surveyFilterObject);
                if (survey == null)
                {
                    throw new HttpRequestException("survey với id " + surveyId.ToString() + " không tồn tại hoặc không thể thể tiếp nhận yêu cầu này ở thời điểm hiện tại");
                }
                var systemConfigProfile = await _unitOfWork.SystemConfigProfileRepository.FindActiveProfileAsync();

                decimal kpi = (decimal)publishPriceCalculationRequest.Kpi;
                decimal questionPriceSum = survey.SurveyQuestions
                    .Where(q => q.QuestionTypeId != 1) // Exclude "Text" question type
                    .Sum(q => q.QuestionType.Price);
                decimal TimeRate = publishPriceCalculationRequest.RS == 1 ? 1 : (decimal)systemConfigProfile.SurveyTimeRateConfigs
                    .Where(config => publishPriceCalculationRequest.RS >= config.MinDurationRate && publishPriceCalculationRequest.RS <= config.MaxDurationRate) // Community survey
                    .Select(config => config.Rate)
                    .FirstOrDefault();
                decimal securityRate = (decimal)systemConfigProfile.SurveySecurityModeConfigs
                    .Where(config => config.SurveySecurityModeId == survey.SecurityModeId)
                    .Select(config => config.Rate)
                    .FirstOrDefault();

                // in tất cả các thành phần 
                // Console.WriteLine($"KPI: {kpi}, Question Price Sum: {questionPriceSum}, Time Rate: {TimeRate}, Security Rate: {securityRate}");

                decimal theoryPrice = kpi * questionPriceSum * TimeRate * securityRate;


                return theoryPrice;

            }
            catch (Exception ex)
            {

                Console.WriteLine("\n" + ex.StackTrace + "\n");
                throw new HttpRequestException("Tính toán giá lý thuyết thất bại, lỗi: " + ex.Message);
            }


        }


        public async Task PublishCommunitySurvey(int surveyId, int userId, CommunitySurveyPublishRequestDTO communitySurveyPublishRequestDTO)
        {
            using (var transaction = await _appDbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    SurveyFilterObject surveyFilterObject = new SurveyFilterObject
                    {
                        RequesterId = userId,
                        SurveyTypeId = 2, // Community survey
                        IsDeletedContain = false,
                        // IsInvalidTakenResultContain = false,
                        IsAvailable = false, // Only get unpublished surveys
                        SurveyStatusIds = new List<int> { 1 } // Only get surveys with status "Draft"
                    };
                    var survey = await _unitOfWork.SurveyRepository.FindByIdAndFilterObjectAsync(surveyId, surveyFilterObject);
                    if (survey == null)
                    {
                        throw new HttpRequestException("survey với id " + surveyId.ToString() + " không tồn tại hoặc không thể thể tiếp nhận yêu cầu này ở thời điểm hiện tại");
                    }
                    var systemConfigProfile = await _unitOfWork.SystemConfigProfileRepository.FindActiveProfileAsync();


                    // 1.các loại price(có cả extra price)
                    // 2.update start date, end date, kpi, theory price, extra price, publish at (giống start date) , is available
                    // 3.lưu SurveyTakerSegment
                    // 4.lưu SurveyTagFilter + SurveyEmbeddingVectorTagFilter
                    // 5.thêm survey reward tracking đầu tiên(có cả extra price)
                    // 5.thêm survey reward tracking đầu tiên(có cả extra price)

                    // Tính toán tiền
                    // profitPrice : decimal (18,2) Theory * ProfitRate (SurveyGeneralConfig) 
                    // allocBaseAmount : decimal (18,2) (Theory + extraPrice - profitPrice ) * basePriceAllocationRate (SurveyGeneralConfig)
                    // allocTimeAmount  : decimal (18,2) (Theory + extraPrice - profitPrice ) * timePriceAllocationRate (SurveyGeneralConfig)
                    // allocLevelAmount : decimal (18,2) (Theory + extraPrice - profitPrice ) * levelPriceAllocationRate (SurveyGeneralConfig)
                    // maxXp : int số câu hỏi của survey * xpPerQuestion (SurveyGeneralConfig)
                    // takerBaseRewardPrice : allocBaseAmount / kpi


                    Console.WriteLine($"1111111111111111111111111: {systemConfigProfile.SurveyGeneralConfig.PublishProfitRate}");
                    decimal profitPrice = communitySurveyPublishRequestDTO.TheoryPrice * (decimal)systemConfigProfile.SurveyGeneralConfig.PublishProfitRate;
                    decimal allocBaseAmount = (communitySurveyPublishRequestDTO.TheoryPrice + communitySurveyPublishRequestDTO.ExtraPrice - profitPrice) * (decimal)systemConfigProfile.SurveyGeneralConfig.BasePriceAllocationRate;
                    decimal allocTimeAmount = (communitySurveyPublishRequestDTO.TheoryPrice + communitySurveyPublishRequestDTO.ExtraPrice - profitPrice) * (decimal)systemConfigProfile.SurveyGeneralConfig.TimePriceAllocationRate;
                    decimal allocLevelAmount = (communitySurveyPublishRequestDTO.TheoryPrice + communitySurveyPublishRequestDTO.ExtraPrice - profitPrice) * (decimal)systemConfigProfile.SurveyGeneralConfig.LevelPriceAllocationRate;
                    int maxXp = survey.SurveyQuestions.Count * systemConfigProfile.SurveyGeneralConfig.XpPerQuestion;
                    decimal takerBaseRewardPrice = allocBaseAmount / communitySurveyPublishRequestDTO.Kpi;
                    decimal totalPrice = communitySurveyPublishRequestDTO.TheoryPrice + communitySurveyPublishRequestDTO.ExtraPrice;
                    // cập nhật balance của account

                    var account = await _unitOfWork.AccountRepository.FindByIdAsync(userId);
                    if (account.Balance < totalPrice)
                    {
                        throw new HttpRequestException("Tài khoản không đủ tiền để đăng tải khảo sát cộng đồng, balance: " + account.Balance + ", total price: " + totalPrice);
                    }
                    account.Balance -= totalPrice;
                    await _accountGenericRepository.UpdateAsync(account.Id, account);

                    // Lưu PaymentHistory
                    var surveyCommunityTransaction = new SurveyCommunityTransaction
                    {
                        AccountId = userId,
                        Amount = totalPrice,
                        SurveyId = surveyId,
                        Profit = profitPrice,
                        TransactionStatusId = 2,
                        TransactionTypeId = 1,
                        
                    };
                    await _surveyCommunityTransactionGenericRepository.CreateAsync(surveyCommunityTransaction);


                    // Cập nhật survey
                    survey.ProfitPrice = profitPrice;
                    survey.AllocBaseAmount = allocBaseAmount;
                    survey.AllocTimeAmount = allocTimeAmount;
                    survey.AllocLevelAmount = allocLevelAmount;
                    survey.MaxXp = maxXp;
                    survey.TakerBaseRewardPrice = takerBaseRewardPrice;
                    survey.IsAvailable = true;
                    survey.StartDate = DateOnly.FromDateTime(_dateHelpers.GetNowByAppTimeZone());
                    survey.EndDate = DateOnly.FromDateTime(communitySurveyPublishRequestDTO.EndDate);
                    survey.Kpi = communitySurveyPublishRequestDTO.Kpi;
                    survey.TheoryPrice = communitySurveyPublishRequestDTO.TheoryPrice;
                    survey.ExtraPrice = communitySurveyPublishRequestDTO.ExtraPrice;
                    survey.PublishedAt = _dateHelpers.GetNowByAppTimeZone();
                    await _surveyGenericRepository.UpdateAsync(survey.Id, survey);
                    Console.WriteLine($"\n\nCập nhật survey thành công: {survey.Id}, Profit Price: {profitPrice}, Alloc Base Amount: {allocBaseAmount}, Alloc Time Amount: {allocTimeAmount}, Alloc Level Amount: {allocLevelAmount}");

                    // Lưu SurveyTakerSegment
                    if (survey.SurveyTakerSegment == null)
                    {
                        var surveyTakerSegment = communitySurveyPublishRequestDTO.SurveyTakerSegment;
                        var newSurveyTakerSegment = new SurveyTakerSegment
                        {
                            SurveyId = survey.Id,
                            CountryRegion = surveyTakerSegment.CountryRegion,
                            MaritalStatus = surveyTakerSegment.MaritalStatus,
                            AverageIncome = surveyTakerSegment.AverageIncome,
                            EducationLevel = surveyTakerSegment.EducationLevel,
                            JobField = surveyTakerSegment.JobField,
                            Prompt = surveyTakerSegment.Prompt,
                            TagFilterAccuracyRate = surveyTakerSegment.TagFilterAccuracyRate
                        };

                        await _surveyTakerSegmentGenericRepository.CreateAsync(newSurveyTakerSegment);
                    }
                    else
                    {
                        await _unitOfWork.SurveyTakerSegmentRepository.UpdateAsync(survey.Id, survey.SurveyTakerSegment);
                    }

                    var existingSurveyTimeRateConfig = await _unitOfWork.SurveyTagFilterRepository.FindBySurveyIdAsync(survey.Id);
                    // lưu SurveyTagFilter + SurveyEmbeddingVectorTagFilter
                    foreach (var tagFilter in communitySurveyPublishRequestDTO.FilterTags)
                    {
                        // lặp kiểm tra nếu có thì update, không có thì create
                        // var existingSummarizedSurveyTagFilter = survey.SurveyTagFilters.FirstOrDefault(tf => tf.FilterTagId == tagFilter.Id);
                        var existingSummarizedSurveyTagFilter = existingSurveyTimeRateConfig.FirstOrDefault(tf => tf.FilterTagId == tagFilter.Id);
                        if (existingSummarizedSurveyTagFilter != null)
                        {
                            existingSummarizedSurveyTagFilter.Summary = tagFilter.Summary;
                            existingSummarizedSurveyTagFilter.FilterTag = null; // Để tránh vòng lặp vô hạn khi serialize
                            existingSummarizedSurveyTagFilter.Survey = null; // Để tránh vòng lặp vô hạn khi serialize
                            await _unitOfWork.SurveyTagFilterRepository.UpdateAsync(existingSummarizedSurveyTagFilter);
                        }
                        else
                        {
                            var newSurveyTagFilter = new SurveyTagFilter
                            {
                                SurveyId = survey.Id,
                                FilterTagId = tagFilter.Id,
                                Summary = tagFilter.Summary
                            };
                            await _surveyTagFilterGenericRepository.CreateAsync(newSurveyTagFilter);
                        }

                        // var existingEmbeddingVectorSurveyTagFilter = await _postgresDbContext.SurveyEmbeddingVectorTagFilters
                        //     .FirstOrDefaultAsync(t => t.SurveyId == surveyId && t.FilterTagId == tagFilter.Id);
                        // if (existingEmbeddingVectorSurveyTagFilter != null)
                        // {
                        //     existingEmbeddingVectorSurveyTagFilter.EmbeddingVector = tagFilter.EmbeddingVector == null || tagFilter.EmbeddingVector.Count() == 0
                        //         ? null
                        //         : new Vector(tagFilter.EmbeddingVector.ToArray());
                        //     _postgresDbContext.SurveyEmbeddingVectorTagFilters.Update(existingEmbeddingVectorSurveyTagFilter);
                        // }
                        // else
                        // {
                        //     var newSurveyTagFilter = new SurveyEmbeddingVectorTagFilter
                        //     {
                        //         SurveyId = surveyId,
                        //         FilterTagId = tagFilter.Id,
                        //         EmbeddingVector = tagFilter.EmbeddingVector == null || tagFilter.EmbeddingVector.Count() == 0
                        //             ? null
                        //             : new Vector(tagFilter.EmbeddingVector.ToArray())
                        //     };
                        //     await _postgresDbContext.SurveyEmbeddingVectorTagFilters.AddAsync(newSurveyTagFilter);
                        // }


                    }

                    // Lưu SurveyStatusTracking
                    var surveyStatusTracking = new SurveyStatusTracking
                    {
                        SurveyId = survey.Id,
                        SurveyStatusId = 2,
                    };
                    await _surveyStatusTrackingGenericRepository.CreateAsync(surveyStatusTracking);

                    // Lưu SurveyRewardTracking
                    // RewardPrice: (takerBaseRewardPrice +  allocTimeAmount * [(currentDate - startDate)/ (endDate - startDate)]
                    // RewardXp: MaxXp * [1 -  [(currentDate - startDate)/ (endDate - startDate)]]
                    var currentDate = DateOnly.FromDateTime(_dateHelpers.GetNowByAppTimeZone());
                    var startDate = survey.StartDate;
                    var endDate = survey.EndDate;
                    var daysPassed = currentDate.DayNumber - startDate?.DayNumber;
                    var totalDays = endDate?.DayNumber - startDate?.DayNumber;
                    Console.WriteLine($"Tiền cộng đồng: {communitySurveyPublishRequestDTO.TheoryPrice}, Extra Price: {communitySurveyPublishRequestDTO.ExtraPrice}");
                    Console.WriteLine($"Profit Price: {profitPrice}, Alloc Base Amount: {allocBaseAmount}, Alloc Time Amount: {allocTimeAmount}, Alloc Level Amount: {allocLevelAmount}");
                    Console.WriteLine($"Max XP: {maxXp}, Taker Base Reward Price: {takerBaseRewardPrice}");

                    Console.WriteLine($"Current Date: {currentDate}, Start Date: {startDate}, End Date: {endDate}, Days Passed: {daysPassed}, Total Days: {totalDays}");

                    //var rewardPrice = takerBaseRewardPrice + allocTimeAmount * (decimal)daysPassed / totalDays;
                    var rewardPrice = takerBaseRewardPrice + allocTimeAmount * (decimal)daysPassed / (totalDays ?? 1);
                    var rewardXp = totalDays.HasValue && totalDays.Value != 0
                        ? (int)Math.Floor(maxXp * ((decimal)((1 - daysPassed) / totalDays ?? 1)))
                        : 0;

                    Console.WriteLine($"Reward Price: {rewardPrice}, Reward XP: {rewardXp}");
                    await _surveyRewardTrackingGenericRepository.CreateAsync(new SurveyRewardTracking
                    {
                        SurveyId = survey.Id,
                        RewardPrice = rewardPrice,
                        RewardXp = rewardXp,
                    });

                    await transaction.CommitAsync();
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    Console.WriteLine("\n" + ex.StackTrace + "\n");
                    throw new HttpRequestException("Đăng tải khảo sát cộng đồng thất bại, lỗi: " + ex.Message);
                }
            }

            using (var transaction = await _postgresDbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    foreach (var tagFilter in communitySurveyPublishRequestDTO.FilterTags)
                    {
                        var existingEmbeddingVectorSurveyTagFilter = await _postgresDbContext.SurveyEmbeddingVectorTagFilters
                            .FirstOrDefaultAsync(t => t.SurveyId == surveyId && t.FilterTagId == tagFilter.Id);
                        if (existingEmbeddingVectorSurveyTagFilter != null)
                        {
                            existingEmbeddingVectorSurveyTagFilter.EmbeddingVector = tagFilter.EmbeddingVector == null || tagFilter.EmbeddingVector.Count() == 0
                                ? null
                                : new Vector(tagFilter.EmbeddingVector.ToArray());
                            _postgresDbContext.SurveyEmbeddingVectorTagFilters.Update(existingEmbeddingVectorSurveyTagFilter);
                        }
                        else
                        {
                            var newSurveyTagFilter = new SurveyEmbeddingVectorTagFilter
                            {
                                SurveyId = surveyId,
                                FilterTagId = tagFilter.Id,
                                EmbeddingVector = tagFilter.EmbeddingVector == null || tagFilter.EmbeddingVector.Count() == 0
                                    ? null
                                    : new Vector(tagFilter.EmbeddingVector.ToArray())
                            };
                            await _postgresDbContext.SurveyEmbeddingVectorTagFilters.AddAsync(newSurveyTagFilter);
                        }


                    }


                    await _postgresDbContext.SaveChangesAsync();
                    await transaction.CommitAsync();
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    Console.WriteLine("\n" + ex.StackTrace + "\n");
                    throw new HttpRequestException("Đăng tải khảo sát cộng đồng thành công, lỗi filter tag: " + ex.Message);
                }
            }
        }

        // public async Task<JArray> GetStaffAccounts()
        // {
        //     List<int> roles = new List<int>([2, 3]);
        //     var staffs = await _appDbContext.Accounts
        //         .AsNoTracking()
        //         .Include(account => account.Role)
        //         .Include(account => account.JobType)
        //         .Where(account => roles.Contains(account.RoleId))
        //         .ToListAsync();

        //     // IEnumerable<Account> resultList = heads.Concat(assignees);

        //     var result = await Task.WhenAll(staffs.Select(async item =>
        //     {
        //         string folderPath = _filePathConfig.ACCOUNt_IMAGE_PATH;
        //         return new
        //         {
        //             Account = new
        //             {
        //                 Id = item.Id,
        //                 FullName = item.FullName,
        //                 Email = item.Email,
        //                 DateOfBirth = item.DateOfBirth,
        //                 Address = item.Address,
        //                 Phone = item.Phone,
        //                 RoleId = item.RoleId,
        //                 JobTypeId = item.JobTypeId,
        //                 ImageUrl = await GenerateImageUrl(_filePathConfig.ACCOUNt_IMAGE_PATH, item.Id.ToString(), "main"),
        //                 IsDeactivated = item.IsDeactivated,
        //                 CreatedAt = item.CreatedAt,
        //             },
        //             Role = new
        //             {
        //                 Id = item.Role.Id,
        //                 Name = item.Role.Name
        //             },
        //             JobType = new
        //             {
        //                 Id = item.JobType.Id,
        //                 Name = item.JobType.Name
        //             }
        //         };
        //     }));
        //     return JArray.FromObject(
        //         result
        //         , new JsonSerializer
        //         {
        //             ReferenceLoopHandling = ReferenceLoopHandling.Ignore
        //         });
        // }

        // public async Task CreateStaffAccount(dynamic staffAccount)
        // {
        //     Account account = await _unitOfWork.AccountRepository.FindByEmail(staffAccount.Email.ToString());
        //     if (account != null)
        //     {
        //         // throw new HttpRequestException("Email đã tồn tại");
        //         throw new HttpRequestException("Email is already exist, email: " + staffAccount.Email.ToString());
        //     }

        //     using (var transaction = await _appDbContext.Database.BeginTransactionAsync())
        //     {
        //         try
        //         {
        //             account = new Account
        //             {
        //                 Email = staffAccount.Email,
        //                 Password = _bcryptHelpers.HashPassword(staffAccount.Password.ToString()),
        //                 FullName = staffAccount.FullName.ToString(),
        //                 RoleId = staffAccount.RoleId,
        //                 JobTypeId = staffAccount.JobTypeId,
        //                 DateOfBirth = staffAccount.DateOfBirth,
        //                 Address = staffAccount.Address,
        //                 Phone = staffAccount.Phone,
        //             };

        //             await _accountRepository.CreateAsync(account);
        //             if (staffAccount.Image != null && staffAccount.Image != "")
        //             {
        //                 string folderPath = _filePathConfig.ACCOUNt_IMAGE_PATH + "\\" + account.Id;
        //                 string data = staffAccount.Image.ToString();
        //                 await SaveBase64File(data, folderPath, "main");
        //             }
        //             else
        //             {
        //                 string folderPath = _filePathConfig.ACCOUNt_IMAGE_PATH + "\\" + account.Id;
        //                 await CopyFile(_filePathConfig.ACCOUNt_IMAGE_PATH, "unknown", folderPath, "main");
        //             }

        //             await transaction.CommitAsync();
        //         }
        //         catch (Exception ex)
        //         {
        //             await transaction.RollbackAsync();
        //             Console.WriteLine("\n" + ex.Message + "\n");
        //             throw new HttpRequestException("Failed to create staff account: " + ex.Message);
        //         }
        //     }
        // }

        // public async Task<JObject> GetStaffDetail(int accountId)
        // {
        //     var account = await _unitOfWork.AccountRepository.FindById(accountId);


        //     if (account == null)
        //     {
        //         throw new HttpRequestException("Account is not exist, id: " + accountId.ToString());
        //     }
        //     if (account.RoleId != 2 && account.RoleId != 3)
        //     {
        //         throw new HttpRequestException("Account is not Staff, id: " + accountId.ToString());
        //     }

        //     return JObject.FromObject(new
        //     {
        //         Account = new
        //         {
        //             Id = account.Id,
        //             FullName = account.FullName,
        //             Email = account.Email,
        //             DateOfBirth = account.DateOfBirth,
        //             Address = account.Address,
        //             Phone = account.Phone,
        //             RoleId = account.RoleId,
        //             JobTypeId = account.JobTypeId,
        //             ImageUrrl = await GenerateImageUrl(_filePathConfig.ACCOUNt_IMAGE_PATH, account.Id.ToString(), "main"),
        //             IsDeactivated = account.IsDeactivated,
        //             CreatedAt = account.CreatedAt,
        //         },
        //         Role = new
        //         {
        //             Id = account.Role.Id,
        //             Name = account.Role.Name
        //         },
        //         JobType = new
        //         {
        //             Id = account.JobType.Id,
        //             Name = account.JobType.Name
        //         }
        //     }, new JsonSerializer
        //     {
        //         ReferenceLoopHandling = ReferenceLoopHandling.Ignore
        //     });
        // }

        // public async Task UpdateStaffAccount(int accountId, dynamic staffAccount)
        // {
        //     var account = await _unitOfWork.AccountRepository.FindById(accountId);

        //     if (account == null)
        //     {
        //         throw new HttpRequestException("Account is not exist, id: " + accountId.ToString());
        //     }

        //     var existinngEmail = await _unitOfWork.AccountRepository.FindByEmail(staffAccount.Email.ToString());
        //     if (existinngEmail != null && existinngEmail.Id != accountId)
        //     {
        //         throw new HttpRequestException("Email is already exist, email: " + staffAccount.Email.ToString());
        //     }

        //     if (account.RoleId != 2 && account.RoleId != 3)
        //     {
        //         throw new HttpRequestException("Account is not Staff, id: " + accountId.ToString());
        //     }


        //     using (var transaction = await _appDbContext.Database.BeginTransactionAsync())
        //     {
        //         try
        //         {
        //             account.FullName = staffAccount.FullName;
        //             account.JobTypeId = staffAccount.JobTypeId;
        //             account.DateOfBirth = staffAccount.DateOfBirth;
        //             account.Address = staffAccount.Address;
        //             account.Phone = staffAccount.Phone;
        //             account.Email = staffAccount.Email;

        //             await _accountRepository.UpdateAsync(account.Id, account);

        //             if (staffAccount.Image != null && staffAccount.Image != "")
        //             {
        //                 string folderPath = _filePathConfig.ACCOUNt_IMAGE_PATH + "\\" + account.Id;
        //                 string data = staffAccount.Image.ToString();

        //                 await SaveBase64File(data, folderPath, "main");
        //             }

        //             await transaction.CommitAsync();
        //         }
        //         catch (Exception ex)
        //         {
        //             await transaction.RollbackAsync();
        //             Console.WriteLine("\n\n\n" + ex.Message + "\n\n\n");
        //             throw new HttpRequestException("Failed to update staff account: " + ex.Message);
        //         }
        //     }

        // }

        // public async Task DeactivateAccount(int accountId, bool deactivate, string type)
        // {
        //     var account = await _unitOfWork.AccountRepository.FindById(accountId);


        //     if (account == null)
        //     {
        //         throw new HttpRequestException("Account is not exist, id: " + accountId.ToString());
        //     }

        //     if (type == "staff" && account.RoleId != 2 && account.RoleId != 3)
        //     {
        //         throw new HttpRequestException("Account is not Staff, id: " + accountId.ToString());
        //     }
        //     else if (type == "member" && account.RoleId != 4)
        //     {
        //         throw new HttpRequestException("Account is not Campus Member, id: " + accountId.ToString());
        //     }

        //     try
        //     {
        //         if (type == "staff")
        //         {
        //             if (account.RoleId == 3)
        //             {
        //                 var serviceRequests = await _unitOfWork.ServiceRequestRepository.FindByAssignedAssigneeId(accountId);
        //                 foreach (var serviceRequest in serviceRequests)
        //                 {
        //                     if (serviceRequest.RequestStatusId != 7 && serviceRequest.RequestStatusId != 8 && serviceRequest.RequestStatusId != 9)
        //                     {
        //                         serviceRequest.RequestStatusId = 4;
        //                         await _serviceRequestRepository.UpdateAsync(serviceRequest.Id, serviceRequest);
        //                     }
        //                 }
        //             }
        //             else if (account.RoleId == 2)
        //             {
        //                 var majors = await _unitOfWork.AssigneeFacilityMajorAssignmentRepository.FindByAccountId(accountId);
        //                 foreach (var major in majors)
        //                 {
        //                     var majorAssignments = (await _unitOfWork.AssigneeFacilityMajorAssignmentRepository.FindByFacilityMajorId(major.FacilityMajorId)).Where(x => x.IsHead == true && x.Account.IsDeactivated == false && x.AccountId != accountId);
        //                     foreach (var majorAssignment in majorAssignments)
        //                     {
        //                         Console.WriteLine(majorAssignment.Account.Id + " " + majorAssignment.Account.IsDeactivated);
        //                     }
        //                     if (majorAssignments.Count() < 1)
        //                     {
        //                         throw new HttpRequestException("Failed to deactivate account, there must be at least 1 head in major id " + major.FacilityMajorId);
        //                     }
        //                 }

        //             }
        //         }
        //         await _unitOfWork.AccountRepository.Deactivate(accountId, deactivate);
        //     }
        //     catch (Exception ex)
        //     {
        //         Console.WriteLine("\n\n\n" + ex.Message + "\n\n\n");
        //         throw new HttpRequestException("Failed to deactivate account: " + ex.Message);
        //     }
        // }

        // public async Task<JArray> GetMemberAccounts()
        // {

        //     List<int> roles = new List<int>([4]);
        //     var staffs = await _appDbContext.Accounts
        //         .AsNoTracking()
        //         .Include(account => account.Role)
        //         .Include(account => account.JobType)
        //         .Where(account => roles.Contains(account.RoleId))
        //         .ToListAsync();

        //     var result = await Task.WhenAll(staffs.Select(async item =>
        //     {
        //         string folderPath = _filePathConfig.ACCOUNt_IMAGE_PATH;
        //         return new
        //         {
        //             Account = new
        //             {
        //                 Id = item.Id,
        //                 FullName = item.FullName,
        //                 Email = item.Email,
        //                 DateOfBirth = item.DateOfBirth,
        //                 Address = item.Address,
        //                 Phone = item.Phone,
        //                 RoleId = item.RoleId,
        //                 JobTypeId = item.JobTypeId,
        //                 ImageUrl = await GenerateImageUrl(_filePathConfig.ACCOUNt_IMAGE_PATH, item.Id.ToString(), "main"),
        //                 IsDeactivated = item.IsDeactivated,
        //                 CreatedAt = item.CreatedAt,
        //             },
        //             Role = new
        //             {
        //                 Id = item.Role.Id,
        //                 Name = item.Role.Name
        //             },
        //             JobType = new
        //             {
        //                 Id = item.JobType.Id,
        //                 Name = item.JobType.Name
        //             }
        //         };
        //     }));
        //     return JArray.FromObject(
        //         result
        //         , new JsonSerializer
        //         {
        //             ReferenceLoopHandling = ReferenceLoopHandling.Ignore
        //         });
        // }

        // public async Task CreateMemberAccount(dynamic memberAccount)
        // {
        //     Account account = await _unitOfWork.AccountRepository.FindByEmail(memberAccount.Email.ToString());
        //     if (account != null)
        //     {
        //         throw new HttpRequestException("Email is already exist, email: " + memberAccount.Email.ToString());
        //     }

        //     using (var transaction = await _appDbContext.Database.BeginTransactionAsync())
        //     {
        //         try
        //         {
        //             account = new Account
        //             {
        //                 Email = memberAccount.Email,
        //                 Password = _bcryptHelpers.HashPassword(memberAccount.Password.ToString()),
        //                 FullName = memberAccount.FullName.ToString(),
        //                 RoleId = 4,
        //                 JobTypeId = memberAccount.JobTypeId,
        //                 DateOfBirth = memberAccount.DateOfBirth,
        //                 Address = memberAccount.Address,
        //                 Phone = memberAccount.Phone,
        //             };

        //             await _accountRepository.CreateAsync(account);
        //             if (memberAccount.Image != null && memberAccount.Image != "")
        //             {
        //                 string folderPath = _filePathConfig.ACCOUNt_IMAGE_PATH + "\\" + account.Id;
        //                 string data = memberAccount.Image.ToString();
        //                 await SaveBase64File(data, folderPath, "main");
        //             }
        //             else
        //             {
        //                 string folderPath = _filePathConfig.ACCOUNt_IMAGE_PATH + "\\" + account.Id;
        //                 await CopyFile(_filePathConfig.ACCOUNt_IMAGE_PATH, "unknown", folderPath, "main");
        //             }

        //             await transaction.CommitAsync();
        //         }
        //         catch (Exception ex)
        //         {
        //             await transaction.RollbackAsync();
        //             Console.WriteLine("\n" + ex.Message + "\n");
        //             throw new HttpRequestException("Failed to create member account: " + ex.Message);
        //         }
        //     }
        // }


        // public async Task<JObject> GetMemberDetail(int accountId)
        // {
        //     var account = await _unitOfWork.AccountRepository.FindById(accountId);


        //     if (account == null)
        //     {
        //         throw new HttpRequestException("Account is not exist, id: " + accountId.ToString());
        //     }
        //     if (account.RoleId != 4)
        //     {
        //         throw new HttpRequestException("Account is not Campus Member, id: " + accountId.ToString());
        //     }

        //     return JObject.FromObject(new
        //     {
        //         Account = new
        //         {
        //             Id = account.Id,
        //             FullName = account.FullName,
        //             Email = account.Email,
        //             DateOfBirth = account.DateOfBirth,
        //             Address = account.Address,
        //             Phone = account.Phone,
        //             RoleId = account.RoleId,
        //             JobTypeId = account.JobTypeId,
        //             ImageUrl = await GenerateImageUrl(_filePathConfig.ACCOUNt_IMAGE_PATH, account.Id.ToString(), "main"),
        //             IsDeactivated = account.IsDeactivated,
        //             CreatedAt = account.CreatedAt,
        //         },
        //         Role = new
        //         {
        //             Id = account.Role.Id,
        //             Name = account.Role.Name
        //         },
        //         JobType = new
        //         {
        //             Id = account.JobType.Id,
        //             Name = account.JobType.Name
        //         }
        //     }, new JsonSerializer
        //     {
        //         ReferenceLoopHandling = ReferenceLoopHandling.Ignore
        //     });
        // }

        // public async Task UpdateMemberAccount(int accountId, dynamic memberAccount)
        // {
        //     var account = await _unitOfWork.AccountRepository.FindById(accountId);

        //     if (account == null)
        //     {
        //         // throw new HttpRequestException("Tài khoản không tồn tại");
        //         throw new HttpRequestException("Account is not exist, id: " + accountId.ToString());
        //     }

        //     var existinngEmail = await _unitOfWork.AccountRepository.FindByEmail(memberAccount.Email.ToString());
        //     if (existinngEmail != null && existinngEmail.Id != accountId)
        //     {
        //         // throw new HttpRequestException("Email đã tồn tại");
        //         throw new HttpRequestException("Email is already exist, email: " + memberAccount.Email.ToString());
        //     }

        //     if (account.RoleId != 4)
        //     {
        //         // throw new HttpRequestException("Tài khoản không phải là member");
        //         throw new HttpRequestException("Account is not Campus Member, id: " + accountId.ToString());
        //     }

        //     using (var transaction = await _appDbContext.Database.BeginTransactionAsync())
        //     {
        //         try
        //         {
        //             account.FullName = memberAccount.FullName;
        //             account.JobTypeId = memberAccount.JobTypeId;
        //             account.DateOfBirth = memberAccount.DateOfBirth;
        //             account.Address = memberAccount.Address;
        //             account.Phone = memberAccount.Phone;
        //             account.Email = memberAccount.Email;

        //             await _accountRepository.UpdateAsync(account.Id, account);

        //             if (memberAccount.Image != null && memberAccount.Image != "")
        //             {
        //                 string folderPath = _filePathConfig.ACCOUNt_IMAGE_PATH + "\\" + account.Id;
        //                 string data = memberAccount.Image.ToString();

        //                 await SaveBase64File(data, folderPath, "main");
        //             }

        //             await transaction.CommitAsync();
        //         }
        //         catch (Exception ex)
        //         {
        //             await transaction.RollbackAsync();
        //             Console.WriteLine("\n\n\n" + ex.Message + "\n\n\n");
        //             throw new HttpRequestException("Failed to update member account: " + ex.Message);
        //         }
        //     }
        // }

        // public async Task<JArray> GetRoles()
        // {
        //     var roles = await _roleRepository.FindAllAsync();

        //     return JArray.FromObject(roles, new JsonSerializer
        //     {
        //         ReferenceLoopHandling = ReferenceLoopHandling.Ignore
        //     });
        // }

        // public async Task<JArray> GetJobTypes()
        // {
        //     var jobTypes = await _jobTypeRepository.FindAllAsync();

        //     return JArray.FromObject(jobTypes, new JsonSerializer
        //     {
        //         ReferenceLoopHandling = ReferenceLoopHandling.Ignore
        //     });
        // }



    }
}
