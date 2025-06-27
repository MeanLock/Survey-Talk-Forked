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
using SurveyTalkService.Common.AppConfigurations.Payos.interfaces;
using Net.payOS;
using Net.payOS.Types;
using SurveyTalkService.BusinessLogic.DTOs.Payment;

namespace SurveyTalkService.BusinessLogic.Services.DbServices.PaymentServices
{
    public class AccountPaymentService
    {
        // LOGGER
        private readonly ILogger<AccountPaymentService> _logger;

        // CONFIG
        public readonly IAppConfig _appConfig;
        private readonly IFilePathConfig _filePathConfig;
        private readonly IPayosConfig _payosConfig;

        // DB CONTEXT
        private readonly AppDbContext _appDbContext;

        // HELPERS
        private readonly BcryptHelpers _bcryptHelpers;
        private readonly JwtHelpers _jwtHelpers;
        private readonly FileHelpers _fileHelpers;


        // UNIT OF WORK
        private readonly IUnitOfWork _unitOfWork;

        // REPOSITORIES
        IGenericRepository<Account> _accountGenericRepository;  
        IGenericRepository<PaymentHistory> _paymentHistoryGenericRepository;



        public AccountPaymentService(
            ILogger<AccountPaymentService> logger,
            AppDbContext appDbContext,
            BcryptHelpers bcryptHelpers,
            JwtHelpers jwtHelpers,
            IUnitOfWork unitOfWork,

            IGenericRepository<Account> accountGenericRepository,
            IGenericRepository<PaymentHistory> paymentHistoryGenericRepository,

            FileHelpers fileHelpers,
            IFilePathConfig filePathConfig,
            IAppConfig appConfig,
            IPayosConfig payosConfig
            )
        {
            _logger = logger;
            _appDbContext = appDbContext;
            _bcryptHelpers = bcryptHelpers;
            _jwtHelpers = jwtHelpers;
            _unitOfWork = unitOfWork;

            _accountGenericRepository = accountGenericRepository;
            _paymentHistoryGenericRepository = paymentHistoryGenericRepository;

            _fileHelpers = fileHelpers;
            _filePathConfig = filePathConfig;
            _appConfig = appConfig;
            _payosConfig = payosConfig;
        }
        public static long GenerateRandomLong(int minDigits = 5, int maxDigits = 15)
        {
            var random = new Random();
            int length = random.Next(minDigits, maxDigits + 1);
            long min = (long)Math.Pow(10, length - 1);
            long max = (long)Math.Pow(10, length) - 1;
            return random.NextInt64(min, max);
        }

        /////////////////////////////////////////////////////////////
        public async Task<string> CreateAccountBalanceDepositPaymentLink(AccountBalanceDepositDTO accountBalanceDepositDTO, int accountId)
        {
            using (var transaction = await _appDbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    PayOS payOS = new PayOS(_payosConfig.ClientID, _payosConfig.APIKey, _payosConfig.ChecksumKey);





                    PaymentHistory paymentHistory = new PaymentHistory
                    {
                        AccountId = accountId,
                        Amount = accountBalanceDepositDTO.Amount,
                        PaymentTypeId = 5,
                        PaymentStatusId = 1,
                    };

                    // Save payment history to the database
                    PaymentHistory newPaymentHistory = await _paymentHistoryGenericRepository.CreateAsync(paymentHistory);
                    long orderCode = newPaymentHistory.Id;

                    PaymentData paymentData = new PaymentData(orderCode, (int)accountBalanceDepositDTO.Amount, $"SURVEYTALK NAP TIEN",
                                             [], accountBalanceDepositDTO.CancelUrl, accountBalanceDepositDTO.ReturnUrl);

                    CreatePaymentResult createPayment = await payOS.createPaymentLink(paymentData);


                    // Commit the transaction
                    await transaction.CommitAsync();
                    return createPayment.checkoutUrl;

                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    Console.WriteLine(ex.Message);
                    Console.WriteLine("\n" + ex.StackTrace + "\n");
                    throw new HttpRequestException("Tạo liên kết thanh toán không thành công.");
                }
            }

        }

        public async Task ConfirmPayment(WebhookType webhookBody)
        {
            using (var transaction = await _appDbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    if (webhookBody == null)
                    {
                        throw new Exception("Invalid webhook data.");
                    }
                    if(webhookBody.data.description == "VQRIO123")
                    {
                        return;
                    }
                    // Console.WriteLine("\n\n\n" + JsonConvert.SerializeObject(webhookBody, Formatting.Indented) + "\n\n\n");

                    // Retrieve the payment history record
                    PaymentHistory? paymentHistory = await _unitOfWork.PaymentHistoryRepository.FindByIdAsync((int)webhookBody.data.orderCode);
                    if (paymentHistory == null)
                    {
                        throw new HttpRequestException("Payment history not found.");
                    }

                    if (webhookBody.code == "00")
                    {
                        paymentHistory.PaymentStatusId = 2; 
                    }
                    else
                    {
                        paymentHistory.PaymentStatusId = 4; 
                    }

                    await _paymentHistoryGenericRepository.UpdateAsync(paymentHistory.Id, paymentHistory);

                    if(paymentHistory.PaymentTypeId == 5) { 
                    paymentHistory.Account.Balance += paymentHistory.Amount;
                    }else if(paymentHistory.PaymentTypeId == 6) {
                        paymentHistory.Account.Balance -= paymentHistory.Amount;
                    }
                    await _accountGenericRepository.UpdateAsync(paymentHistory.Account.Id, paymentHistory.Account);

                    // Commit the transaction
                    await transaction.CommitAsync();
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    Console.WriteLine(ex.Message);
                    Console.WriteLine("\n" + ex.StackTrace + "\n");
                    throw new HttpRequestException("Payment confirmation failed.");
                }
            }
        }

    }
}
