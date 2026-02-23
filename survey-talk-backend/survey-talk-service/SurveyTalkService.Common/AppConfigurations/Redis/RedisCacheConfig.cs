using Microsoft.Extensions.Configuration;
using SurveyTalkService.Common.AppConfigurations.AWS.interfaces;
using SurveyTalkService.Common.AppConfigurations.Redis.interfaces;

namespace SurveyTalkService.Common.AppConfigurations.Redis
{
    public class RedisCacheConfigModel
    {
        public string KeyPrefix { get; set; }
        public int ExpirySeconds { get; set; }
        public int SlidingExpirationSeconds { get; set; }
    }
    public class RedisCacheConfig : IRedisCacheConfig
    {
        public string KeyPrefix { get; set; }
        public int ExpirySeconds { get; set; }
        public int SlidingExpirationSeconds { get; set; }

        public RedisCacheConfig(IConfiguration configuration)
        {
            var cacheConfig = configuration.GetSection("Redis:Cache").Get<RedisCacheConfigModel>();
            KeyPrefix = cacheConfig.KeyPrefix;
            ExpirySeconds = cacheConfig.ExpirySeconds;
            SlidingExpirationSeconds = cacheConfig.SlidingExpirationSeconds;
        }
    }

}
