namespace SurveyTalkService.Common.AppConfigurations.Redis.interfaces
{
    public interface IRedisLockConfig
    {
        string KeyPrefix { get; set; }
        int ExpirySeconds { get; set; }
    }
} 