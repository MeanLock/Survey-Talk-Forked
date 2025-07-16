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
using System.Drawing;
using SurveyTalkService.BusinessLogic.Services.DbServices.FilterServices;
using Microsoft.Extensions.DependencyInjection;
using SurveyTalkService.BusinessLogic.DTOs.Auth;
using SurveyTalkService.BusinessLogic.DTOs.Account;

namespace SurveyTalkService.BusinessLogic.Services.DbServices.UserServices
{
    public class AccountService
    {
        // LOGGER
        private readonly ILogger<AccountService> _logger;

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
        private readonly IGenericRepository<Account> _accountGenericRepository;
        private readonly IGenericRepository<Role> _roleGenericRepository;
        private readonly IGenericRepository<AccountProfile> _accountProfileGenericRepository;
        private readonly IGenericRepository<SurveyTopicFavorite> _surveyTopicFavoriteGenericRepository;
        private readonly IGenericRepository<SurveyTopic> _surveyTopicGenericRepository;

        // DB SERVICES
        private readonly FilterTagService _filterTagService;

        // AWS SERVICE
        private readonly AWSS3Service _awsS3Service;

        public AccountService(
            ILogger<AccountService> logger,
            AppDbContext appDbContext,
            BcryptHelpers bcryptHelpers,
            JwtHelpers jwtHelpers,
            IUnitOfWork unitOfWork,

            IServiceProvider serviceProvider,
            IGenericRepository<Account> accountGenericRepository,
            IGenericRepository<Role> roleGenericRepository,
            IGenericRepository<AccountProfile> accountProfileGenericRepository,
            IGenericRepository<SurveyTopicFavorite> surveyTopicFavoriteGenericRepository,
            IGenericRepository<SurveyTopic> surveyTopicGenericRepository,

            FileHelpers fileHelpers,
            IFilePathConfig filePathConfig,
            AWSS3Service awsS3Service,
            IAppConfig appConfig,
            ImageHelpers imageHelpers
            )
        {
            _logger = logger;
            _appDbContext = appDbContext;
            _bcryptHelpers = bcryptHelpers;
            _jwtHelpers = jwtHelpers;
            _unitOfWork = unitOfWork;

            _accountGenericRepository = accountGenericRepository;
            _roleGenericRepository = roleGenericRepository;
            _accountProfileGenericRepository = accountProfileGenericRepository;
            _surveyTopicFavoriteGenericRepository = surveyTopicFavoriteGenericRepository;
            _surveyTopicGenericRepository = surveyTopicGenericRepository;

            _filterTagService = serviceProvider.GetService<FilterTagService>();

            _fileHelpers = fileHelpers;
            _filePathConfig = filePathConfig;


            _awsS3Service = awsS3Service;
            _appConfig = appConfig;
            _imageHelpers = imageHelpers;
        }

        public async Task<Account> GetExistAccountById(int accountId)
        {
            var account = await _unitOfWork.AccountRepository.FindByIdAsync(accountId);
            if (account == null)
            {
                throw new Exception("không tìm thấy tài khoản có id " + accountId);
            }
            return account;
        }

        public async Task<Account> GetExistAccountByEmail(string email)
        {
            var account = await _unitOfWork.AccountRepository.FindByEmailAsync(email);
            if (account == null)
            {
                throw new Exception("không tìm thấy tài khoản có email: " + email);
            }
            return account;
        }

        public async Task<AccountProfile> GetExistAccountProfileByAccountId(int accountId)
        {
            var accountProfile = await _unitOfWork.AccountProfileRepository.FindByAccountIdAsync(accountId);
            if (accountProfile == null)
            {
                throw new Exception("không tìm thấy tài khoản có id " + accountId);
            }
            return accountProfile;
        }

        public async Task<Role> GetExistRoleById(int roleId)
        {
            var role = await _roleGenericRepository.FindByIdAsync(roleId);
            if (role == null)
            {
                throw new Exception("không tìm thấy role có id " + roleId);
            }
            return role;
        }

