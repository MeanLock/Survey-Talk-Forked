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

namespace SurveyTalkService.BusinessLogic.Services.DbServices.FilterServices
{
    public class FilterTagService
    {
        // LOGGER
        private readonly ILogger<FilterTagService> _logger;

        // CONFIG
        public readonly IAppConfig _appConfig;
        private readonly IFilePathConfig _filePathConfig;

        // DB CONTEXT
        private readonly AppDbContext _appDbContext;

        // HELPERS
        private readonly BcryptHelpers _bcryptHelpers;
        private readonly JwtHelpers _jwtHelpers;
        private readonly FileHelpers _fileHelpers;


        // UNIT OF WORK
        private readonly IUnitOfWork _unitOfWork;

        // REPOSITORIES
        private readonly IGenericRepository<FilterTag> _filterTagGenericRepository;
        private readonly IGenericRepository<FilterTagType> _filterTagTypeGenericRepository;
        private readonly IGenericRepository<TakerTagFilter> _takerTagFilterGenericRepository;

        // AWS SERVICE
        private readonly AWSS3Service _awsS3Service;

        public FilterTagService(
            ILogger<FilterTagService> logger,
            AppDbContext appDbContext,
            BcryptHelpers bcryptHelpers,
            JwtHelpers jwtHelpers,
            IUnitOfWork unitOfWork,
            IGenericRepository<Account> accountRepository,
            IGenericRepository<Role> roleRepository,

            FileHelpers fileHelpers,
            IFilePathConfig filePathConfig,
            AWSS3Service awsS3Service,
            IAppConfig appConfig,
            IGenericRepository<FilterTag> filterTagGenericRepository,
            IGenericRepository<FilterTagType> filterTagTypeGenericRepository,
            IGenericRepository<TakerTagFilter> takerTagFilterGenericRepository
            )
        {
            _logger = logger;
            _appDbContext = appDbContext;
            _bcryptHelpers = bcryptHelpers;
            _jwtHelpers = jwtHelpers;
            _unitOfWork = unitOfWork;

            _filterTagGenericRepository = filterTagGenericRepository;
            _filterTagTypeGenericRepository = filterTagTypeGenericRepository;
            _takerTagFilterGenericRepository = takerTagFilterGenericRepository;

            _fileHelpers = fileHelpers;
            _filePathConfig = filePathConfig;


            _awsS3Service = awsS3Service;
            _appConfig = appConfig;
        }

        public async Task RegisterFilterTag(int accountId)
        {
            try
            {
                IEnumerable<FilterTagType> filterTagTypes = await _filterTagTypeGenericRepository.FindAll().ToListAsync();
                IEnumerable<FilterTag> filterTags = await _filterTagGenericRepository.FindAll().ToListAsync();
                foreach (var filterTagType in filterTagTypes)
                {
                    foreach (var filterTag in filterTags.Where(tag => tag.FilterTagTypeId == filterTagType.Id))
                    {
                        TakerTagFilter takerTagFilter = new TakerTagFilter
                        {
                            TakerId = accountId,
                            FilterTagId = filterTag.Id,
                            Summary = null, // Initialize with null or empty string if needed
                        };
                        // Console.WriteLine("\n\n\nTakerTagFilter: " + takerTagFilter.TakerId + " - " + takerTagFilter.FilterTagId + "\n\n\n");
                        await _takerTagFilterGenericRepository.CreateAsync(takerTagFilter);
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("\n" + ex.StackTrace + "\n");
                throw new HttpRequestException("Lỗi đăng kí filter tags: " + ex.Message);
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
