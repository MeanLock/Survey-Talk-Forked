using Microsoft.Extensions.Configuration;
using SurveyTalkService.Common.AppConfigurations.Redis.interfaces;

namespace SurveyTalkService.Common.AppConfigurations.Redis
{
    public class RedisSessionConfigModel
    {
        public string KeyPrefix { get; set; }
        public int ExpirySeconds { get; set; }
    }
    public class RedisSessionConfig : IRedisSessionConfig
    {
        public string KeyPrefix { get; set; }
        public int ExpirySeconds { get; set; }

        public RedisSessionConfig(IConfiguration configuration)
        {
            var sessionConfig = configuration.GetSection("Redis:Session").Get<RedisSessionConfigModel>();
            KeyPrefix = sessionConfig.KeyPrefix;
            ExpirySeconds = sessionConfig.ExpirySeconds;
        }
    }
} 