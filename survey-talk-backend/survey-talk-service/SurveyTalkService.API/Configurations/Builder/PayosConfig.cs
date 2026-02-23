

using Net.payOS;

namespace SurveyTalkService.API.Configurations.Builder
{
    public static class PayosConfig
    {

        public static void AddBuilderPayosConfig(this WebApplicationBuilder builder)
        {
            // builder.Services.AddSingleton(sp =>
            // {
            //     var payos = new PayOS(
            //         configuation["PayOS:ClientID"],
            //         configuation["PayOS:APIKey"],
            //         configuation["PayOS:ChecksumKey"]
            //         );
            //     return payos;
            // });


        }


    }
}
