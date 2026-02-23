namespace SurveyTalkService.Common.AppConfigurations.Redis.interfaces
{
    public interface IRedisCacheConfig
    {
        string KeyPrefix { get; set; }
        int ExpirySeconds { get; set; }
        int SlidingExpirationSeconds { get; set; }
    }
}
