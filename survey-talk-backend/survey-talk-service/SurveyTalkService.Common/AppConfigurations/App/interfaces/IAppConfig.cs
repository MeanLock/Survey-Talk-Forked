namespace SurveyTalkService.Common.AppConfigurations.App.interfaces
{
    public interface IAppConfig
    {
        string? BASE_URL { get; set; }
        ResetPasswordConfig? RESET_PASSWORD { get; set; }
        string? IMAGE_SRC { get; set; }
        string? TIME_ZONE { get; set; }
        string? EMBEDDING_VECTOR_API_URL { get; set; }
    }
}
