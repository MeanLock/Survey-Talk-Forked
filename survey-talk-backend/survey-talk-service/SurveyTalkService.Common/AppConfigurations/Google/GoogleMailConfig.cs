using Microsoft.Extensions.Configuration;
using SurveyTalkService.Common.AppConfigurations.Google.interfaces;

namespace SurveyTalkService.Common.AppConfigurations.Google
{
    public class GoogleMailConfigModel
    {
        public string? FromEmail { get; set; }
        public string? FromName { get; set; }
        public string? SmtpUsername { get; set; }
        public string? SmtpPassword { get; set; }
        public string? SmtpHost { get; set; }
        public int SmtpPort { get; set; }
        public bool EnableSsl { get; set; }
        public string? ForgotPasswordTemplateViewPath { get; set; }
    }
    public class GoogleMailConfig : IGoogleMailConfig
    {
        public string? FromEmail { get; set; }
        public string? FromName { get; set; }
        public string? SmtpUsername { get; set; }
        public string? SmtpPassword { get; set; }
        public string? SmtpHost { get; set; }
        public int SmtpPort { get; set; }
        public bool EnableSsl { get; set; }
        public string? ForgotPasswordTemplateViewPath { get; set; }
        public GoogleMailConfig(IConfiguration configuration)
        {
            var googleMailConfig = configuration.GetSection("Google:Mail").Get<GoogleMailConfigModel>();
            FromEmail = googleMailConfig?.FromEmail;
            FromName = googleMailConfig?.FromName;
            SmtpUsername = googleMailConfig?.SmtpUsername;
            SmtpPassword = googleMailConfig?.SmtpPassword;
            SmtpHost = googleMailConfig?.SmtpHost;
            SmtpPort = googleMailConfig?.SmtpPort ?? 0;
            EnableSsl = googleMailConfig?.EnableSsl ?? false;
            ForgotPasswordTemplateViewPath = googleMailConfig?.ForgotPasswordTemplateViewPath;
        }
    }
}
