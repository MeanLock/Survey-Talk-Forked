using Microsoft.Extensions.DependencyInjection;
using SurveyTalkService.BusinessLogic.Services.AWSServices.S3;

namespace SurveyTalkService.BusinessLogic.Registrations
{
    public static class AWSServiceRegistration
    {
        public static IServiceCollection AddAWSServices(this IServiceCollection services)
        {
            services.AddScoped<AWSS3Service>();

            return services;
        }
    }
}
