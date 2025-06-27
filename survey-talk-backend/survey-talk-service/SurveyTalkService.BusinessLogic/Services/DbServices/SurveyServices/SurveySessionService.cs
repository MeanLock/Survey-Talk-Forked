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

namespace SurveyTalkService.BusinessLogic.Services.DbServices.SurveyServices
{
    public class SurveySessionService
    {
        // LOGGER
        private readonly ILogger<SurveySessionService> _logger;

        // CONFIG
        public readonly IAppConfig _appConfig;
        private readonly IFilePathConfig _filePathConfig;

        // DB CONTEXT
        private readonly AppDbContext _appDbContext;

        // HELPERS
        private readonly BcryptHelpers _bcryptHelpers;
        private readonly JwtHelpers _jwtHelpers;
        private readonly FileHelpers _fileHelpers;
        private readonly ImageHelpers _imageHelpers;
        private readonly DateHelpers _dateHelpers;


        // UNIT OF WORK
        private readonly IUnitOfWork _unitOfWork;

        // REPOSITORIES
        private readonly IGenericRepository<SurveyQuestion> _surveyQuestionGenericRepository;
        private readonly IGenericRepository<SurveyOption> _surveyOptionGenericRepository;

        // AWS SERVICE
        private readonly AWSS3Service _awsS3Service;

        public SurveySessionService(
            ILogger<SurveySessionService> logger,
            AppDbContext appDbContext,
            BcryptHelpers bcryptHelpers,
            JwtHelpers jwtHelpers,
            DateHelpers dateHelpers,
            IUnitOfWork unitOfWork,

            IGenericRepository<SurveyQuestion> surveyQuestionGenericRepository,
            IGenericRepository<SurveyOption> surveyOptionGenericRepository,

            FileHelpers fileHelpers,
            ImageHelpers imageHelpers,
            IFilePathConfig filePathConfig,
            AWSS3Service awsS3Service,
            IAppConfig appConfig
            )
        {
            _logger = logger;
            _appDbContext = appDbContext;
            _bcryptHelpers = bcryptHelpers;
            _jwtHelpers = jwtHelpers;
            _dateHelpers = dateHelpers;
            _unitOfWork = unitOfWork;

            _surveyQuestionGenericRepository = surveyQuestionGenericRepository;
            _surveyOptionGenericRepository = surveyOptionGenericRepository;

            _fileHelpers = fileHelpers;
            _imageHelpers = imageHelpers;
            _filePathConfig = filePathConfig;


            _awsS3Service = awsS3Service;
            _appConfig = appConfig;
        }
        public int RandomNumber10To15()
        {
            var rnd = new Random();
            return rnd.Next(10, 16); // 16 là exclusive, nên sẽ random từ 10 đến 15
        }

