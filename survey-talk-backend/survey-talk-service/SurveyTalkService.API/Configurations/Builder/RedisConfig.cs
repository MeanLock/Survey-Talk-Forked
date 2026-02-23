using SurveyTalkService.Common.AppConfigurations.Redis;
using StackExchange.Redis;

namespace SurveyTalkService.API.Configurations.Builder
{
    public static class RedisConfig
    {

        public static void AddBuilderRedisConfig(this WebApplicationBuilder builder)
        {
            builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
            {
                var config = builder.Configuration.GetSection("Redis:Default").Get<RedisDefaultConfigModel>();
                
                var options = new ConfigurationOptions
                {
                    EndPoints = { config.ConnectionString },
                    Password = config.Password,
                    ConnectTimeout = config.ConnectTimeout,
                    SyncTimeout = config.SyncTimeout,
                    AbortOnConnectFail = config.AbortOnConnectFail,
                    ConnectRetry = config.ConnectRetry,
                    Ssl = config.UseSsl,
                    DefaultDatabase = config.DefaultDatabase
                };
                return ConnectionMultiplexer.Connect(options);
            });

        }


    }
}
