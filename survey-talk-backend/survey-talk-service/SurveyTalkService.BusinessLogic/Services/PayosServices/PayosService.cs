using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SurveyTalkService.Common.AppConfigurations.App.interfaces;
using SurveyTalkService.Common.AppConfigurations.FilePath.interfaces;
using SurveyTalkService.DataAccess.Data;
using SurveyTalkService.BusinessLogic.Helpers;
using SurveyTalkService.DataAccess.UOW;
using SurveyTalkService.DataAccess.Repositories.interfaces;
using SurveyTalkService.BusinessLogic.Services.AWSServices.S3;
using SurveyTalkService.DataAccess.Entities;

namespace SurveyTalkService.BusinessLogic.Services.PayosServices
{
    public class PayosService
    {
        // LOGGER
        private readonly ILogger<PayosService> _logger;

        // CONFIG
        public readonly IAppConfig _appConfig;
        private readonly IFilePathConfig _filePathConfig;

        public PayosService(
            ILogger<PayosService> logger,
            IAppConfig appConfig,
            IFilePathConfig filePathConfig
        )
        {
            _logger = logger;
            _appConfig = appConfig;
            _filePathConfig = filePathConfig;
        }

        


    }
}
