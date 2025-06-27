using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Drawing;
using SurveyTalkService.Common.AppConfigurations.App.interfaces;
using SurveyTalkService.BusinessLogic.Services.AWSServices.S3;

namespace SurveyTalkService.BusinessLogic.Helpers
{
    public class ImageHelpers
    {
        private readonly IAppConfig _appConfig;
        private readonly FileHelpers _fileHelpers;
        private readonly AWSS3Service _awsS3Service;

        public ImageHelpers(
            IAppConfig appConfig,
            FileHelpers fileHelpers,
            AWSS3Service awsS3Service
        )
        {
            _appConfig = appConfig;
            _fileHelpers = fileHelpers;
            _awsS3Service = awsS3Service;
        }

        public async Task<string> GenerateImageUrl(string folderPath, string fileName, string type)
        {
            if (_appConfig.IMAGE_SRC == "awsS3")
            {
                return await _awsS3Service.GeneratePresignedUrlAsync(folderPath, fileName, type);
            }
            return await _fileHelpers.GetImageUrl(folderPath, fileName, type);
        }

        public async Task SaveBase64File(string base64Data, string folderPath, string fileName)
        {
            if (_appConfig.IMAGE_SRC == "awsS3")
            {
                await _awsS3Service.UploadBase64FileAsync(base64Data, folderPath, fileName);
                return;
            }
            await _fileHelpers.SaveBase64File(base64Data, folderPath, fileName);
        }

        public async Task CopyFile(string sourceFolder, string sourceFileName, string destinationFolder, string destinationFileName)
        {
            if (_appConfig.IMAGE_SRC == "awsS3")
            {
                await _awsS3Service.CopyFileAsync(sourceFolder, sourceFileName, destinationFolder, destinationFileName);
                return;
            }
            await _fileHelpers.CopyFile(sourceFolder, sourceFileName, destinationFolder, destinationFileName);
        }

        public async Task DeleteFolder(string folderPath)
        {
            if (_appConfig.IMAGE_SRC == "awsS3")
            {
                await _awsS3Service.DeleteFolderAsync(folderPath);
                return;
            }
            await _fileHelpers.DeleteFolder(folderPath);
        }

        public async Task DeleteFile(string folderName, string fileName)
        {
            if (_appConfig.IMAGE_SRC == "awsS3")
            {
                // await _awsS3Service.DeleteFileAsync(folderName, fileName);
                return;
            }
            await _fileHelpers.DeleteFile(folderName, fileName);
        }

        public async Task<string> GenerateImageBase64(string folderPath, string fileName, string type)
        {
            if (_appConfig.IMAGE_SRC == "awsS3")
            {
                // Lấy file từ S3, convert sang base64
                var fileBytes = await _awsS3Service.GetFileBytesAsync(folderPath, fileName, type);
                if (fileBytes == null) return null;
                string mimeType = type switch
                {
                    "jpg" or "jpeg" => "image/jpeg",
                    "png" => "image/png",
                    "gif" => "image/gif",
                    _ => "application/octet-stream"
                };
                return $"data:{mimeType};base64,{Convert.ToBase64String(fileBytes)}";
            }
            return await _fileHelpers.GetImageBase64(folderPath, fileName, type);
        }

    }
}
