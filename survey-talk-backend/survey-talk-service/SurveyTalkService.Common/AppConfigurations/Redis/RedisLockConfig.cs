using Microsoft.Extensions.Configuration;
using SurveyTalkService.Common.AppConfigurations.Redis.interfaces;

namespace SurveyTalkService.Common.AppConfigurations.Redis
{
    public class RedisLockConfigModel
    {
        public string KeyPrefix { get; set; }
        public int ExpirySeconds { get; set; }
    }
    public class RedisLockConfig : IRedisLockConfig
    {
        public string KeyPrefix { get; set; }
        public int ExpirySeconds { get; set; }

        public RedisLockConfig(IConfiguration configuration)
        {
            var lockConfig = configuration.GetSection("Redis:Lock").Get<RedisLockConfigModel>();
            KeyPrefix = lockConfig.KeyPrefix;
            ExpirySeconds = lockConfig.ExpirySeconds;
        }
    }
} 