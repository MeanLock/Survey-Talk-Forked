namespace SurveyTalkService.Common.AppConfigurations.Redis.interfaces
{
    public interface IRedisAnalyticsConfig
    {
        string KeyPrefix { get; set; }
        int RetentionDays { get; set; }
    }
} 