        public async Task<SurveyEditingSessionDTO> GenerateSurveyEditingSessionDTO(Survey survey, int? version)
        {
            try
            {
                if (survey == null)
                {
                    throw new Exception("survey is null");
                }
                Console.WriteLine("GenerateSurveyEditingSessionDTO for survey id: " + survey.SurveyStatusTrackings.OrderByDescending(sst => sst.CreatedAt).FirstOrDefault()?.SurveyId + " and version: " + version);
                SurveyEditingSessionDTO surveyEditingSessionDTO = new SurveyEditingSessionDTO
                {
                    Id = survey.Id,
                    RequesterId = survey.RequesterId,
                    Title = survey.Title,
                    Description = survey.Description,
                    SurveyTypeId = survey.SurveyTypeId,
                    SurveyTopicId = survey.SurveyTopicId ?? 0,
                    SurveySpecificTopicId = survey.SurveySpecificTopicId ?? 0,
                    MainImageBase64 = await _imageHelpers.GenerateImageBase64(_filePathConfig.SURVEY_ORIGINAL_IMAGE_PATH, survey.Id.ToString(), "main"),
                    BackgroundImageBase64 = await _imageHelpers.GenerateImageBase64(_filePathConfig.SURVEY_ORIGINAL_IMAGE_PATH, survey.Id.ToString(), "background"),
                    SurveyStatusId = (await _unitOfWork.SurveyRepository.GetLatestSurveyStatusTrackingBySurveyIdAsync(survey.Id)).SurveyStatusId,
                    Version = survey.SurveyTypeId == 3 ? version : null,
                    MarketSurveyVersionStatusId = survey.SurveyMarketVersionStatusTrackings.OrderByDescending(smt => smt.CreatedAt).FirstOrDefault()?.SurveyStatusId,
                    SecurityModeId = survey.SecurityModeId,
                    ConfigJson = JObject.Parse(survey.ConfigJsonString).ToObject<SurveyEditingSessionSurveyConfigJsonDTO>(),
                    Questions = (await Task.WhenAll(survey.SurveyQuestions.Select(async sq =>
                    {
                        try
                        {
                            return new SurveyEditingSessionQuestionDTO
                            {
                                Id = sq.Id,
                                QuestionTypeId = sq.QuestionTypeId,
                                MainImageBase64 = await _imageHelpers.GenerateImageBase64(_filePathConfig.SURVEY_ORIGINAL_IMAGE_PATH, survey.Id.ToString() + "/question_" + sq.Id, "main"),
                                Version = sq.Version,
                                IsReanswerRequired = sq.IsReanswerRequired,
                                ReferenceSurveyQuestionId = sq.ReferenceSurveyQuestionId,
                                Content = sq.Content,
                                Description = sq.Description,
                                TimeLimit = survey.SecurityModeId == 1 ? null : sq.TimeLimit,
                                IsVoiced = sq.IsVoiced,
                                Order = sq.Order,
                                ConfigJson = JObject.Parse(sq.ConfigJsonString).ToObject<SurveyEditingSessionQuestionConfigJsonDTO>(),
                                Options = (await Task.WhenAll(sq.SurveyOptions.Select(async so => new SurveyEditingSessionOptionDTO
                                {
                                    Id = so.Id,
                                    Content = so.Content,
                                    Order = so.Order,
                                    MainImageBase64 = await _imageHelpers.GenerateImageBase64(_filePathConfig.SURVEY_ORIGINAL_IMAGE_PATH, survey.Id.ToString() + "/question_" + sq.Id + "/option_" + so.Id, "main"),

                                }))).ToList()
                            };
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine("\n" + ex.Message + "\n");
                            Console.WriteLine("\n" + ex.StackTrace + "\n");
                            throw new HttpRequestException("Lỗi tạo phiên edititng survey, lỗi: " + ex.Message);
                        }
                    }
                    ))).ToList()

                };

                return surveyEditingSessionDTO;
            }
            catch (Exception ex)
            {
                Console.WriteLine("\n" + ex.Message + "\n");
                Console.WriteLine("\n" + ex.StackTrace + "\n");
                throw new HttpRequestException("Lỗi tạo phiên edititng survey");
            }
        }

