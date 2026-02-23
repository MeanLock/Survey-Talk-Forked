using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SurveyTalkService.BusinessLogic.Helpers;
using SurveyTalkService.Common.AppConfigurations.Google;

namespace SurveyTalkService.BusinessLogic.Registrations
{
    public static class HelperRegistration
    {
        public static IServiceCollection AddHelpers(this IServiceCollection services)
        {
            services.AddSingleton<BcryptHelpers>();
            services.AddSingleton<JwtHelpers>();
            services.AddSingleton<FileHelpers>();
            services.AddSingleton<DateHelpers>();
            services.AddScoped<MailHelpers>();
            services.AddScoped<ImageHelpers>();
            return services;
        }

        
    }
}
