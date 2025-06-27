using Microsoft.Extensions.Configuration;
using SurveyTalkService.Common.AppConfigurations.Payos.interfaces;

namespace SurveyTalkService.Common.AppConfigurations.Payos
{
    public class PayosConfigModel
    {
        public string ClientID { get; set; }
        public string APIKey { get; set; }
        public string ChecksumKey { get; set; }
        
    }
    public class PayosConfig : IPayosConfig
    {
        public string ClientID { get; set; }
        public string APIKey { get; set; }
        public string ChecksumKey { get; set; }
        public PayosConfig(IConfiguration configuration)
        {

            var filePaths = configuration.GetSection("PayOS").Get<PayosConfigModel>();
            ClientID = filePaths?.ClientID;
            APIKey = filePaths?.APIKey;
            ChecksumKey = filePaths?.ChecksumKey;
        }

    }
}
