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
using SurveyTalkService.BusinessLogic.DTOs.Transaction;

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
        IGenericRepository<AccountBalanceTransaction> _accountBalanceTransactionGenericRepository;



        public AccountPaymentService(
            ILogger<AccountPaymentService> logger,
            AppDbContext appDbContext,
            BcryptHelpers bcryptHelpers,
            JwtHelpers jwtHelpers,
            IUnitOfWork unitOfWork,

            IGenericRepository<Account> accountGenericRepository,
            IGenericRepository<AccountBalanceTransaction> accountBalanceTransactionGenericRepository,

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
            _accountBalanceTransactionGenericRepository = accountBalanceTransactionGenericRepository;

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





                    AccountBalanceTransaction accountBalanceTransaction = new AccountBalanceTransaction
                    {
                        AccountId = accountId,
                        Amount = accountBalanceDepositDTO.Amount,
                        TransactionTypeId = 5,
                        TransactionStatusId = 1,
                    };

                    // Save payment history to the database
                    AccountBalanceTransaction newAccountBalanceTransaction = await _accountBalanceTransactionGenericRepository.CreateAsync(accountBalanceTransaction);
                    long orderCode = newAccountBalanceTransaction.Id;

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
                    AccountBalanceTransaction? accountBalanceTransaction = await _unitOfWork.AccountBalanceTransactionRepository.FindByIdAsync((int)webhookBody.data.orderCode);
                    if (accountBalanceTransaction == null)
                    {
                        throw new HttpRequestException("Payment history not found.");
                    }

                    if (webhookBody.code == "00")
                    {
                        accountBalanceTransaction.TransactionStatusId = 2; 
                    }
                    else
                    {
                        accountBalanceTransaction.TransactionStatusId = 4; 
                    }

                    await _accountBalanceTransactionGenericRepository.UpdateAsync(accountBalanceTransaction.Id, accountBalanceTransaction);

                    if(accountBalanceTransaction.TransactionTypeId == 5) { 
                    accountBalanceTransaction.Account.Balance += accountBalanceTransaction.Amount;
                    }else if(accountBalanceTransaction.TransactionTypeId == 6) {
                        accountBalanceTransaction.Account.Balance -= accountBalanceTransaction.Amount;
                    }
                    await _accountGenericRepository.UpdateAsync(accountBalanceTransaction.Account.Id, accountBalanceTransaction.Account);

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
