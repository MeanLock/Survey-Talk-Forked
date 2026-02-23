using Microsoft.Extensions.DependencyInjection;
using SurveyTalkService.BusinessLogic.Services.AWSServices.S3;
using SurveyTalkService.BusinessLogic.Services.OpenAIServices._4oMini;

namespace SurveyTalkService.BusinessLogic.Registrations
{
    public static class OpenAIServiceRegistration
    {
        public static IServiceCollection AddOpenAIServices(this IServiceCollection services)
        {
            services.AddScoped<OpenAI4oMiniService>();
            return services;
        }
    }
}
