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
using SurveyTalkService.BusinessLogic.DTOs.FilterTags;
using Microsoft.EntityFrameworkCore;
using SurveyTalkService.Common.AppConfigurations.BusinessSetting.interfaces;
using Duende.IdentityServer.Extensions;

namespace SurveyTalkService.BusinessLogic.Services.DbServices.SurveyServices
{
    public class SurveyResponseService
    {
        // LOGGER
        private readonly ILogger<SurveySessionService> _logger;

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
        private readonly IGenericRepository<Account> _accountGenericRepository;
        private readonly IGenericRepository<AccountOnlineTracking> _accountOnlineTrackingGenericRepository;
        private readonly IGenericRepository<TakerTagFilter> _takerTagFilterGenericRepository;
        private readonly IGenericRepository<FilterTag> _filterTagGenericRepository;
        private readonly IGenericRepository<AccountProfile> _accountProfileGenericRepository;
        private readonly IGenericRepository<Survey> _surveyGenericRepository;
        private readonly IGenericRepository<SurveyQuestion> _surveyQuestionGenericRepository;
        private readonly IGenericRepository<SurveyOption> _surveyOptionGenericRepository;
        private readonly IGenericRepository<SurveyTakenResult> _surveyTakenResultGenericRepository;
        private readonly IGenericRepository<SurveyResponse> _surveyResponseGenericRepository;
        private readonly IGenericRepository<SurveyTagFilter> _surveyTagFilterGenericRepository;
        private readonly IGenericRepository<SurveyTakenResultTagFilter> _surveyTakenResultTagFilterGenericRepository;
        private readonly IGenericRepository<SurveyStatusTracking> _surveyStatusTrackingGenericRepository;
        private readonly IGenericRepository<PaymentHistory> _paymentHistoryGenericRepository;

        // AWS SERVICE
        private readonly AWSS3Service _awsS3Service;

        // OPENAI SERVICE
        private readonly OpenAI4oMiniService _openAI4oMiniService;

        // EMBEDDING VECTOR SERVICE
        private readonly SurveyEmbeddingVectorService _surveyEmbeddingVectorService;

        public SurveyResponseService(
            ILogger<SurveySessionService> logger,
            AppDbContext appDbContext,
            PostgresDbContext postgresDbContext,

            BcryptHelpers bcryptHelpers,
            JwtHelpers jwtHelpers,
            DateHelpers dateHelpers,
            IUnitOfWork unitOfWork,

            IGenericRepository<Account> accountGenericRepository,
            IGenericRepository<AccountOnlineTracking> accountOnlineTrackingGenericRepository,
            IGenericRepository<TakerTagFilter> takerTagFilterGenericRepository,
            IGenericRepository<FilterTag> filterTagGenericRepository,
            IGenericRepository<AccountProfile> accountProfileGenericRepository,
            IGenericRepository<Survey> surveyGenericRepository,
            IGenericRepository<SurveyQuestion> surveyQuestionGenericRepository,
            IGenericRepository<SurveyOption> surveyOptionGenericRepository,
            IGenericRepository<SurveyTakenResult> surveyTakenResultGenericRepository,
            IGenericRepository<SurveyResponse> surveyResponseGenericRepository,
            IGenericRepository<SurveyTagFilter> surveyTagFilterGenericRepository,
            IGenericRepository<SurveyTakenResultTagFilter> surveyTakenResultTagFilterGenericRepository,
            IGenericRepository<SurveyStatusTracking> surveyStatusTrackingGenericRepository,
            IGenericRepository<PaymentHistory> paymentHistoryGenericRepository,


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

            _accountGenericRepository = accountGenericRepository;
            _accountOnlineTrackingGenericRepository = accountOnlineTrackingGenericRepository;
            _takerTagFilterGenericRepository = takerTagFilterGenericRepository;
            _filterTagGenericRepository = filterTagGenericRepository;
            _accountProfileGenericRepository = accountProfileGenericRepository;
            _surveyGenericRepository = surveyGenericRepository;
            _surveyQuestionGenericRepository = surveyQuestionGenericRepository;
            _surveyOptionGenericRepository = surveyOptionGenericRepository;
            _surveyTakenResultGenericRepository = surveyTakenResultGenericRepository;
            _surveyResponseGenericRepository = surveyResponseGenericRepository;
            _surveyTagFilterGenericRepository = surveyTagFilterGenericRepository;
            _surveyTakenResultTagFilterGenericRepository = surveyTakenResultTagFilterGenericRepository;
            _surveyStatusTrackingGenericRepository = surveyStatusTrackingGenericRepository;
            _paymentHistoryGenericRepository = paymentHistoryGenericRepository;

            _fileHelpers = fileHelpers;
            _imageHelpers = imageHelpers;
            _filePathConfig = filePathConfig;


            _awsS3Service = awsS3Service;
            _openAI4oMiniService = openAI4oMiniService;
            _surveyEmbeddingVectorService = surveyEmbeddingVectorService;
            _appConfig = appConfig;
            _surveyConfig = surveyConfig;
        }

