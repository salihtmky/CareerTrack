namespace CareerTrack.API.Models;

public class Application
{
    public int Id { get; set; }

    public int CompanyId { get; set; }

    public Company Company { get; set; } = null!;

    public string Position { get; set; } = string.Empty;

    public string ApplicationType { get; set; } = string.Empty;

    public string Status { get; set; } = string.Empty;

    public DateTime ApplicationDate { get; set; }

    public string? JobUrl { get; set; }

    public string? Notes { get; set; }
}
