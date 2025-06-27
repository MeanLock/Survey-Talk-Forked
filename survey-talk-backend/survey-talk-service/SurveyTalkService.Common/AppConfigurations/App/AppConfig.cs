using Microsoft.Extensions.Configuration;
using SurveyTalkService.Common.AppConfigurations.App.interfaces;

namespace SurveyTalkService.Common.AppConfigurations.App
{
    public class ResetPasswordConfig
    {
        public string? Url { get; set; }
        public int TokenExpiredInMinutes { get; set; }
    }
    public class AppConfigModel
    {
        public string? BASE_URL { get; set; }
        public ResetPasswordConfig? RESET_PASSWORD { get; set; }
        public string? IMAGE_SRC { get; set; }
        public string? TIME_ZONE { get; set; }
        public string? EMBEDDING_VECTOR_API_URL { get; set; }
    }
    public class AppConfig : IAppConfig
    {
        public string? BASE_URL { get; set; }
        public ResetPasswordConfig? RESET_PASSWORD { get; set; }
        public string? IMAGE_SRC { get; set; }
        public string? TIME_ZONE { get; set; }
        public string? EMBEDDING_VECTOR_API_URL { get; set; }


        public AppConfig(IConfiguration configuration)
        {
            var appConfig = configuration.GetSection("AppSettings").Get<AppConfigModel>();
            BASE_URL = appConfig?.BASE_URL;
            IMAGE_SRC = appConfig?.IMAGE_SRC;
            TIME_ZONE = appConfig?.TIME_ZONE;
            RESET_PASSWORD = appConfig?.RESET_PASSWORD;
            EMBEDDING_VECTOR_API_URL = appConfig?.EMBEDDING_VECTOR_API_URL;
            // Console.WriteLine($"BASE_URL: {BASE_URL}");
            // Console.WriteLine($"IMAGE_SRC: {IMAGE_SRC}");
            // Console.WriteLine($"TIME_ZONE: {TIME_ZONE}");
            // Console.WriteLine($"RESET_PASSWORD_URL: {RESET_PASSWORD?.Url}");
            // Console.WriteLine($"RESET_PASSWORD_TOKEN_EXPIRED_IN_MINUTES: {RESET_PASSWORD?.TokenExpiredInMinutes}");

        }

        
    }
}