        public async Task TrackingOnline(int accountId)
        {
            // kiểm tra hôm nay đã có dòng nào chưa, nếu chưa thì câp nhật surveyTakenCount += 1
            var today = DateOnly.FromDateTime(_dateHelpers.GetNowByAppTimeZone());
            var existingTracking = await _unitOfWork.AccountOnlineTrackingRepository.FindLatestByAccountIdAsync(accountId);
            if (existingTracking != null && existingTracking.OnlineDate == today)
            {
                existingTracking.SurveyTakenCount += 1;
                await _accountOnlineTrackingGenericRepository.UpdateAsync(existingTracking.Id, existingTracking);
                return;
            }
            else
            {
                var newTracking = new AccountOnlineTracking
                {
                    AccountId = accountId
                };
                await _accountOnlineTrackingGenericRepository.CreateAsync(newTracking);
            }
        }

        /////////////////////////////////////////////////////////////

        public async Task TakeFilterSurveyResponse(int surveyId, int userId, SurveyResponseRequestDTO surveyResponseRequestDTO)
        {
            var summarizedFilterTags = new List<SummarizedFilterTagDTO>();
            var vectorEncodedFilterTags = new List<EmbeddingVectorFilterTagDTO>();
            // var isValid = true;

            var defaultFilterTags = (await _unitOfWork.FilterTagRepository.FindByTagTypeIdAsync(1)).ToList();
            var additionalFilterTags = (await _unitOfWork.FilterTagRepository.FindByTagTypeIdAsync(2)).Select(tag => new FilterTag
            {
                Id = tag.Id,
                FilterTagTypeId = tag.FilterTagTypeId,
                Name = tag.Name,
                FilterTagType = new FilterTagType
                {
                    Id = tag.FilterTagType.Id,
                    Name = tag.FilterTagType.Name
                }
            }).ToList();
            using (var transaction = await _appDbContext.Database.BeginTransactionAsync())
            {
                try
                {

                    SurveyFilterObject surveyFilterObject = new SurveyFilterObject
                    {
                        IsDeletedContain = false,
                        // IsInvalidTakenResultContain = false,
                        IsAvailable = true,
                        SurveyTypeId = 1,
                        SurveyStatusIds = new List<int> { 2 }
                    };

                    Survey survey = await _unitOfWork.SurveyRepository.FindByIdAndFilterObjectAsync(surveyId, surveyFilterObject);
                    if (survey == null)
                    {
                        throw new Exception("survey không tồn tại");
                    }

                    var newSurveyTakenResult = new SurveyTakenResult
                    {
                        SurveyId = surveyId,
                        TakerId = userId,
                        IsValid = surveyResponseRequestDTO.SurveyResponses.Any(r => r.IsValid == false) ? false : true,
                        CompletedAt = _dateHelpers.GetNowByAppTimeZone(),
                        InvalidReason = surveyResponseRequestDTO.InvalidReason,
                    };

                    // Lưu kết quả khảo sát
                    await _surveyTakenResultGenericRepository.CreateAsync(newSurveyTakenResult);

                    foreach (var response in surveyResponseRequestDTO.SurveyResponses)
                    {
                        var jsonStringValue = JsonConvert.SerializeObject(response.ValueJson);

                        var newSurveyResponse = new SurveyResponse
                        {
                            SurveyTakenResultId = newSurveyTakenResult.Id,
                            IsValid = response.IsValid,
                            ValueJsonString = jsonStringValue,
                            SurveyQuestionId = response.ValueJson.QuestionContent.Id
                        };
                        // Lưu phản hồi câu hỏi
                        await _surveyResponseGenericRepository.CreateAsync(newSurveyResponse);
                    }

                    Account account = await _unitOfWork.AccountRepository.FindByIdAsync(userId);
                    // account.IsFilterSurveyRequired = false;
                    // account.LastFilterSurveyTakenAt = _dateHelpers.GetNowByAppTimeZone();
                    // Console.WriteLine("1111111111111111111111111111: " + (account.AccountProfile == null ? "null" : account.AccountProfile.AccountId));
                    // // Console.WriteLine("account.IsFilterSurveyRequired: " + account.IsFilterSurveyRequired + " - account.LastFilterSurveyTakenAt: " + account.LastFilterSurveyTakenAt);
                    // var entityType = _appDbContext.Model.FindEntityType(typeof(AccountProfile));
                    // var primaryKey = entityType.FindPrimaryKey();
                    // var keyNames = primaryKey.Properties.Select(p => p.Name).ToList();
                    // Console.WriteLine("Primary Key Names: " + string.Join(", ", keyNames));

                    // Cập nhật trạng thái tài khoản
                    await _accountGenericRepository.UpdateAsync(userId, account);
                    await this.TrackingOnline(userId);

                    // lấy SurveyTopicFavorite/AccountProfile/filterSurveyTakenResult để đưa vào 
                    var accountProfile = account.AccountProfile;
                    accountProfile.Account = null;
                    var surveyTopicFavorites = (await _unitOfWork.SurveyTopicFavoriteRepository.FindByAccountIdAsync(userId)).Select(f => new SurveyTopicFavorite
                    {
                        SurveyTopicId = f.SurveyTopicId,
                        AccountId = f.AccountId,
                        FavoriteScore = f.FavoriteScore,
                        SurveyTopic = new SurveyTopic
                        {
                            Id = f.SurveyTopic.Id,
                            Name = f.SurveyTopic.Name,
                        },
                    }).ToList();
                    var filterSurveyResponseObjects = new List<SurveyResponseValueJsonDTO>();
                    foreach (var response in surveyResponseRequestDTO.SurveyResponses)
                    {
                        filterSurveyResponseObjects.Add(response.ValueJson);
                    }
                    var filterSurveyResponses = JArray.FromObject(filterSurveyResponseObjects);

                    summarizedFilterTags = await _openAI4oMiniService.GetSummarizedDefaultFilterTagAsync(defaultFilterTags, filterSurveyResponses, account, accountProfile, surveyTopicFavorites);
                    vectorEncodedFilterTags = await _surveyEmbeddingVectorService.GetVectorEncodedFilterTagsAsync(summarizedFilterTags);

                    // Lưu các thẻ lọc đã tóm tắt và mã hóa vector (nếu chưa tồn tại thì thêm , nếu đã tồn tại thì cập nhật)
                    foreach (var summarizedFilterTag in summarizedFilterTags)
                    {
                        var existingTakerTagFilter = account.TakerTagFilters.FirstOrDefault(t => t.FilterTagId == summarizedFilterTag.FilterTagId);
                        if (existingTakerTagFilter != null)
                        {
                            existingTakerTagFilter.Summary = summarizedFilterTag.Summary;
                            await _unitOfWork.TakerTagFilterRepository.UpdateAsync(existingTakerTagFilter);
                        }
                        else
                        {
                            var newTakerTagFilter = new TakerTagFilter
                            {
                                TakerId = userId,
                                FilterTagId = summarizedFilterTag.FilterTagId,
                                Summary = summarizedFilterTag.Summary,
                            };
                            await _takerTagFilterGenericRepository.CreateAsync(newTakerTagFilter);
                        }
                    }
                    foreach (var additionalFilterTag in additionalFilterTags)
                    {
                        var existingTakerTagFilter = account.TakerTagFilters.FirstOrDefault(t => t.FilterTagId == additionalFilterTag.Id);
                        if (existingTakerTagFilter == null)
                        {
                            var newTakerTagFilter = new TakerTagFilter
                            {
                                TakerId = userId,
                                FilterTagId = additionalFilterTag.Id,
                                Summary = null,
                            };
                            await _takerTagFilterGenericRepository.CreateAsync(newTakerTagFilter);
                        }
                    }



                    await transaction.CommitAsync();
                    // isValid = newSurveyTakenResult.IsValid;
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();

                    Console.WriteLine("\n" + ex.StackTrace + "\n");
                    throw new HttpRequestException("Ghi nhận kết quả thất bại, lí do: " + ex.Message);
                }
            }

            using (var transaction = await _postgresDbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    // Lưu các thẻ lọc đã tóm tắt và mã hóa vector vào cơ sở dữ liệu PostgreSQL (nếu chưa tồn tại thì thêm , nếu đã tồn tại thì cập nhật)
                    foreach (var vectorEncodedFilterTag in vectorEncodedFilterTags)
                    {
                        var existingTakerTagFilter = await _postgresDbContext.TakerEmbeddingVectorTagFilters
                            .FirstOrDefaultAsync(t => t.TakerId == userId && t.FilterTagId == vectorEncodedFilterTag.FilterTagId);
                        if (existingTakerTagFilter != null)
                        {
                            existingTakerTagFilter.EmbeddingVector = vectorEncodedFilterTag.EmbeddingVector == null || vectorEncodedFilterTag.EmbeddingVector.Count() == 0
                                ? null
                                : new Vector(vectorEncodedFilterTag.EmbeddingVector.ToArray());
                            _postgresDbContext.TakerEmbeddingVectorTagFilters.Update(existingTakerTagFilter);
                        }
                        else
                        {
                            var newTakerTagFilter = new TakerEmbeddingVectorTagFilter
                            {
                                TakerId = userId,
                                FilterTagId = vectorEncodedFilterTag.FilterTagId,
                                EmbeddingVector = vectorEncodedFilterTag.EmbeddingVector == null || vectorEncodedFilterTag.EmbeddingVector.Count() == 0
                                    ? null
                                    : new Vector(vectorEncodedFilterTag.EmbeddingVector.ToArray())
                            };
                            await _postgresDbContext.TakerEmbeddingVectorTagFilters.AddAsync(newTakerTagFilter);
                        }
                    }
                    foreach (var additionalFilterTag in additionalFilterTags)
                    {
                        var existingTakerTagFilter = await _postgresDbContext.TakerEmbeddingVectorTagFilters
                            .FirstOrDefaultAsync(t => t.TakerId == userId && t.FilterTagId == additionalFilterTag.Id);
                        if (existingTakerTagFilter == null)
                        {
                            var newTakerTagFilter = new TakerEmbeddingVectorTagFilter
                            {
                                TakerId = userId,
                                FilterTagId = additionalFilterTag.Id,
                                EmbeddingVector = null
                            };
                            await _postgresDbContext.TakerEmbeddingVectorTagFilters.AddAsync(newTakerTagFilter);
                        }
                    }

                    await _postgresDbContext.SaveChangesAsync();
                    await transaction.CommitAsync();
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    Console.WriteLine("\n" + ex.StackTrace + "\n");
                    throw new HttpRequestException("Ghi nhận kết quả thất bại, lí do: " + ex.Message);
                }
            }
            // return isValid;
        }


