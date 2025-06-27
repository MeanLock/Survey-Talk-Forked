namespace SurveyTalkService.Common.AppConfigurations.Redis.interfaces
{
    public interface IRedisSessionConfig
    {
        string KeyPrefix { get; set; }
        int ExpirySeconds { get; set; }
    }
} 