        public async Task UpdateSurveyByEditingSession(SurveyEditingSessionDTO surveyEditingSessionDTO)
        {
            try
            {
                // 1. Lấy survey từ DB
                SurveyFilterObject surveyFilterObject = new SurveyFilterObject { };
                var survey = await _unitOfWork.SurveyRepository.FindByIdAndFilterObjectAsync(surveyEditingSessionDTO.Id, surveyFilterObject);
                if (survey == null)
                    throw new Exception($"Survey {surveyEditingSessionDTO.Id} không tồn tại");

                // 2. Cập nhật các field scalar [field cập nhật]
                survey.Title = surveyEditingSessionDTO.Title ?? survey.Title;
                survey.Description = surveyEditingSessionDTO.Description ?? survey.Description;
                survey.SurveyTopicId = surveyEditingSessionDTO.SurveyTopicId;
                survey.SurveySpecificTopicId = surveyEditingSessionDTO.SurveySpecificTopicId;
                survey.SecurityModeId = surveyEditingSessionDTO.SecurityModeId;

                // 3. Cập nhật ảnh chính và background
                if (surveyEditingSessionDTO.MainImageBase64 != null)
                {
                    await _imageHelpers.SaveBase64File(surveyEditingSessionDTO.MainImageBase64, $"{_filePathConfig.SURVEY_ORIGINAL_IMAGE_PATH}\\{survey.Id}", "main");
                }
                else
                {
                    await _imageHelpers.DeleteFile($"{_filePathConfig.SURVEY_ORIGINAL_IMAGE_PATH}\\{survey.Id}", "main");
                }
                if (surveyEditingSessionDTO.BackgroundImageBase64 != null)
                {
                    await _imageHelpers.SaveBase64File(surveyEditingSessionDTO.BackgroundImageBase64, $"{_filePathConfig.SURVEY_ORIGINAL_IMAGE_PATH}\\{survey.Id}", "background");
                }
                else
                {
                    await _imageHelpers.DeleteFile($"{_filePathConfig.SURVEY_ORIGINAL_IMAGE_PATH}\\{survey.Id}", "background");
                }

                // 4. Cập nhật ConfigJsonString
                if (surveyEditingSessionDTO.ConfigJson != null)
                {
                    survey.ConfigJsonString = JsonConvert.SerializeObject(surveyEditingSessionDTO.ConfigJson);
                }

                // 5. Xử lý các question
                var dtoQuestionIds = surveyEditingSessionDTO.Questions?.Select(q => q.Id).ToHashSet() ?? new HashSet<int>();
                var dbQuestions = survey.SurveyQuestions.ToList();
                // Xóa question không còn trong DTO
                foreach (var dbQ in dbQuestions)
                {
                    if (!dtoQuestionIds.Contains(dbQ.Id))
                    {
                        // Xóa file ảnh question
                        await _imageHelpers.DeleteFolder($"{_filePathConfig.SURVEY_ORIGINAL_IMAGE_PATH}\\{survey.Id}\\question_{dbQ.Id}");
                        _appDbContext.SurveyQuestions.Remove(dbQ);
                    }
                }
                // Cập nhật hoặc thêm mới question
                foreach (var dtoQ in surveyEditingSessionDTO.Questions ?? new List<SurveyEditingSessionQuestionDTO>())
                {
                    var dbQ = dbQuestions.FirstOrDefault(q => q.Id == dtoQ.Id);
                    if (dbQ == null) // [CHỈNH LẠI] sau sẽ có id mới 
                    {
                        // Thêm mới question
                        var newQ = new SurveyQuestion
                        {
                            SurveyId = survey.Id,

                            QuestionTypeId = dtoQ.QuestionTypeId,
                            IsReanswerRequired = dtoQ.IsReanswerRequired,
                            ReferenceSurveyQuestionId = dtoQ.ReferenceSurveyQuestionId,
                            Content = dtoQ.Content,
                            Description = dtoQ.Description,
                            TimeLimit = dtoQ.TimeLimit == null ? RandomNumber10To15() : dtoQ.TimeLimit.Value,
                            IsVoiced = dtoQ.IsVoiced,
                            Order = (byte)dtoQ.Order,
                            Version = dtoQ.Version.HasValue ? (byte?)dtoQ.Version.Value : null,
                            ConfigJsonString = dtoQ.ConfigJson != null ? Newtonsoft.Json.JsonConvert.SerializeObject(dtoQ.ConfigJson) : null,
                            // SurveyOptions = new List<SurveyOption>()
                        };
                        await _surveyQuestionGenericRepository.CreateAsync(newQ);
                        // Lưu ảnh question nếu có
                        if (dtoQ.MainImageBase64 != null)
                        {
                            await _imageHelpers.SaveBase64File(dtoQ.MainImageBase64, $"{_filePathConfig.SURVEY_ORIGINAL_IMAGE_PATH}\\{survey.Id}\\question_{newQ.Id}", "main");
                        }
                        // Thêm mới option cho question mới
                        foreach (var dtoO in dtoQ.Options ?? new List<SurveyEditingSessionOptionDTO>())
                        {
                            if (dtoO.Id == null) // [CHỈNH LẠI] sau sẽ có id mới
                            {
                                var newO = new SurveyOption
                                {
                                    SurveyQuestionId = newQ.Id,
                                    Content = dtoO.Content,
                                    Order = (byte)dtoO.Order
                                };
                                await _surveyOptionGenericRepository.CreateAsync(newO);
                                // Lưu ảnh option nếu có
                                if (dtoO.MainImageBase64 != null)
                                {
                                    await _imageHelpers.SaveBase64File(dtoO.MainImageBase64, $"{_filePathConfig.SURVEY_ORIGINAL_IMAGE_PATH}\\{survey.Id}\\question_{newQ.Id}\\option_{newO.Id}", "main");
                                }
                            }
                        }
                        continue;
                    }
                    dbQ.QuestionTypeId = dtoQ.QuestionTypeId;
                    dbQ.IsReanswerRequired = dtoQ.IsReanswerRequired;
                    dbQ.ReferenceSurveyQuestionId = dtoQ.ReferenceSurveyQuestionId;
                    dbQ.Content = dtoQ.Content;
                    dbQ.Description = dtoQ.Description;
                    dbQ.TimeLimit = dtoQ.TimeLimit == null ? RandomNumber10To15() : dtoQ.TimeLimit.Value;
                    dbQ.IsVoiced = dtoQ.IsVoiced;
                    dbQ.Order = (byte)dtoQ.Order;
                    if (dtoQ.ConfigJson != null)
                        dbQ.ConfigJsonString = JsonConvert.SerializeObject(dtoQ.ConfigJson);
                    // Xử lý ảnh question
                    if (dtoQ.MainImageBase64 != null)
                    {
                        await _imageHelpers.SaveBase64File(dtoQ.MainImageBase64, $"{_filePathConfig.SURVEY_ORIGINAL_IMAGE_PATH}\\{survey.Id}\\question_{dbQ.Id}", "main");
                    }
                    else
                    {
                        await _imageHelpers.DeleteFile($"{_filePathConfig.SURVEY_ORIGINAL_IMAGE_PATH}\\{survey.Id}\\question_{dbQ.Id}", "main");
                    }
                    // Xử lý option
                    var dtoOptionIds = dtoQ.Options?.Select(o => o.Id).ToHashSet() ?? new HashSet<int>();
                    var dbOptions = dbQ.SurveyOptions.ToList();
                    // Xóa option không còn trong DTO
                    foreach (var dbO in dbOptions)
                    {
                        if (!dtoOptionIds.Contains(dbO.Id))
                        {
                            await _imageHelpers.DeleteFolder($"{_filePathConfig.SURVEY_ORIGINAL_IMAGE_PATH}\\{survey.Id}\\question_{dbQ.Id}\\option_{dbO.Id}");
                            _appDbContext.SurveyOptions.Remove(dbO);
                        }
                    }
                    // Cập nhật hoặc thêm mới option
                    foreach (var dtoO in dtoQ.Options ?? new List<SurveyEditingSessionOptionDTO>())
                    {
                        var dbO = dbOptions.FirstOrDefault(o => o.Id == dtoO.Id);
                        if (dbO == null)
                        {
                            // Thêm mới option nếu cần
                            var newO = new SurveyOption
                            {
                                SurveyQuestionId = dbQ.Id,
                                Content = dtoO.Content,
                                Order = (byte)dtoO.Order
                            };
                            await _surveyOptionGenericRepository.CreateAsync(newO);
                            // Lưu ảnh option nếu có
                            if (dtoO.MainImageBase64 != null)
                            {
                                await _imageHelpers.SaveBase64File(dtoO.MainImageBase64, $"{_filePathConfig.SURVEY_ORIGINAL_IMAGE_PATH}\\{survey.Id}\\question_{dbQ.Id}\\option_{newO.Id}", "main");
                            }
                            continue;
                        }
                        dbO.Content = dtoO.Content;
                        dbO.Order = (byte)dtoO.Order;
                        if (dtoO.MainImageBase64 != null)
                        {
                            await _imageHelpers.SaveBase64File(dtoO.MainImageBase64, $"{_filePathConfig.SURVEY_ORIGINAL_IMAGE_PATH}\\{survey.Id}\\question_{dbQ.Id}\\option_{dbO.Id}", "main");
                        }
                        else
                        {
                            await _imageHelpers.DeleteFile($"{_filePathConfig.SURVEY_ORIGINAL_IMAGE_PATH}\\{survey.Id}\\question_{dbQ.Id}\\option_{dbO.Id}", "main");
                        }
                    }
                }
                await _appDbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine("\n" + ex.Message + "\n");
                Console.WriteLine("\n" + ex.StackTrace + "\n");
                throw new HttpRequestException("Lỗi cập nhật phiên chỉnh sửa survey, lỗi: " + ex.Message);
            }
        }


