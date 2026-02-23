using Microsoft.Extensions.DependencyInjection;
using SurveyTalkService.BusinessLogic.Services.RedisServices;

namespace SurveyTalkService.BusinessLogic.Registrations
{
    public static class RedisServiceRegistration
    {
        public static IServiceCollection AddRedisServices(this IServiceCollection services)
        {
            services.AddScoped<RedisCacheService>();

            return services;
        }
    }
}