        public async Task<CommunitySurveyTakenResultResponseDTO> TakeCommunitySurveyResponse(int surveyId, int userId, SurveyResponseRequestDTO surveyResponseRequestDTO, SurveyTakenSubjectEnum TakenSubject)
        {
            var summarizedSurveyTakenResultFilterTags = new List<SummarizedFilterTagDTO>();
            var summarizedTakerAdditionalFilterTags = new List<SummarizedFilterTagDTO>();
            var vectorEncodedSurveyTakenResultFilterTags = new List<EmbeddingVectorFilterTagDTO>();
            var vectorEncodedTakerAdditionalFilterTags = new List<EmbeddingVectorFilterTagDTO>();
            int newSurveyTakenResultId = 0;
            var isValid = true;
            decimal moneyEarned = 0;
            int xpEarned = 0;

            bool isKpiExceeded = false;

            var systemConfigProfile = await _unitOfWork.SystemConfigProfileRepository.FindActiveProfileAsync();
            SurveyFilterObject surveyFilterObject = new SurveyFilterObject
            {
                IsDeletedContain = false,
                // IsInvalidTakenResultContain = false,
                // IsAvailable = true,
                SurveyTypeId = 2,
                SurveyStatusIds = new List<int> { 2, 3 }
            };
            Survey survey = await _unitOfWork.SurveyRepository.FindByIdAndFilterObjectAsync(surveyId, surveyFilterObject);
            var surveyTakenResults = await _unitOfWork.SurveyTakenResultRepository.FindBySurveyIdAsync(surveyId, false);

            var additionalFilterTags = (await _unitOfWork.FilterTagRepository.FindByTagTypeIdAsync(2)).ToList();

            using (var transaction = await _appDbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    if (survey == null)
                    {
                        throw new Exception("survey không tồn tại");
                    }
                    // [CHỈNH LẠI]  sau này sẽ mở ra nếu cầnhhhh
                    // if (survey.Kpi <= surveyTakenResults.Count())
                    // {
                    //     throw new Exception("survey đã đủ số lượng người làm");
                    // }
                    // if (survey.EndDate < DateOnly.FromDateTime(_dateHelpers.GetNowByAppTimeZone()))
                    // {
                    //     throw new Exception("survey đã kết thúc và ngừng tiếp nhận kết quả");
                    // }
                    if (survey.RequesterId == userId)
                    {
                        throw new Exception("không được phép làm survey của chính mình");
                    }
                    if (surveyTakenResults.Any(s => s.TakerId == userId))
                    {
                        throw new Exception("bạn đã làm survey này rồi");
                    }

                    var newSurveyTakenResult = new SurveyTakenResult
                    {
                        SurveyId = surveyId,
                        TakerId = userId,
                        IsValid = surveyResponseRequestDTO.SurveyResponses.Any(r => r.IsValid == false) ? false : true,
                        CompletedAt = _dateHelpers.GetNowByAppTimeZone(),
                        InvalidReason = surveyResponseRequestDTO.InvalidReason.IsNullOrEmpty() ? null : surveyResponseRequestDTO.InvalidReason,
                    };

                    // Lưu kết quả khảo sát
                    await _surveyTakenResultGenericRepository.CreateAsync(newSurveyTakenResult);
                    List<SurveyResponse> addedSurveyResponses = new List<SurveyResponse>();

                    foreach (var response in surveyResponseRequestDTO.SurveyResponses)
                    {
                        var jsonStringValue = JsonConvert.SerializeObject(response.ValueJson);

                        var newSurveyResponse = new SurveyResponse
                        {
                            SurveyTakenResultId = newSurveyTakenResult.Id,
                            IsValid = response.IsValid,
                            ValueJsonString = jsonStringValue,
                            SurveyQuestionId = response.ValueJson.QuestionContent.Id
                        };

                        // Lưu phản hồi câu hỏi
                        await _surveyResponseGenericRepository.CreateAsync(newSurveyResponse);
                        addedSurveyResponses.Add(newSurveyResponse);
                    }

                    survey = await _unitOfWork.SurveyRepository.FindByIdAndFilterObjectAsync(surveyId, surveyFilterObject);
                    var newSurveyTakenResults = await _unitOfWork.SurveyTakenResultRepository.FindBySurveyIdAsync(surveyId, false);

                    if (newSurveyTakenResults.Count() >= survey.Kpi || survey.EndDate < DateOnly.FromDateTime(_dateHelpers.GetNowByAppTimeZone()))
                    {

                        survey.IsAvailable = false;
                        await _surveyGenericRepository.UpdateAsync(survey.Id, survey);
                        var newSurveyStatusTracking = new SurveyStatusTracking
                        {
                            SurveyId = survey.Id,
                            SurveyStatusId = 3
                        };
                        await _surveyStatusTrackingGenericRepository.CreateAsync(newSurveyStatusTracking);

                        // Console.WriteLine("\n\n\n\nsurvey.SurveyTakenResults.Count(): " + survey.SurveyTakenResults.Count() + " - survey.Kpi: " + survey.Kpi);
                        // foreach (var takenResult in newSurveyTakenResults)
                        // {
                        //     Console.WriteLine("takenResult.Id: " + takenResult.Id);
                        // }


                        if (newSurveyTakenResults.Count() > survey.Kpi)
                        {

                            moneyEarned = 0;
                            xpEarned = (int)Math.Round((float)survey.MaxXp * _surveyConfig.KpiExceedXpEarnRate);
                            Console.WriteLine(survey.MaxXp + " " + _surveyConfig.KpiExceedXpEarnRate);
                            Console.WriteLine("moneyEarned: " + (int)Math.Round((float)survey.MaxXp * _surveyConfig.KpiExceedXpEarnRate));

                        }
                        else if (newSurveyTakenResults.Count() == survey.Kpi)
                        {
                            moneyEarned = survey.SurveyRewardTrackings.OrderByDescending(r => r.CreatedAt).FirstOrDefault().RewardPrice;
                            xpEarned = survey.SurveyRewardTrackings.OrderByDescending(r => r.CreatedAt).FirstOrDefault().RewardXp;
                        }

                    }
                    else
                    {
                        moneyEarned = survey.SurveyRewardTrackings.OrderByDescending(r => r.CreatedAt).FirstOrDefault().RewardPrice;
                        xpEarned = survey.SurveyRewardTrackings.OrderByDescending(r => r.CreatedAt).FirstOrDefault().RewardXp;
                    }

                    newSurveyTakenResult.MoneyEarned = moneyEarned;
                    newSurveyTakenResult.XpEarned = xpEarned;
                    await _surveyTakenResultGenericRepository.UpdateAsync(newSurveyTakenResult.Id, newSurveyTakenResult);


                    await transaction.CommitAsync();

                    // await transaction.CommitAsync();
                    newSurveyTakenResultId = newSurveyTakenResult.Id;
                    isValid = newSurveyTakenResult.IsValid;
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();

                    Console.WriteLine("\n" + ex.StackTrace + "\n");
                    throw new HttpRequestException("Ghi nhận kết quả thất bại, lí do: " + ex.Message);
                }
            }

