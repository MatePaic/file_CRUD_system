using API.Dtos;

namespace API.Services;

public interface IMinioService
{
    Task<string> UploadFileAsync(IFormFile file);
    Task<List<FileInfoDto>> ListFilesAsync();
    Task<(MemoryStream Stream, string ContentType, string FileName)> DownloadFileAsync(string objectName);
    Task DeleteFileAsync(string objectName);
    Task<FileInfoDto> GetFileInfoAsync(string objectName);
}