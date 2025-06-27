

using System.Net;
using System.Net.Mail;
using SurveyTalkService.Common.AppConfigurations.Google;

namespace SurveyTalkService.API.Configurations.Builder
{
    public static class FluentEmailConfig
    {
        public static void AddBuilderFluentEmailConfig(this WebApplicationBuilder builder)
        {
            var googleMailConfig = builder.Configuration.GetSection("Google:Mail").Get<GoogleMailConfigModel>();

            var defaultFromEmail = googleMailConfig.FromEmail;
            var host = googleMailConfig.SmtpHost;
            var port = googleMailConfig.SmtpPort;
            var username = googleMailConfig.SmtpUsername;
            var password = googleMailConfig.SmtpPassword;

            builder.Services.AddFluentEmail(defaultFromEmail)
                .AddRazorRenderer()
                // .AddSmtpSender(host, port, username, password);
                .AddSmtpSender(new SmtpClient(googleMailConfig.SmtpHost)
                {
                    Port = googleMailConfig.SmtpPort,
                    Credentials = new NetworkCredential(googleMailConfig.SmtpUsername, googleMailConfig.SmtpPassword),
                    EnableSsl = googleMailConfig.EnableSsl
                });
        }
        // public static void AddBuilderFluentEmailConfig(this WebApplicationBuilder builder)
        // {
        //     var emailSettings = builder.Configuration.GetSection("Mail");

        //     var defaultFromEmail = emailSettings["FromEmail"];
        //     var host = emailSettings["SmtpHost"];
        //     var port = emailSettings.GetValue<int>("SmtpHost");
        //     var username = emailSettings["Username"];
        //     var password = emailSettings["SmtpPassword"];

        //     builder.Services.AddFluentEmail(defaultFromEmail)
        //         .AddRazorRenderer()
        //         .AddSmtpSender(host, port, username, password);

        // }

    }
}