        public async Task<SurveyTakingSessionDTO> GenerateSurveyTakingSessionDTO(Survey survey, int? version)
        {
            if (survey == null)
                throw new Exception("survey is null");
            SurveyConfigJsonDTO surveyConfigJson = (JObject.Parse(survey.ConfigJsonString)).ToObject<SurveyConfigJsonDTO>();
            string backgroundImageUrl = "";
            if (surveyConfigJson.IsUseBackgroundImageBase64 == true)
            {
                backgroundImageUrl = await _imageHelpers.GenerateImageUrl(_filePathConfig.SURVEY_ORIGINAL_IMAGE_PATH, survey.Id.ToString(), "background");
            }
            else
            {
                backgroundImageUrl = await _imageHelpers.GenerateImageUrl(_filePathConfig.SURVEY_DEFAULT_BACKGROUND_IMAGE_PATH, surveyConfigJson.DefaultBackgroundImageId.ToString(), "main");
            }
            var dto = new SurveyTakingSessionDTO
            {
                Id = survey.Id,
                RequesterId = survey.RequesterId,
                Title = survey.Title,
                Description = survey.Description,
                SurveyTypeId = survey.SurveyTypeId,
                SurveyTopicId = survey.SurveyTopicId ?? 0,
                SurveySpecificTopicId = survey.SurveySpecificTopicId ?? 0,
                MainImageUrl = await _imageHelpers.GenerateImageUrl(_filePathConfig.SURVEY_ORIGINAL_IMAGE_PATH, survey.Id.ToString(), "main"),
                BackgroundImageUrl = backgroundImageUrl,
                SurveyStatusId = survey.SurveyStatusTrackings.OrderByDescending(sst => sst.CreatedAt).FirstOrDefault()?.SurveyStatusId ?? 0,
                Version = survey.SurveyTypeId == 3 ? version : null,
                MarketSurveyVersionStatusId = survey.SurveyMarketVersionStatusTrackings.OrderByDescending(smt => smt.CreatedAt).FirstOrDefault()?.SurveyStatusId ?? 0,
                SecurityModeId = survey.SecurityModeId,
                ConfigJson = JsonConvert.DeserializeObject<SurveyTakingSessionConfigJsonDTO>(survey.ConfigJsonString),
                Questions = (await Task.WhenAll(survey.SurveyQuestions.Select(async sq => new SurveyTakingSessionQuestionDTO
                {
                    Id = sq.Id,
                    QuestionTypeId = sq.QuestionTypeId,
                    Version = sq.Version,
                    MainImageUrl = await _imageHelpers.GenerateImageUrl(_filePathConfig.SURVEY_ORIGINAL_IMAGE_PATH, $"{survey.Id}/question_{sq.Id}", "main"),
                    Content = sq.Content,
                    Description = sq.Description,
                    TimeLimit = sq.TimeLimit,
                    IsVoiced = sq.IsVoiced,
                    Order = sq.Order,
                    ConfigJson = JsonConvert.DeserializeObject<SurveyTakingSessionQuestionConfigJsonDTO>(sq.ConfigJsonString),
                    Options = (await Task.WhenAll(sq.SurveyOptions.Select(async so => new SurveyTakingSessionOptionDTO
                    {
                        Id = so.Id,
                        Content = so.Content,
                        Order = so.Order,
                        MainImageUrl = await _imageHelpers.GenerateImageUrl(_filePathConfig.SURVEY_ORIGINAL_IMAGE_PATH, $"{survey.Id}/question_{sq.Id}/option_{so.Id}", "main")
                    }))).ToList()
                }))).ToList()
            };

            return dto;
        }

