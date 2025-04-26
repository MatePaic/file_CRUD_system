namespace API.Dtos;

public class FileInfoDto
{
    public string Name { get; set; }
    public long Size { get; set; }
    public DateTime LastModified { get; set; }
}