            using (var transaction = await _appDbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    Account account = await _unitOfWork.AccountRepository.FindByIdAsync(userId);
                    if (isValid == true)
                    {
                        await this.TrackingOnline(account.Id);
                        decimal levelBonusRate = (decimal)systemConfigProfile.AccountLevelSettingConfigs.Where(c => c.Level == account.Level).Select(c => c.BonusRate).FirstOrDefault();
                        account.Balance += moneyEarned * (decimal)survey.AllocLevelAmount * levelBonusRate;
                        account.Xp += xpEarned;
                        await _accountGenericRepository.UpdateAsync(userId, account);
                        var newPaymentHistory = new PaymentHistory
                        {
                            AccountId = userId,
                            Amount = moneyEarned * (decimal)survey.AllocLevelAmount * levelBonusRate,
                            PaymentStatusId = 2,
                            PaymentTypeId = 2, 
                        };
                        await _paymentHistoryGenericRepository.CreateAsync(newPaymentHistory);
                    }



                    // lấy communitySurveyTakenResult để đưa vào 
                    var communitySurveyResponseObjects = new List<SurveyResponseValueJsonDTO>();
                    foreach (var response in surveyResponseRequestDTO.SurveyResponses)
                    {
                        communitySurveyResponseObjects.Add(response.ValueJson);
                    }
                    var communitySurveyResponses = JArray.FromObject(communitySurveyResponseObjects);

                    summarizedSurveyTakenResultFilterTags = await _openAI4oMiniService.GetSummarizedAddtionalFilterTagBySurveyTakenResponsesAsync(additionalFilterTags, communitySurveyResponses);
                    vectorEncodedSurveyTakenResultFilterTags = await _surveyEmbeddingVectorService.GetVectorEncodedFilterTagsAsync(summarizedSurveyTakenResultFilterTags);

                    // Lưu các thẻ lọc đã tóm tắt và mã hóa vector 
                    foreach (var summarizedFilterTag in summarizedSurveyTakenResultFilterTags)
                    {
                        var newSurveyTakenResultTagFilter = new SurveyTakenResultTagFilter
                        {
                            SurveyTakenResultId = newSurveyTakenResultId,
                            AdditionalFilterTagId = summarizedFilterTag.FilterTagId,
                            Summary = summarizedFilterTag.Summary,
                        };
                        await _surveyTakenResultTagFilterGenericRepository.CreateAsync(newSurveyTakenResultTagFilter);
                    }

                    // lấy các danh sách SurveyTakenResultTagFilters thuộc limit 20 lần taken gần nhất bao gồm cả lần hiện tại 
                    var recentSurveyTakenResults = await _unitOfWork.SurveyTakenResultRepository.FindByTakerIdAsync(userId, _surveyConfig.RecentTakenThreshold);
                    List<List<SurveyTakenResultTagFilter>> recentSurveyTakenResultTagFilters = recentSurveyTakenResults.Select(s =>
                    {
                        return s.SurveyTakenResultTagFilters.Select(t => new SurveyTakenResultTagFilter
                        {
                            AdditionalFilterTagId = t.AdditionalFilterTagId,
                            Summary = t.Summary
                        }).ToList();
                    }).ToList();
                    List<TakerTagFilter> recentTakerAdditionalFilterTags = account.TakerTagFilters
                        .Where(t => t.FilterTag.FilterTagTypeId == 2)
                        .Select(t => new TakerTagFilter
                        {
                            FilterTagId = t.FilterTagId,
                            Summary = t.Summary
                        })
                        .ToList();



                    summarizedTakerAdditionalFilterTags = await _openAI4oMiniService.GetMergedAdditionalFilterTagSummariesAsync(
                        additionalFilterTags,
                        recentSurveyTakenResultTagFilters,
                        recentTakerAdditionalFilterTags);
                    vectorEncodedTakerAdditionalFilterTags = await _surveyEmbeddingVectorService.GetVectorEncodedFilterTagsAsync(
                        summarizedTakerAdditionalFilterTags);



                    // Lưu các summarizedTakerAdditionalFilterTags mới vào TakerTagFilter theo id tương ứng (nếu chưa tồn tại thì thêm , nếu đã tồn tại thì cập nhật)
                    foreach (var summarizedFilterTag in summarizedTakerAdditionalFilterTags)
                    {
                        var existingTakerTagFilter = account.TakerTagFilters.FirstOrDefault(t => t.FilterTagId == summarizedFilterTag.FilterTagId);
                        if (existingTakerTagFilter != null)
                        {
                            existingTakerTagFilter.Summary = summarizedFilterTag.Summary;
                            await _unitOfWork.TakerTagFilterRepository.UpdateAsync(existingTakerTagFilter);
                        }
                        else
                        {
                            var newTakerTagFilter = new TakerTagFilter
                            {
                                TakerId = userId,
                                FilterTagId = summarizedFilterTag.FilterTagId,
                                Summary = summarizedFilterTag.Summary,
                            };
                            await _takerTagFilterGenericRepository.CreateAsync(newTakerTagFilter);
                        }
                    }
                    await transaction.CommitAsync();
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    Console.WriteLine("\n" + ex.StackTrace + "\n");
                    throw new HttpRequestException("Ghi nhận kết quả thành công, lỗi filter tag: " + ex.Message);
                }
            }

            using (var transaction = await _postgresDbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    // Lưu các thẻ lọc đã tóm tắt và mã hóa vector vào cơ sở dữ liệu PostgreSQL 
                    foreach (var vectorEncodedFilterTag in vectorEncodedSurveyTakenResultFilterTags)
                    {
                        var newSurveyEmbeddingVectorTagFilter = new SurveyEmbeddingVectorTakenResultTagFilter
                        {
                            SurveyTakenResultId = newSurveyTakenResultId,
                            AdditionalFilterTagId = vectorEncodedFilterTag.FilterTagId,
                            EmbeddingVector = vectorEncodedFilterTag.EmbeddingVector == null || vectorEncodedFilterTag.EmbeddingVector.Count() == 0
                                ? null
                                : new Vector(vectorEncodedFilterTag.EmbeddingVector.ToArray())
                        };
                        await _postgresDbContext.SurveyEmbeddingVectorTakenResultTagFilters.AddAsync(newSurveyEmbeddingVectorTagFilter);
                    }

                    foreach (var vectorEncodedFilterTag in vectorEncodedTakerAdditionalFilterTags)
                    {
                        var existingTakerTagFilter = await _postgresDbContext.TakerEmbeddingVectorTagFilters
                            .FirstOrDefaultAsync(t => t.TakerId == userId && t.FilterTagId == vectorEncodedFilterTag.FilterTagId);
                        if (existingTakerTagFilter != null)
                        {
                            existingTakerTagFilter.EmbeddingVector = vectorEncodedFilterTag.EmbeddingVector == null || vectorEncodedFilterTag.EmbeddingVector.Count() == 0
                                ? null
                                : new Vector(vectorEncodedFilterTag.EmbeddingVector.ToArray());
                            _postgresDbContext.TakerEmbeddingVectorTagFilters.Update(existingTakerTagFilter);
                        }
                        else
                        {
                            var newTakerTagFilter = new TakerEmbeddingVectorTagFilter
                            {
                                TakerId = userId,
                                FilterTagId = vectorEncodedFilterTag.FilterTagId,
                                EmbeddingVector = vectorEncodedFilterTag.EmbeddingVector == null || vectorEncodedFilterTag.EmbeddingVector.Count() == 0
                                    ? null
                                    : new Vector(vectorEncodedFilterTag.EmbeddingVector.ToArray())
                            };
                            await _postgresDbContext.TakerEmbeddingVectorTagFilters.AddAsync(newTakerTagFilter);
                        }
                    }

                    await _postgresDbContext.SaveChangesAsync();
                    await transaction.CommitAsync();
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    Console.WriteLine("\n" + ex.StackTrace + "\n");
                    throw new HttpRequestException("Ghi nhận kết quả thành công, lỗi filter tag: " + ex.Message);
                }
            }

            return new CommunitySurveyTakenResultResponseDTO
            {
                IsValid = isValid,
                MoneyEarned = moneyEarned,
                XpEarned = xpEarned,
            };
        }






        // public async Task<Account> GetExistAccount(int id)
        // {
        //     return await _appDbContext.Accounts.Include(account => account.Role)
        //         .Include(account => account.JobType)
        //         .FirstOrDefaultAsync(account => account.Id == id);
        // }

        // ///////////////////////////////////////////////////////////

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
