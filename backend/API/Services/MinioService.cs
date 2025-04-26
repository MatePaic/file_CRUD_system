using API.Dtos;
using API.Models;
using Microsoft.Extensions.Options;
using Minio;
using Minio.ApiEndpoints;
using Minio.DataModel;
using Minio.DataModel.Args;

namespace API.Services;

public class MinioService : IMinioService
{
    private readonly MinioClient _minioClient;
    private readonly string _bucketName;

    public MinioService(IOptions<MinioSettings> settings)
    {
        var config = settings.Value;

        _minioClient = (MinioClient)new MinioClient()
            .WithEndpoint(config.Endpoint)
            .WithCredentials(config.AccessKey, config.SecretKey)
            .WithSSL(config.WithSSL)
            .Build();

        _bucketName = config.BucketName;
    }

    public async Task<string> UploadFileAsync(IFormFile file)
    {
        var objectName = $"{file.FileName}";

        using var stream = new MemoryStream();
        await file.CopyToAsync(stream);
        stream.Position = 0;

        var putArgs = new PutObjectArgs()
            .WithBucket(_bucketName)
            .WithObject(objectName)
            .WithStreamData(stream)
            .WithObjectSize(stream.Length)
            .WithContentType(file.ContentType);

        await _minioClient.PutObjectAsync(putArgs);
        return objectName;
    }

    [Obsolete]
    public async Task<List<FileInfoDto>> ListFilesAsync()
    {
        var listArgs = new ListObjectsArgs().WithBucket(_bucketName).WithRecursive(true);
        var files = new List<FileInfoDto>();
        var observable = _minioClient.ListObjectsAsync(listArgs);
        var completion = new TaskCompletionSource();

        var items = new List<Item>();
        observable.Subscribe(
            item => items.Add(item),
            ex => completion.TrySetException(ex),
            () => completion.TrySetResult());

        await completion.Task;

        foreach (var item in items)
        {
            files.Add(new FileInfoDto
            {
                Name = item.Key,
                Size = (long)item.Size,
                LastModified = (DateTime)item.LastModifiedDateTime
            });
        }

        return files;
    }

    public async Task<(MemoryStream Stream, string ContentType, string FileName)> DownloadFileAsync(string objectName)
    {
        var stat = await _minioClient.StatObjectAsync(new StatObjectArgs()
            .WithBucket(_bucketName)
            .WithObject(objectName));

        var stream = new MemoryStream();
        var getArgs = new GetObjectArgs()
            .WithBucket(_bucketName)
            .WithObject(objectName)
            .WithCallbackStream(async (inputStream, _) =>
            {
                await inputStream.CopyToAsync(stream);
                stream.Position = 0;
            });

        await _minioClient.GetObjectAsync(getArgs);

        var fileName = objectName.Contains('-') 
            ? string.Join("-", objectName.Split('-').Skip(1)) 
            : objectName;

        return (stream, stat.ContentType, fileName);
    }

    public async Task DeleteFileAsync(string objectName)
    {
        var removeArgs = new RemoveObjectArgs()
            .WithBucket(_bucketName)
            .WithObject(objectName);

        await _minioClient.RemoveObjectAsync(removeArgs);
    }

    public async Task<FileInfoDto> GetFileInfoAsync(string objectName)
    {
        var stat = await _minioClient.StatObjectAsync(new StatObjectArgs()
            .WithBucket(_bucketName)
            .WithObject(objectName));

        return new FileInfoDto
        {
            Name = objectName,
            Size = stat.Size,
            LastModified = stat.LastModified
        };
    }
}