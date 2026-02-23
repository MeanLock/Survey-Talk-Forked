using Microsoft.Extensions.Configuration;
using SurveyTalkService.Common.AppConfigurations.Redis.interfaces;

namespace SurveyTalkService.Common.AppConfigurations.Redis
{
    public class RedisConfigConfigModel
    {
        public string KeyPrefix { get; set; }
        public int RefreshIntervalSeconds { get; set; }
    }
    public class RedisConfigConfig : IRedisConfigConfig
    {
        public string KeyPrefix { get; set; }
        public int RefreshIntervalSeconds { get; set; }

        public RedisConfigConfig(IConfiguration configuration)
        {
            var configConfig = configuration.GetSection("Redis:Config").Get<RedisConfigConfigModel>();
            KeyPrefix = configConfig.KeyPrefix;
            RefreshIntervalSeconds = configConfig.RefreshIntervalSeconds;
        }
    }
} 