        /////////////////////////////////////////////////////////////

        public async Task<SurveyEditingSessionDTO> GetSurveyEditingSession(int surveyId, int userId, int? Version = null)
        {
            try
            {

                SurveyFilterObject surveyFilterObject = new SurveyFilterObject { };

                // Survey survey = await _unitOfWork.SurveyRepository.FindByIdAndFilterObjectAsync(surveyId, surveyFilterObject);
                Survey survey = await _unitOfWork.SurveyRepository.FindByIdAsync(surveyId);
                if (survey == null)
                {
                    throw new Exception("survey không tồn tại");
                }
                else if (survey.SurveyTypeId == 3 && Version == null)
                {
                    throw new Exception("phiên bản survey không được để trống");
                }
                else if (survey.SurveyTypeId == 3 && Version != null && survey.SurveyMarkets.Where(sm => sm.Version == Version).ToList().Count == 0)
                {
                    throw new Exception("không tìm thấy survey theo điều kiện và có id " + surveyId.ToString() + " và version " + Version.Value.ToString());
                }


                Account account = await _unitOfWork.AccountRepository.FindByIdAsync(userId);
                if ((account.RoleId == 2 || account.RoleId == 3) && survey.SurveyTypeId == 1)
                {
                    surveyFilterObject = new SurveyFilterObject
                    {
                        IsDeletedContain = false,
                        // IsInvalidTakenResultContain = false,
                        SurveyTypeId = 1,
                        SurveyStatusIds = new List<int> { 1 }
                    };
                    survey = await _unitOfWork.SurveyRepository.FindByIdAndFilterObjectAsync(surveyId, surveyFilterObject);
                    if (survey == null)
                    {
                        throw new Exception("không được phép chỉnh sửa survey ở thời điểm hiện tại");
                    }
                }
                else if (account.RoleId == 4 && survey.SurveyTypeId == 2)
                {
                    surveyFilterObject = new SurveyFilterObject
                    {
                        RequesterId = userId,
                        IsDeletedContain = false,
                        // IsInvalidTakenResultContain = false,
                        SurveyTypeId = 2,
                        SurveyStatusIds = new List<int> { 1, 2 }
                    };
                    survey = await _unitOfWork.SurveyRepository.FindByIdAndFilterObjectAsync(surveyId, surveyFilterObject);
                    if (survey == null)
                    {
                        throw new Exception("không được phép chỉnh sửa survey ở thời điểm hiện tại");
                    }
                }
                else if ((account.RoleId == 2 || account.RoleId == 3) && survey.SurveyTypeId == 3)
                {
                    surveyFilterObject = new SurveyFilterObject
                    {
                        IsDeletedContain = false,
                        // IsInvalidTakenResultContain = false,
                        SurveyTypeId = 3,
                        SurveyStatusIds = new List<int> { 2 },
                        Version = Version,
                        SurveyMarketVersionStatusIds = new List<int> { 1 }
                    };
                    survey = await _unitOfWork.SurveyRepository.FindByIdAndFilterObjectAsync(surveyId, surveyFilterObject);
                    if (survey == null)
                    {
                        Console.WriteLine("không tìm thấy survey theo điều kiện và có id " + surveyId.ToString() + " và version " + Version.Value.ToString());
                        throw new Exception("không được phép chỉnh sửa survey ở thời điểm hiện tại, survey id " + surveyId.ToString() + " và version " + Version.Value.ToString());
                    }
                }
                else
                {
                    throw new Exception("không xác định");
                }

                // Console.WriteLine("\n\n\n\n\n\n okokokokokokokokokokokokokokokok \n\n\n\n\n\n");

                return await GenerateSurveyEditingSessionDTO(survey, Version);
            }
            catch (Exception ex)
            {
                Console.WriteLine("\n" + ex.StackTrace + "\n");
                throw new HttpRequestException("Lỗi tạo phiên edititng survey, lỗi: " + ex.Message);
            }

        }


