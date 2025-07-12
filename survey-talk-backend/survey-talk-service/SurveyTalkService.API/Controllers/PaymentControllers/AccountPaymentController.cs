using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Net.payOS.Types;
using SurveyTalkService.API.Filters.ExceptionFilters;
using SurveyTalkService.BusinessLogic.DTOs.Transaction;
using SurveyTalkService.BusinessLogic.Services.DbServices.PaymentServices;
using SurveyTalkService.BusinessLogic.Services.DbServices.UserServices;
using SurveyTalkService.DataAccess.Entities;

namespace SurveyTalkService.API.Controllers.PaymentControllers
{
    [Route("api/Payment/account")]
    [ApiController]
    [TypeFilter(typeof(HttpExceptionFilter))]
    public class AccountPaymentController : ControllerBase
    {
        private ILogger<AccountPaymentController> _logger;
        private readonly AuthService _authService;
        private readonly AccountService _accountService;
        private readonly AccountPaymentService _accountPaymentService;

        public AccountPaymentController(
            ILogger<AccountPaymentController> logger,
            AuthService authService,
            AccountService accountService,
            AccountPaymentService accountPaymentService
            )
        {
            _logger = logger;
            _authService = authService;
            _accountService = accountService;
            _accountPaymentService = accountPaymentService;
        }



        // GET /api/Payment/account/balance-deposits/create-payment-link
        [HttpPost("balance-deposits/create-payment-link")]
        [Authorize(Policy = "CustomerRequiredOnly")]
        public async Task<IActionResult> CreateAccountBalanceDepositPaymentLink([FromBody] AccountBalanceDepositDTO accountBalanceDepositDTO)
        {
            int userId = int.Parse(User.FindFirst("id")?.Value);

            string paymentLink = await _accountPaymentService.CreateAccountBalanceDepositPaymentLink(accountBalanceDepositDTO, userId);

            return Ok(new
            {
                Message = "Payment link created successfully.",
                PaymentLink = paymentLink
            });
        }

        // POST /api/Payment/account/ConfirmPayment
        [HttpPost("confirm-payment")]
        public async Task ConfirmPayment([FromBody] WebhookType? webhookBody)
        {
                await _accountPaymentService.ConfirmPayment(webhookBody);
        }
    }
}
