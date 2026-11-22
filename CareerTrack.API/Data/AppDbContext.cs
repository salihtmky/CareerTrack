using CareerTrack.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CareerTrack.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Company> Companies { get; set; }

    public DbSet<Application> Applications { get; set; }
}