using Microsoft.Extensions.Configuration;
using SurveyTalkService.Common.AppConfigurations.Redis.interfaces;

namespace SurveyTalkService.Common.AppConfigurations.Redis
{
    public class RedisMessageQueueConfigModel
    {
        public string KeyPrefix { get; set; }
        public int ExpirySeconds { get; set; }
    }
    public class RedisMessageQueueConfig : IRedisMessageQueueConfig
    {
        public string KeyPrefix { get; set; }
        public int ExpirySeconds { get; set; }

        public RedisMessageQueueConfig(IConfiguration configuration)
        {
            var messageQueueConfig = configuration.GetSection("Redis:MessageQueue").Get<RedisMessageQueueConfigModel>();
            KeyPrefix = messageQueueConfig.KeyPrefix;
            ExpirySeconds = messageQueueConfig.ExpirySeconds;
        }
    }
} 