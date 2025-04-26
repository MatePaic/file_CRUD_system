using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FilesController : ControllerBase
{
    private readonly IMinioService _minioService;

    public FilesController(IMinioService minioService)
    {
        _minioService = minioService;
    }

    [HttpPost]
    public async Task<IActionResult> Upload(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded");

        var objectName = await _minioService.UploadFileAsync(file);

        return Ok(new { objectName });
    }

    [HttpGet]
    public async Task<IActionResult> ListFiles()
    {
        var files = await _minioService.ListFilesAsync();

        return Ok(files);
    }

    [HttpGet("{objectName}")]
    public async Task<IActionResult> GetFileInfo(string objectName)
    {
        try
        {
            var fileInfo = await _minioService.GetFileInfoAsync(objectName);
            return Ok(fileInfo);
        }
        catch (Exception ex)
        {
            return NotFound($"File not found: {ex.Message}");
        }
    }


    [HttpGet("download/{objectName}")]
    public async Task<IActionResult> Download(string objectName)
    {
        try
        {
            var (stream, contentType, fileName) = await _minioService.DownloadFileAsync(objectName);

            return File(stream, contentType, fileName);
        }
        catch (Exception ex)
        {
            return NotFound($"File not found: {ex.Message}");
        }
    }

    [HttpDelete("{objectName}")]
    public async Task<IActionResult> Delete(string objectName)
    {
        try
        {
            var fileInfo = await _minioService.GetFileInfoAsync(objectName);
            await _minioService.DeleteFileAsync(objectName);

            return NoContent();
        }
        catch (Exception ex)
        {
            return NotFound($"File not found: {ex.Message}");
        }
    }
}