        public async Task<SurveySessionUpdateTriggerResponseDTO> UpdateSurveyEditingSessionAutoTrigger(int surveyId, SurveyEditingSessionDTO surveyEditingSessionDTO, int userId)
        {
            
            if (surveyEditingSessionDTO == null)
            {
                throw new ForbiddenException("không tìm thất phiên chỉnh sửa tự động");
            }else if (surveyEditingSessionDTO.Id != surveyId)
            {
                Console.WriteLine("id phiên chỉnh sửa không khớp, survey id: " + surveyId.ToString() + " và phiên chỉnh sửa id: " + surveyEditingSessionDTO.Id.ToString());
                throw new ForbiddenException("id phiên chỉnh sửa không khớp");
            }

            SurveyFilterObject surveyFilterObject = new SurveyFilterObject { };

            Survey survey = await _unitOfWork.SurveyRepository.FindByIdAndFilterObjectAsync(surveyEditingSessionDTO.Id, surveyFilterObject);
            if (survey == null)
            {
                // return new SurveySessionUpdateTriggerResponseDTO("survey không tồn tại", false);
                throw new ForbiddenException("survey không tồn tại");
            }
            var currentSurveyStatus = await _unitOfWork.SurveyRepository.GetLatestSurveyStatusTrackingBySurveyIdAsync(survey.Id);
            if (currentSurveyStatus == null)
            {
                // return new SurveySessionUpdateTriggerResponseDTO("không tìm thấy trạng thái survey", false);
                throw new ForbiddenException("không tìm thấy trạng thái survey");
            }


            Account account = await _unitOfWork.AccountRepository.FindByIdAsync(userId);

            // kiểm tra survey type
            if (surveyEditingSessionDTO.SurveyTypeId != survey.SurveyTypeId)
            {
                throw new ForbiddenException("loại survey không khớp");
            }


            // kiêm tra quyền
            if (surveyEditingSessionDTO.SurveyTypeId == 1 && account.RoleId != 2 && account.RoleId != 3)
            {
                throw new ForbiddenException("không có quyền chỉnh sửa survey này");
            }
            else if (surveyEditingSessionDTO.SurveyTypeId == 2 && account.RoleId != 4)
            {
                throw new ForbiddenException("không có quyền chỉnh sửa survey này");
            }
            else if (surveyEditingSessionDTO.SurveyTypeId == 3 && account.RoleId != 2 && account.RoleId != 3)
            {
                throw new ForbiddenException("không có quyền chỉnh sửa survey này");
            }




            if (surveyEditingSessionDTO.SurveyTypeId == 1 && survey.SurveyTypeId == 1)
            {
                // kiểm tra survey status
                if (currentSurveyStatus?.SurveyStatusId != 1)
                {
                    throw new ForbiddenException("không được phép chỉnh sửa survey ở thời điểm hiện tại");
                }

                try
                {
                    await UpdateSurveyByEditingSession(surveyEditingSessionDTO);
                }
                catch (Exception ex)
                {
                    Console.WriteLine("\n" + ex.Message + "\n");
                    Console.WriteLine("\n" + ex.StackTrace + "\n");
                    return new SurveySessionUpdateTriggerResponseDTO
                    {
                        Message = "Cập nhật phiên chỉnh sửa thất bại, lỗi: " + ex.Message,
                        IsSuccess = false
                    }; ;
                }

            }
            else if (surveyEditingSessionDTO.SurveyTypeId == 2 && survey.SurveyTypeId == 2)
            {
                // kiểm tra requester id
                if (survey.RequesterId != userId || surveyEditingSessionDTO.RequesterId != userId || surveyEditingSessionDTO.RequesterId != survey.RequesterId)
                {
                    throw new ForbiddenException("truy cập không hợp lệ");
                }

                // kiểm tra survey status (có trường hợp editing và đã publish)
                if (currentSurveyStatus.SurveyStatusId != 1 && currentSurveyStatus.SurveyStatusId != 2)
                {
                    throw new ForbiddenException("không được phép chỉnh sửa survey ở thời điểm hiện tại");
                }

                if (currentSurveyStatus.SurveyStatusId == 2 && surveyEditingSessionDTO.Questions.Where(q => q.Id == null).ToList().Count > 0)  //[CHỈNH LẠI] sau này sẽ kiểm tra ID question có tồn tại hay không
                {
                    return new SurveySessionUpdateTriggerResponseDTO
                    {
                        Message = "không được phép thêm câu hỏi mới vào survey đã đăng",
                        IsSuccess = false
                    };
                }

                try
                {
                    await UpdateSurveyByEditingSession(surveyEditingSessionDTO);
                }
                catch (Exception ex)
                {
                    Console.WriteLine("\n" + ex.Message + "\n");
                    Console.WriteLine("\n" + ex.StackTrace + "\n");
                    return new SurveySessionUpdateTriggerResponseDTO
                    {
                        Message = "Cập nhật phiên chỉnh sửa thất bại, lỗi: " + ex.Message,
                        IsSuccess = false
                    }; ;
                }

            }
            else if (surveyEditingSessionDTO.SurveyTypeId == 3 && survey.SurveyTypeId == 3)
            {
                // kiểm tra version có tồn tại

                if (surveyEditingSessionDTO.Version == null)
                {
                    throw new ForbiddenException("truy cập không hợp lệ");
                }
                var surveyMarket = survey.SurveyMarkets.Where(sm => sm.Version == surveyEditingSessionDTO.Version).FirstOrDefault();
                if (surveyMarket == null)
                {
                    throw new ForbiddenException("không tìm thấy phiên bản survey đang chỉnh sửa, survey id " + surveyEditingSessionDTO.Id.ToString() + " và version " + surveyEditingSessionDTO.Version.Value.ToString());
                }

                var versionStatus = survey.SurveyMarketVersionStatusTrackings
                    .Where(smt => smt.Version == surveyEditingSessionDTO.Version)
                    .OrderByDescending(smt => smt.CreatedAt)
                    .FirstOrDefault();
                if (versionStatus == null)
                {
                    throw new ForbiddenException("không tìm thấy trạng thái phiên bản survey, survey id " + surveyEditingSessionDTO.Id.ToString() + " và version " + surveyEditingSessionDTO.Version.Value.ToString());
                }

                // kiểm tra version status (có trường hợp editing)
                if (versionStatus.SurveyStatusId != 2)
                {
                    throw new ForbiddenException("không được phép chỉnh sửa survey ở thời điểm hiện tại, survey id " + surveyEditingSessionDTO.Id.ToString() + " và version " + surveyEditingSessionDTO.Version.Value.ToString());
                }

                try
                {
                    await UpdateSurveyByEditingSession(surveyEditingSessionDTO);
                }
                catch (Exception ex)
                {
                    Console.WriteLine("\n" + ex.Message + "\n");
                    Console.WriteLine("\n" + ex.StackTrace + "\n");
                    return new SurveySessionUpdateTriggerResponseDTO
                    {
                        Message = "Cập nhật phiên chỉnh sửa thất bại, lỗi: " + ex.Message,
                        IsSuccess = false
                    }; ;
                }
            }
            else
            {
                throw new Exception("không xác định");
            }


            return new SurveySessionUpdateTriggerResponseDTO
            {
                Message = "Cập nhật phiên chỉnh sửa thành công",
                IsSuccess = true
            };


        }


