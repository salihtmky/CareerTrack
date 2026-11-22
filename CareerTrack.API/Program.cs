using CareerTrack.API.Models;
using CareerTrack.API.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5500")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("Frontend");

app.MapGet("/", () =>
{
    return "CareerTrack API çalışıyor!";
});

app.MapGet("/api/companies", async (AppDbContext db) =>
{
    var companies = await db.Companies.ToListAsync();

    return Results.Ok(companies);
});
app.MapPost("/api/companies", async (Company company, AppDbContext db) =>
{
    db.Companies.Add(company);
    await db.SaveChangesAsync();

    return Results.Created($"/api/companies/{company.Id}", company);
});
app.MapGet("/api/applications", async (AppDbContext db) =>
{
    var applications = await db.Applications
        .Include(a => a.Company)
        .ToListAsync();

    return Results.Ok(applications);
});
app.MapPost("/api/applications", async (Application application, AppDbContext db) =>
{
    db.Applications.Add(application);
    await db.SaveChangesAsync();

    return Results.Created($"/api/applications/{application.Id}", application);
});
app.MapDelete("/api/applications/{id}", async (int id, AppDbContext db) =>
{
    var application = await db.Applications.FindAsync(id);

    if (application is null)
    {
        return Results.NotFound();
    }

    db.Applications.Remove(application);
    await db.SaveChangesAsync();

    return Results.NoContent();
});
app.MapPut("/api/applications/{id}", async (int id, Application updatedApplication, AppDbContext db) =>
{
    var application = await db.Applications.FindAsync(id);

    if (application is null)
    {
        return Results.NotFound();
    }

    application.CompanyId = updatedApplication.CompanyId;
    application.Position = updatedApplication.Position;
    application.ApplicationType = updatedApplication.ApplicationType;
    application.Status = updatedApplication.Status;
    application.ApplicationDate = updatedApplication.ApplicationDate;
    application.JobUrl = updatedApplication.JobUrl;
    application.Notes = updatedApplication.Notes;

    await db.SaveChangesAsync();

    return Results.Ok(application);
});
app.Run();