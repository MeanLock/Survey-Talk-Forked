using Microsoft.Extensions.DependencyInjection;
using SurveyTalkService.Common.AppConfigurations.App;
using SurveyTalkService.Common.AppConfigurations.App.interfaces;
using SurveyTalkService.Common.AppConfigurations.AWS;
using SurveyTalkService.Common.AppConfigurations.AWS.interfaces;
using SurveyTalkService.Common.AppConfigurations.Bcrypt;
using SurveyTalkService.Common.AppConfigurations.Bcrypt.interfaces;
using SurveyTalkService.Common.AppConfigurations.FilePath;
using SurveyTalkService.Common.AppConfigurations.FilePath.interfaces;
using SurveyTalkService.Common.AppConfigurations.Jwt;
using SurveyTalkService.Common.AppConfigurations.Jwt.interfaces;
using SurveyTalkService.Common.AppConfigurations.Mail;
using SurveyTalkService.Common.AppConfigurations.Mail.interfaces;
using SurveyTalkService.Common.AppConfigurations.Google;
using SurveyTalkService.Common.AppConfigurations.Google.interfaces;
using SurveyTalkService.Common.AppConfigurations.Redis.interfaces;
using SurveyTalkService.Common.AppConfigurations.Redis;
using SurveyTalkService.Common.AppConfigurations.OpenAI.interfaces;
using SurveyTalkService.Common.AppConfigurations.OpenAI;
using SurveyTalkService.Common.AppConfigurations.BusinessSetting.interfaces;
using SurveyTalkService.Common.AppConfigurations.BusinessSetting;
using SurveyTalkService.Common.AppConfigurations.Payos.interfaces;
using SurveyTalkService.Common.AppConfigurations.Payos;

namespace SurveyTalkService.Common.Registrations
{
    public static class ConfigurationRegistration
    {
        public static IServiceCollection AddConfiguration(this IServiceCollection services)
        {
            // APP
            services.AddSingleton<IAppConfig, AppConfig>();

            // JWT
            services.AddSingleton<IJwtConfig, JwtConfig>();

            // Bcrypt
            services.AddSingleton<IBcryptConfig, BcryptConfig>();

            // FilePath
            services.AddSingleton<IFilePathConfig, FilePathConfig>();

            // BusinessSetting
            services.AddSingleton<ISurveyConfig, SurveyConfig>();
            services.AddSingleton<IEmbeddingVectorModelConfig, EmbeddingVectorModelConfig>();
            services.AddSingleton<IAccountConfig, AccountConfig>();

            // AWS
            services.AddSingleton<IAWSS3Config, AWSS3Config>();

            // Google
            services.AddSingleton<IGoogleOAuth2Config, GoogleOAuth2Config>();
            services.AddSingleton<IGoogleMailConfig, GoogleMailConfig>();

            // Mail
            services.AddSingleton<IMailConfig, MailConfig>();

            // Redis
            services.AddSingleton<IRedisDefaultConfig, RedisDefaultConfig>();
            services.AddSingleton<IRedisCacheConfig, RedisCacheConfig>();
            services.AddSingleton<IRedisSessionConfig, RedisSessionConfig>();
            services.AddSingleton<IRedisRateLimitConfig, RedisRateLimitConfig>();
            services.AddSingleton<IRedisMessageQueueConfig, RedisMessageQueueConfig>();
            services.AddSingleton<IRedisLockConfig, RedisLockConfig>();
            services.AddSingleton<IRedisAnalyticsConfig, RedisAnalyticsConfig>();
            services.AddSingleton<IRedisConfigConfig, RedisConfigConfig>();
            services.AddSingleton<IRedisJobQueueConfig, RedisJobQueueConfig>();

            // OpenAI
            services.AddSingleton<IOpenAIConfig, OpenAIConfig>();

            // Payos
            services.AddSingleton<IPayosConfig, PayosConfig>();

            
            return services;
        }
    }
}