        public async Task<SurveyTakingSessionDTO> GetSurveyTakingSession(int surveyId, int userId, SurveyTakingSubjectEnum TakingSubject, int? Version = null)
        {
            {
                try
                {

                    SurveyFilterObject surveyFilterObject = new SurveyFilterObject { };

                    // Survey survey = await _unitOfWork.SurveyRepository.FindByIdAndFilterObjectAsync(surveyId, surveyFilterObject);
                    Survey survey = await _unitOfWork.SurveyRepository.FindByIdAsync(surveyId);
                    if (survey == null)
                    {
                        throw new Exception("survey không tồn tại");
                    }
                    else if (survey.SurveyTypeId == 3 && Version == null)
                    {
                        throw new Exception("phiên bản survey không được để trống");
                    }
                    else if (survey.SurveyTypeId == 3 && Version != null && survey.SurveyMarkets.Where(sm => sm.Version == Version).ToList().Count == 0)
                    {
                        throw new Exception("không tìm thấy survey theo điều kiện và có id " + surveyId.ToString() + " và version " + Version.Value.ToString());
                    }


                    if (TakingSubject == SurveyTakingSubjectEnum.Preview)
                    {
                        surveyFilterObject = new SurveyFilterObject
                        {
                            IsDeletedContain = false,
                            // IsInvalidTakenResultContain = false,
                            SurveyTypeId = survey.SurveyTypeId,
                        };
                        survey = await _unitOfWork.SurveyRepository.FindByIdAndFilterObjectAsync(surveyId, surveyFilterObject);
                        if (survey == null)
                        {
                            throw new Exception("không tìm thấy survey theo điều kiện và có id " + surveyId.ToString());
                        }
                    }
                    else if (TakingSubject == SurveyTakingSubjectEnum.Verified)
                    {
                        Account account = await _unitOfWork.AccountRepository.FindByIdAsync(userId);
                        if (account.RoleId != 4)
                        {
                            throw new Exception("không tìm thấy tài khoản người dùng");
                        }

                        if (survey.SurveyTypeId == 1)
                        {
                            surveyFilterObject = new SurveyFilterObject
                            {
                                IsDeletedContain = false,
                                // IsInvalidTakenResultContain = false,
                                IsAvailable = true,
                                SurveyTypeId = survey.SurveyTypeId,
                                SurveyStatusIds = new List<int> { 2 }
                            };
                            survey = await _unitOfWork.SurveyRepository.FindByIdAndFilterObjectAsync(surveyId, surveyFilterObject);
                            if (survey == null)
                            {
                                throw new Exception("không thể tải phiên làm ở thời điểm hiện tại");
                            }
                        }
                        else if (survey.SurveyTypeId == 2)
                        {
                            surveyFilterObject = new SurveyFilterObject
                            {
                                IsDeletedContain = false,
                                // IsInvalidTakenResultContain = false,
                                IsAvailable = true,
                                SurveyTypeId = survey.SurveyTypeId,
                                SurveyStatusIds = new List<int> { 2 }
                            };
                            survey = await _unitOfWork.SurveyRepository.FindByIdAndFilterObjectAsync(surveyId, surveyFilterObject);
                            var surveyTakenResults = await _unitOfWork.SurveyTakenResultRepository.FindBySurveyIdAsync(surveyId, false);

                            if (survey == null)
                            {
                                throw new Exception("không thể tải phiên làm ở thời điểm hiện tại");
                            }
                            if (survey.Kpi <= surveyTakenResults.Count())
                            {
                                throw new Exception("không thể tải phiên làm ở thời điểm hiện tại, đã đủ số lượng người làm");
                            }
                            if (survey.EndDate < DateOnly.FromDateTime(_dateHelpers.GetNowByAppTimeZone()))
                            {
                                throw new Exception("không thể tải phiên làm ở thời điểm hiện tại, đã hết thời gian tiếp nhận kết quả");
                            }
                            if (survey.RequesterId == userId)
                            {
                                throw new Exception("không được phép làm survey của chính mình");
                            }
                        }
                        else if (survey.SurveyTypeId == 3)
                        {
                            surveyFilterObject = new SurveyFilterObject
                            {
                                IsDeletedContain = false,
                                // IsInvalidTakenResultContain = false,
                                IsAvailable = true,
                                SurveyTypeId = survey.SurveyTypeId,
                                SurveyStatusIds = new List<int> { 2 },
                                Version = Version,
                                SurveyMarketVersionStatusIds = new List<int> { 2 }
                            };
                            survey = await _unitOfWork.SurveyRepository.FindByIdAndFilterObjectAsync(surveyId, surveyFilterObject);
                            if (survey == null)
                            {
                                throw new Exception("không thể tải phiên làm ở thời điểm hiện tại, survey id " + surveyId.ToString() + " và version " + Version.Value.ToString());
                            }
                        }
                        else
                        {
                            throw new Exception("không xác định");
                        }


                    }




                    return await GenerateSurveyTakingSessionDTO(survey, Version);
                }
                catch (Exception ex)
                {
                    Console.WriteLine("\n" + ex.StackTrace + "\n");
                    throw new HttpRequestException("Tạo phiên làm khảo sát thất bại, lỗi: " + ex.Message);
                }
            }
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
