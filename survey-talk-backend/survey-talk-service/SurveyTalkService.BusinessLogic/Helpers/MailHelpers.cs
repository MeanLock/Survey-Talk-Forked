using SurveyTalkService.Common.AppConfigurations.Mail.interfaces;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using System.Net.Mail;
using System.Net;
using System.IO;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Mvc.Rendering;
using FluentEmail.Core;
using SurveyTalkService.Common.AppConfigurations.Google.interfaces;
using Microsoft.AspNetCore.Hosting;
using UnDotNet.BootstrapEmail;

namespace SurveyTalkService.BusinessLogic.Helpers
{
    public class MailHelpers
    {
        private readonly IMailConfig _mailConfig;
        private readonly IRazorViewEngine _viewEngine;
        private readonly ITempDataProvider _tempDataProvider;
        private readonly IServiceProvider _serviceProvider;
        private IFluentEmail _fluentEmail;
        private IGoogleMailConfig _googleMailConfig;
        private readonly IHostingEnvironment _hostingEnvironment;



        public MailHelpers(
            IMailConfig mailConfig,
            IRazorViewEngine viewEngine,
            ITempDataProvider tempDataProvider,
            IServiceProvider serviceProvider,
            IFluentEmail fluentEmail,
            IGoogleMailConfig googleMailConfig,
            IHostingEnvironment hostingEnvironment
            )
        {
            _mailConfig = mailConfig;
            _viewEngine = viewEngine;
            _tempDataProvider = tempDataProvider;
            _serviceProvider = serviceProvider;
            _fluentEmail = fluentEmail;
            _googleMailConfig = googleMailConfig;
            _hostingEnvironment = hostingEnvironment;
        }

        // public async Task SendEmail(string to, string content)
        // {
        //     string basePath = AppDomain.CurrentDomain.BaseDirectory.TrimEnd(Path.DirectorySeparatorChar);
        //     Console.WriteLine($"Base Path: {basePath}");

        //     string templateFilePath = _googleMailConfig.ForgotPasswordTemplateViewPath;

        //     var model = new
        //     {
        //         Name = content
        //     };
        //     // await _fluentEmail.To(to)
        //     //     .Subject("TestEmail")
        //     //     .UsingTemplateFromFile(templateFilePath, model)
        //     //     .SendAsync();
        // }
        public async Task SendEmail(string to, object model, string templateFilePath, string subject)
        {

            try
            {

                
                string body = await RenderViewToStringAsync(templateFilePath, model);
                
                var compiler = new BootstrapCompiler(body);
                var result = compiler.Multipart();

                // Console.WriteLine($"Email body: {result}");
                await _fluentEmail.To(to)
                    .Subject(subject)
                    .Body(body, isHtml: true)
                    .SendAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending email: {ex.Message}");
                throw new Exception("Gửi mail thất bại", ex);
            }

        }

        // public async Task Send(string to, string templateFile)
        // {

        //     var model = new
        //     {
        //         Name = "CC"
        //     };
        //     string rawHtml = await _razorEngine.CompileRenderAsync(templateFile, model);

        //     // Step 2: Compile with BootstrapCompiler
        //     var compiler = new BootstrapCompiler(rawHtml);
        //     var result = compiler.Multipart(); // Or compiler.Html() if you only want HTML

        //     // Step 3: Send the compiled HTML
        //     await _fluentEmail
        //         .To(to)
        //         .Subject("Styled Email")
        //         .Body(result.Html, true)
        //         .SendAsync();
        // }

        public async Task<string> RenderViewToStringAsync(string viewName, object model)
        {
            var actionContext = new ActionContext(
                new DefaultHttpContext { RequestServices = _serviceProvider },
                new RouteData(),
                new ActionDescriptor()
            );

            using var sw = new StringWriter();
            var viewResult = _viewEngine.FindView(actionContext, viewName, false);

            if (!viewResult.Success)
                throw new FileNotFoundException($"View {viewName} not found.");

            var viewDictionary = new ViewDataDictionary(new EmptyModelMetadataProvider(), new ModelStateDictionary())
            {
                Model = model
            };

            var tempData = new TempDataDictionary(actionContext.HttpContext, _tempDataProvider);

            var viewContext = new ViewContext(
                actionContext,
                viewResult.View,
                viewDictionary,
                tempData,
                sw,
                new HtmlHelperOptions()
            );

            await viewResult.View.RenderAsync(viewContext);
            return sw.ToString();
        }
    }
}
