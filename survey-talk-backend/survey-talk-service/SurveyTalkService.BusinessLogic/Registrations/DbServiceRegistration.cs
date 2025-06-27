using SurveyTalkService.BusinessLogic.Services.DbServices.UserServices;
using Microsoft.Extensions.DependencyInjection;
using SurveyTalkService.BusinessLogic.Services.DbServices.FilterServices;
using SurveyTalkService.BusinessLogic.Services.DbServices.SurveyServices;
using SurveyTalkService.BusinessLogic.Services.DbServices.PaymentServices;

namespace SurveyTalkService.BusinessLogic.Registrations
{
    public static class DbServiceRegistration
    {
        public static IServiceCollection AddDbServices(this IServiceCollection services)
        {
            // ConfigServices
            services.AddScoped<SystemConfigService>();

            // UserServices
            services.AddScoped<AuthService>();
            services.AddScoped<AccountService>();

            // PaymentServices
            services.AddScoped<AccountPaymentService>();

            // SurveyServices
            services.AddScoped<SurveyCoreService>();
            services.AddScoped<SurveySessionService>();
            services.AddScoped<SurveyResponseService>();
            services.AddScoped<SurveyTransactionService>();


            // FilterServices
            services.AddScoped<FilterTagService>();




            return services;
        }
    }
}
