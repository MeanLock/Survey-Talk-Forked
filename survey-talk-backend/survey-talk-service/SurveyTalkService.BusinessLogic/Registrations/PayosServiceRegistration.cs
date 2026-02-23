using Microsoft.Extensions.DependencyInjection;
using SurveyTalkService.BusinessLogic.Services.PayosServices;

namespace SurveyTalkService.BusinessLogic.Registrations
{
    public static class PayosServiceRegistration
    {
        public static IServiceCollection AddPayosServices(this IServiceCollection services)
        {
            services.AddScoped<PayosService>();

            return services;
        }
    }
}
