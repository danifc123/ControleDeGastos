using EFModels;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
var builder = WebApplication.CreateBuilder(args);

// CORS (para permitir o frontend React/Vite consumir a WebAPI no navegador)
const string CorsPolicyName = "FrontendCors";
builder.Services.AddCors(options =>
{
  options.AddPolicy(name: CorsPolicyName, policy =>
  {
    // Em dev, o Vite pode rodar em 5173/5174/5175, então liberamos qualquer porta em localhost.
    policy
      .SetIsOriginAllowed(origin =>
      {
        if (!Uri.TryCreate(origin, UriKind.Absolute, out var uri)) return false;
        return uri.Scheme is "http" or "https" && uri.Host.Equals("localhost", StringComparison.OrdinalIgnoreCase);
      })
      .AllowAnyHeader()
      .AllowAnyMethod();
  });
});

builder.Services.AddDbContext<ControleDeGastos>(options =>
options.UseNpgsql(builder.Configuration.GetConnectionString("ConexaoPadrao"),
        sqlOptions => sqlOptions.MigrationsAssembly(typeof(Program).Assembly.FullName)));

builder.Services.AddScoped<Repository.PessoaRepository>();
builder.Services.AddScoped<Service.PessoaService.PessoaService>();

builder.Services.AddScoped<Repository.CategoriaRepository.CategoriaRepository>();
builder.Services.AddScoped<Service.CategoriaService.CategoriaService>();

builder.Services.AddScoped<Repository.TransacaoRepository.TransacaoRepository>();
builder.Services.AddScoped<Service.TransacaoService.TransacaoService>();

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.MapOpenApi();
}

app.UseCors(CorsPolicyName);

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