        /////////////////////////////////////////////////////////////
        public async Task RegisterCustomer(CustomerRegisterDTO customerRegisterDTO)
        {

            using (var transaction = await _appDbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    var registerInfo = customerRegisterDTO.RegisterInfo;
                    var customer = await _unitOfWork.AccountRepository.FindByEmailAsync(registerInfo.Email);
                    if (customer != null)
                    {
                        throw new Exception("email đã tồn tại " + registerInfo.Email);
                    }
                    customer = new Account
                    {
                        Email = registerInfo.Email,
                        Password = _bcryptHelpers.HashPassword(registerInfo.Password),
                        FullName = registerInfo.FullName,
                        RoleId = 4,
                        Dob = DateOnly.FromDateTime(registerInfo.Dob),
                        Gender = registerInfo.Gender,
                        Address = registerInfo.Address,
                        Phone = registerInfo.Phone,
                        IsFilterSurveyRequired = true, 
                        IsVerified = false, 
                    };
                    await _accountGenericRepository.CreateAsync(customer);

                    var AccountProfile = new AccountProfile
                    {
                        AccountId = customer.Id,
                        CountryRegion = null,
                        MaritalStatus = null,
                        AverageIncome = null,
                        EducationLevel = null,
                        JobField = null,
                        ProvinceCode = null,
                        DistrictCode = null,
                        WardCode = null
                    };
                    await _accountProfileGenericRepository.CreateAsync(AccountProfile);
                    Console.WriteLine("AccountProfile created for customer with ID: " + customer.Id);
                    Console.WriteLine("_filterTagService: " + _filterTagService);
                    await _filterTagService.RegisterFilterTag(customer.Id);

                    var folderPath = _filePathConfig.ACCOUNt_IMAGE_PATH + "\\" + customer.Id;
                    if (registerInfo.ImageBase64 != null && registerInfo.ImageBase64 != "")
                    {
                        string fileName = "main";
                        string base64Data = registerInfo.ImageBase64;

                        await _imageHelpers.SaveBase64File(base64Data, folderPath, fileName);
                    }
                    else
                    {
                        await _imageHelpers.CopyFile(_filePathConfig.ACCOUNt_IMAGE_PATH, "unknown", folderPath, "main");
                    }
                    await transaction.CommitAsync();
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    Console.WriteLine("\n" + ex.StackTrace + "\n");
                    throw new HttpRequestException("Đăng kí tài khoản thất bại, lỗi: " + ex.Message);
                }
            }
        }


