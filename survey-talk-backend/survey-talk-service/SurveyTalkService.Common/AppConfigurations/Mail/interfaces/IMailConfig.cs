namespace SurveyTalkService.Common.AppConfigurations.Mail.interfaces
{
    public interface IMailConfig
    {
        string FromEmail { get; set; }
        string FromName { get; set; }
        string SmtpPassword { get; set; }
        string SmtpHost { get; set; }
        int SmtpPort { get; set; }
        bool EnableSsl { get; set; }
        // string SmtpUser { get; set; }
        // bool UseDefaultCredentials { get; set; }
        // bool IsBodyHtml { get; set; }

    }
}
