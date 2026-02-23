namespace SurveyTalkService.Common.AppConfigurations.Redis.interfaces
{
    public interface IRedisRateLimitConfig
    {
        string KeyPrefix { get; set; }
        int WindowSeconds { get; set; }
        int MaxRequests { get; set; }
    }
} 