using Microsoft.Extensions.Configuration;
using SurveyTalkService.Common.AppConfigurations.Google.interfaces;

namespace SurveyTalkService.Common.AppConfigurations.Google
{
    public class GoogleOAuth2ConfigModel
    {
        public string ClientId_generalTest { get; set; }
        public string ClientSecret_generalTest { get; set; }
    }
    public class GoogleOAuth2Config : IGoogleOAuth2Config
    {
        public string ClientId { get; set; }
        public string ClientSecret { get; set; }
        public GoogleOAuth2Config(IConfiguration configuration)
        {
            var googleOAuth2Config = configuration.GetSection("Google:OAuth2").Get<GoogleOAuth2ConfigModel>();
            ClientId = googleOAuth2Config.ClientId_generalTest;
            ClientSecret = googleOAuth2Config.ClientSecret_generalTest;
        }

        
    }
}
