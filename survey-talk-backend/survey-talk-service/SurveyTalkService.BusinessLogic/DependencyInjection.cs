using Microsoft.Extensions.DependencyInjection;
using SurveyTalkService.BusinessLogic.Registrations;

namespace SurveyTalkService.BusinessLogic
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddBusinessLogicLayer(this IServiceCollection services)
        {
            //services.AddConfiguration();
            services.AddBackgroundServices();
            services.AddDbServices();    
            services.AddHelpers();
            services.AddAWSServices();
            services.AddRedisServices();
            services.AddIdentityServerServices();
            services.AddSignalRHubServices();
            services.AddEmbeddingVectorServices();
            services.AddOpenAIServices();
            return services;
        }
    }
}
