namespace SurveyTalkService.Common.AppConfigurations.OpenAI.interfaces
{
    public interface IOpenAIConfig
    {
        string BaseUrl { get; set; }
        string BaseModel { get; set; }
        string ApiKey { get; set; }
    }
}
