namespace SurveyTalkService.Common.AppConfigurations.Redis.interfaces
{
    public interface IRedisConfigConfig
    {
        string KeyPrefix { get; set; }
        int RefreshIntervalSeconds { get; set; }
    }
} 