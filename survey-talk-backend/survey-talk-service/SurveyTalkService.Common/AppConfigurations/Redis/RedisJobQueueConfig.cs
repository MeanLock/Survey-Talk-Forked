using Microsoft.Extensions.Configuration;
using SurveyTalkService.Common.AppConfigurations.Redis.interfaces;

namespace SurveyTalkService.Common.AppConfigurations.Redis
{
    public class RedisJobQueueConfigModel
    {
        public string KeyPrefix { get; set; }
        public int MaxRetries { get; set; }
        public int RetryDelaySeconds { get; set; }
    }
    public class RedisJobQueueConfig : IRedisJobQueueConfig
    {
        public string KeyPrefix { get; set; }
        public int MaxRetries { get; set; }
        public int RetryDelaySeconds { get; set; }

        public RedisJobQueueConfig(IConfiguration configuration)
        {
            var jobQueueConfig = configuration.GetSection("Redis:JobQueue").Get<RedisJobQueueConfigModel>();
            KeyPrefix = jobQueueConfig.KeyPrefix;
            MaxRetries = jobQueueConfig.MaxRetries;
            RetryDelaySeconds = jobQueueConfig.RetryDelaySeconds;
        }
    }
} 