        public async Task RegisterStaff(StaffRegisterDTO staffRegisterInfo)
        {
            using (var transaction = await _appDbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    var registerInfo = staffRegisterInfo.RegisterInfo;
                    var staff = await _unitOfWork.AccountRepository.FindByEmailAsync(registerInfo.Email);
                    if (staff != null)
                    {
                        throw new Exception("email đã tồn tại: " + registerInfo.Email);
                    }
                    var role = await this.GetExistRoleById(registerInfo.RoleId);

                    staff = new Account
                    {
                        Email = registerInfo.Email,
                        Password = _bcryptHelpers.HashPassword(registerInfo.Password),
                        FullName = registerInfo.FullName,
                        RoleId = registerInfo.RoleId,
                        Dob = DateOnly.FromDateTime(registerInfo.Dob),
                        Gender = registerInfo.Gender,
                        Address = registerInfo.Address,
                        Phone = registerInfo.Phone,
                        IsFilterSurveyRequired = false,
                        IsVerified = true,
                    };
                    await _accountGenericRepository.CreateAsync(staff);

                    var folderPath = _filePathConfig.ACCOUNt_IMAGE_PATH + "\\" + staff.Id;
                    if (registerInfo.ImageBase64 != null && registerInfo.ImageBase64 != "")
                    {
                        string fileName = "main";
                        string base64Data = registerInfo.ImageBase64;

                        await _imageHelpers.SaveBase64File(base64Data, folderPath, fileName);
                    }
                    else
                    {
                        await _imageHelpers.CopyFile(_filePathConfig.ACCOUNt_IMAGE_PATH, "unknown", folderPath, "main");
                    }

                    await transaction.CommitAsync();

                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    Console.WriteLine("\n" + ex.StackTrace + "\n");
                    throw new HttpRequestException("Đăng kí tài khoản thất bại, lỗi: " + ex.Message);
                }
            }

        }
        public async Task<JArray> GetCustomerAccounts()
        {
            try
            {
                var customers = await _unitOfWork.AccountRepository.FindByRoleIdAsync(4);
                if (customers == null || !customers.Any())
                {
                    throw new Exception("Không tìm thấy tài khoản khách hàng nào");
                }

                var result = await Task.WhenAll(customers.Select(async item =>
                {
                    return new
                    {
                        Id = item.Id,
                        Email = item.Email,
                        Role = new
                        {
                            Id = item.Role.Id,
                            Name = item.Role.Name
                        },
                        FullName = item.FullName,
                        Dob = item.Dob?.ToString("yyyy-MM-dd"),
                        Gender = item.Gender,
                        Address = item.Address,
                        Phone = item.Phone,
                        Balance = item.Balance,
                        IsVerified = item.IsVerified,
                        Xp = item.Xp,
                        Level = item.Level,
                        ProgressionSurveyCount = item.ProgressionSurveyCount,
                        IsFilterSurveyRequired = item.IsFilterSurveyRequired,
                        LastFilterSurveyTakenAt = item.LastFilterSurveyTakenAt?.ToString("yyyy-MM-ddTHH:mm:ss.fffZ"),
                        DeactivatedAt = item.DeactivatedAt?.ToString("yyyy-MM-ddTHH:mm:ss.fffZ"),
                        CreatedAt = item.CreatedAt.ToString("yyyy-MM-ddTHH:mm:ss.fffZ"),
                        UpdatedAt = item.UpdatedAt.ToString("yyyy-MM-ddTHH:mm:ss.fffZ"),
                        MainImageUrl = await _imageHelpers.GenerateImageUrl(_filePathConfig.ACCOUNt_IMAGE_PATH, item.Id.ToString(), "main")
                    };
                }));

                return JArray.FromObject(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine("\n" + ex.StackTrace + "\n");
                throw new HttpRequestException("Lấy danh sách tài khoản khách hàng thất bại, lỗi: " + ex.Message);
            }

        }

        public async Task<JArray> GetStaffAccounts()
        {
            try
            {
                List<int> roles = new List<int> { 2, 3 }; // 2: Head, 3: Assignee
                var staffs = await _unitOfWork.AccountRepository.FindByRoleIdsAsync(roles);
                if (staffs == null || !staffs.Any())
                {
                    throw new Exception("Không tìm thấy tài khoản nhân viên nào");
                }

                var result = await Task.WhenAll(staffs.Select(async item =>
                {
                    return new
                    {
                        Id = item.Id,
                        Email = item.Email,
                        Role = new
                        {
                            Id = item.Role.Id,
                            Name = item.Role.Name
                        },
                        FullName = item.FullName,
                        Dob = item.Dob?.ToString("yyyy-MM-dd"),
                        Gender = item.Gender,
                        Address = item.Address,
                        Phone = item.Phone,
                        Balance = item.Balance,
                        IsVerified = item.IsVerified,
                        Xp = item.Xp,
                        Level = item.Level,
                        ProgressionSurveyCount = item.ProgressionSurveyCount,
                        IsFilterSurveyRequired = item.IsFilterSurveyRequired,
                        LastFilterSurveyTakenAt = item.LastFilterSurveyTakenAt?.ToString("yyyy-MM-ddTHH:mm:ss.fffZ"),
                        DeactivatedAt = item.DeactivatedAt?.ToString("yyyy-MM-ddTHH:mm:ss.fffZ"),
                        CreatedAt = item.CreatedAt.ToString("yyyy-MM-ddTHH:mm:ss.fffZ"),
                        UpdatedAt = item.UpdatedAt.ToString("yyyy-MM-ddTHH:mm:ss.fffZ"),
                        MainImageUrl = await _imageHelpers.GenerateImageUrl(_filePathConfig.ACCOUNt_IMAGE_PATH, item.Id.ToString(), "main")
                    };
                }));

                return JArray.FromObject(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine("\n" + ex.StackTrace + "\n");
                throw new HttpRequestException("Lấy danh sách tài khoản nhân viên thất bại, lỗi: " + ex.Message);
            }

        }

        public async Task<JObject> GetAccountById(int accountId)
        {
            try
            {
                var account = await this.GetExistAccountById(accountId);
                return JObject.FromObject(new
                {
                    Id = account.Id,
                    Email = account.Email,
                    Role = new
                    {
                        Id = account.Role.Id,
                        Name = account.Role.Name
                    },
                    FullName = account.FullName,
                    Dob = account.Dob?.ToString("yyyy-MM-dd"),
                    Gender = account.Gender,
                    Address = account.Address,
                    Phone = account.Phone,
                    Balance = account.Balance,
                    IsVerified = account.IsVerified,
                    Xp = account.Xp,
                    Level = account.Level,
                    ProgressionSurveyCount = account.ProgressionSurveyCount,
                    IsFilterSurveyRequired = account.IsFilterSurveyRequired,
                    LastFilterSurveyTakenAt = account.LastFilterSurveyTakenAt?.ToString(),
                    DeactivatedAt = account.DeactivatedAt?.ToString(),
                    CreatedAt = account.CreatedAt.ToString(),
                    UpdatedAt = account.UpdatedAt.ToString(),
                    MainImageUrl = await _imageHelpers.GenerateImageUrl(_filePathConfig.ACCOUNt_IMAGE_PATH, account.Id.ToString(), "main"),
                    Profile = new
                    {
                        AccountId = account.AccountProfile?.AccountId,
                        CountryRegion = account.AccountProfile?.CountryRegion,
                        MaritalStatus = account.AccountProfile?.MaritalStatus,
                        AverageIncome = account.AccountProfile?.AverageIncome,
                        EducationLevel = account.AccountProfile?.EducationLevel,
                        JobField = account.AccountProfile?.JobField,
                        ProvinceCode = account.AccountProfile?.ProvinceCode,
                        DistrictCode = account.AccountProfile?.DistrictCode,
                        WardCode = account.AccountProfile?.WardCode
                    }
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine("\n" + ex.StackTrace + "\n");
                throw new HttpRequestException("Lấy thông tin tài khoản thất bại, lỗi: " + ex.Message);
            }


        }

        public async Task<JObject> GetMe(int accountId)
        {
            try
            {
                var account = await this.GetExistAccountById(accountId);
                return JObject.FromObject(new
                {
                    Id = account.Id,
                    Email = account.Email,
                    Role = new
                    {
                        Id = account.Role.Id,
                        Name = account.Role.Name
                    },
                    FullName = account.FullName,
                    Dob = account.Dob?.ToString("yyyy-MM-dd"),
                    Gender = account.Gender,
                    Address = account.Address,
                    Phone = account.Phone,
                    Balance = account.Balance,
                    IsVerified = account.IsVerified,
                    Xp = account.Xp,
                    Level = account.Level,
                    ProgressionSurveyCount = account.ProgressionSurveyCount,
                    IsFilterSurveyRequired = account.IsFilterSurveyRequired,
                    LastFilterSurveyTakenAt = account.LastFilterSurveyTakenAt?.ToString(),
                    DeactivatedAt = account.DeactivatedAt?.ToString(),
                    CreatedAt = account.CreatedAt.ToString(),
                    UpdatedAt = account.UpdatedAt.ToString(),
                    MainImageUrl = await _imageHelpers.GenerateImageUrl(_filePathConfig.ACCOUNt_IMAGE_PATH, account.Id.ToString(), "main"),
                    Profile = new
                    {
                        AccountId = account.AccountProfile?.AccountId,
                        CountryRegion = account.AccountProfile?.CountryRegion,
                        MaritalStatus = account.AccountProfile?.MaritalStatus,
                        AverageIncome = account.AccountProfile?.AverageIncome,
                        EducationLevel = account.AccountProfile?.EducationLevel,
                        JobField = account.AccountProfile?.JobField,
                        ProvinceCode = account.AccountProfile?.ProvinceCode,
                        DistrictCode = account.AccountProfile?.DistrictCode,
                        WardCode = account.AccountProfile?.WardCode
                    }
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine("\n" + ex.StackTrace + "\n");
                throw new HttpRequestException("Lấy thông tin tài khoản thất bại, lỗi: " + ex.Message);
            }


        }

        public async Task<Account> UpdateAccount(int accountId, AccountUpdateDTO accountUpdateDto)
        {
            using (var transaction = await _appDbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    var account = await this.GetExistAccountById(accountId);

                    // Cập nhật thông tin tài khoản
                    account.FullName = accountUpdateDto.FullName;
                    account.Dob = accountUpdateDto.Dob;
                    account.Gender = accountUpdateDto.Gender;
                    account.Address = accountUpdateDto.Address;
                    account.Phone = accountUpdateDto.Phone;

                    await _accountGenericRepository.UpdateAsync(account.Id, account);

                    // Cập nhật ảnh đại diện
                    var folderPath = _filePathConfig.ACCOUNt_IMAGE_PATH + "\\" + account.Id;
                    if (accountUpdateDto.ImageBase64 != null && accountUpdateDto.ImageBase64 != "")
                    {
                        string fileName = "main";
                        string base64Data = accountUpdateDto.ImageBase64;

                        await _imageHelpers.SaveBase64File(base64Data, folderPath, fileName);
                    }
                    await transaction.CommitAsync();
                    return account;

                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    Console.WriteLine("\n" + ex.StackTrace + "\n");
                    throw new HttpRequestException("Cập nhật tài khoản thất bại, lỗi: " + ex.Message);
                }
            }
        }

        public async Task UpdateAccountProfile(int accountId, AccountProfileUpdateDTO accountUpdateProfileDto)
        {
            using (var transaction = await _appDbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    var account = await this.GetExistAccountById(accountId);

                    var accountProfile = await this.GetExistAccountProfileByAccountId(accountId);
                    // Cập nhật thông tin tài khoản
                    accountProfile.CountryRegion = accountUpdateProfileDto.AccountProfile.CountryRegion;
                    accountProfile.MaritalStatus = accountUpdateProfileDto.AccountProfile.MaritalStatus;
                    accountProfile.AverageIncome = accountUpdateProfileDto.AccountProfile.AverageIncome;
                    accountProfile.EducationLevel = accountUpdateProfileDto.AccountProfile.EducationLevel;
                    accountProfile.JobField = accountUpdateProfileDto.AccountProfile.JobField;
                    accountProfile.ProvinceCode = accountUpdateProfileDto.AccountProfile.ProvinceCode;
                    accountProfile.DistrictCode = accountUpdateProfileDto.AccountProfile.DistrictCode;
                    accountProfile.WardCode = accountUpdateProfileDto.AccountProfile.WardCode;
                    await _unitOfWork.AccountProfileRepository.UpdateAsync(accountProfile);
                    // Cập nhật sở thích chủ đề khảo sát
                    if (accountUpdateProfileDto.SurveyTopicFavorites != null && accountUpdateProfileDto.SurveyTopicFavorites.Any())
                    {
                        // Xoá tất cả sở thích cũ
                        await this._unitOfWork.SurveyTopicFavoriteRepository.DeleteByAccountIdAsync(accountId);

                        // Thêm sở thích mới
                        foreach (var favoriteDto in accountUpdateProfileDto.SurveyTopicFavorites)
                        {

                            var surveyTopicFavorite = new SurveyTopicFavorite
                            {
                                AccountId = accountId,
                                SurveyTopicId = favoriteDto.SurveyTopicId,
                                FavoriteScore = favoriteDto.FavoriteScore
                            };
                            await _surveyTopicFavoriteGenericRepository.CreateAsync(surveyTopicFavorite);
                        }
                    }


                    await transaction.CommitAsync();
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    Console.WriteLine("\n" + ex.StackTrace + "\n");
                    throw new HttpRequestException("Cập nhật thông tin tài khoản thất bại, lỗi: " + ex.Message);
                }
            }
        }

        public async Task DeactivateAccount(int accountId, bool isDeactivate)
        {
            using (var transaction = await _appDbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    var account = await this.GetExistAccountById(accountId);
                    // if (isDeactivate == false)
                    // {
                    //     account.DeactivatedAt = null;
                    // }else
                    // {
                    //     account.DeactivatedAt = this._dateHelpers.GetNowByAppTimeZone();
                    // }

                    await this._unitOfWork.AccountRepository.DeactivateAsync(account.Id, isDeactivate);
                    // Cập nhật thông tin tài khoản

                    await transaction.CommitAsync();
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    Console.WriteLine("\n" + ex.StackTrace + "\n");
                    throw new HttpRequestException("Vô hiệu hoá tài khoản thất bại, lỗi: " + ex.Message);
                }
            }
        }






    }
}
