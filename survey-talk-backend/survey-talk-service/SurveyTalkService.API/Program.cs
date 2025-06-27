using SurveyTalkService.API.Configurations.App;
using SurveyTalkService.API.Configurations.Builder;
using SurveyTalkService.BusinessLogic;
using SurveyTalkService.Common;
using SurveyTalkService.DataAccess;
using SurveyTalkService.DataAccess.Seeders;

namespace SurveyTalkService.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add Layers
            builder.Services.AddCommonLayer();
            builder.Services.AddBusinessLogicLayer();
            builder.Services.AddDataAccessLayer(builder.Configuration);


            // appConf
            builder.AddBuilderDefaultConfig();
            builder.AddBuilderCorsConfig();

            // authConf
            builder.AddBuilderAuthenticationConfig();
            builder.AddBuilderAuthorizationConfig();

            // graphQLConf
            builder.AddBuilderGraphQLConfig();

            // redisConf
            builder.AddBuilderRedisConfig();

            // signalRConf
            builder.AddBuilderSignalRConfig();

            // fluentEmailConf
            builder.AddBuilderFluentEmailConfig();

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            // builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Configure the HTTP request pipeline.

            app.AppAppDefaultConfig();

            app.AddAppCorsConfig();

            app.AddAppMiddlewareConfig();

            app.AddSignalRConfig();

            app.MapControllers();

            app.AddAppGraphQLConfig(); 

            app.AddAppIdentityServerConfig(args);

            app.Run();
        }
    }
}
