using System;
using System.Collections.Generic;
using System.Fabric;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.ServiceFabric.Services.Communication.AspNetCore;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using Microsoft.ServiceFabric.Data;
using Microsoft.EntityFrameworkCore;
using UsersService.Database;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Common.Interfaces;
using UsersService.Service;
using Microsoft.OpenApi.Models;

namespace UsersService
{
    /// <summary>
    /// The FabricRuntime creates an instance of this class for each service type instance.
    /// </summary>
    internal sealed class UsersService : StatelessService
    {
        public UsersService(StatelessServiceContext context)
            : base(context)
        { }

        /// <summary>
        /// Optional override to create listeners (like tcp, http) for this service instance.
        /// </summary>
        /// <returns>The collection of listeners.</returns>
        protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
        {
            return new ServiceInstanceListener[]
            {
                new ServiceInstanceListener(serviceContext =>
                    new KestrelCommunicationListener(serviceContext, "ServiceEndpoint", (url, listener) =>
                    {
                        ServiceEventSource.Current.ServiceMessage(serviceContext, $"Starting Kestrel on {url}");

                        //var fact = new UserDbContextFactory();
                        //var dbcont = fact.CreateDbContext([]);
                        var builder = WebApplication.CreateBuilder();

                        builder.Services.AddDbContext<UserDbContext>(options =>
                            options.UseSqlServer(builder.Configuration.GetConnectionString("UserDatabase"),
                                sqlOptions => sqlOptions.EnableRetryOnFailure()));

                        //var x = builder.Configuration.GetConnectionString("UserDatabase");

                        builder.Services.AddAutoMapper(typeof(UsersService).Assembly);
                        builder.Services.AddScoped<IUserService, UserService>();
                        var x = builder.Configuration.GetConnectionString("UserDatabase");

                        builder.Services.AddSingleton<StatelessServiceContext>(serviceContext);
                        builder.WebHost
                                    .UseKestrel()
                                    .UseContentRoot(Directory.GetCurrentDirectory())
                                    .UseServiceFabricIntegration(listener, ServiceFabricIntegrationOptions.None)
                                    .UseUrls(url);
                        builder.Services.AddControllers();
                        builder.Services.AddEndpointsApiExplorer();
                         builder.Services.AddSwaggerGen();

                        builder.Services.AddCors(options =>
                        {
                            options.AddPolicy("AllowSpecificOrigins", policy =>
                            {
                                policy.WithOrigins("http://localhost:8005") 
                                      .AllowAnyHeader()
                                      .AllowAnyMethod()
                                      .AllowCredentials()
                                      .SetPreflightMaxAge(TimeSpan.FromMinutes(10)); 
                            });
                        });

                        builder.Services.AddAuthentication(opt =>
                        {
                            opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                            opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                        }).AddJwtBearer(options =>
                        {
                            options.TokenValidationParameters = new TokenValidationParameters //Podesavamo parametre za validaciju pristiglih tokena
                            {
                                ValidateIssuer = true, //Validira izdavaoca tokena
                                ValidateAudience = false, //Kazemo da ne validira primaoce tokena
                                ValidateLifetime = true,//Validira trajanje tokena
                                ValidateIssuerSigningKey = true, //validira potpis token, ovo je jako vazno!
                                ValidIssuer = builder.Configuration["tokenAddress"], //odredjujemo koji server je validni izdavalac
                                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["SecretKey"]))//navodimo privatni kljuc kojim su potpisani nasi tokeni
                            };
                        });

                        /*var key = Encoding.ASCII.GetBytes(builder.Configuration["Jwt:Key"]);
                        builder.Services.AddAuthentication(options =>
                        {
                            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                        })
                        .AddJwtBearer(options =>
                        {
                            options.RequireHttpsMetadata = false;
                            options.SaveToken = true;
                            options.TokenValidationParameters = new TokenValidationParameters
                            {
                                ValidateIssuerSigningKey = true,
                                IssuerSigningKey = new SymmetricSecurityKey(key),
                                ValidateIssuer = true,
                                ValidIssuer = builder.Configuration["Jwt:Issuer"],
                                ValidateAudience = true,
                                ValidAudience = builder.Configuration["Jwt:Audience"]
                            };
                        });*/


                        var app = builder.Build();
                       if (app.Environment.IsDevelopment())
                        {
                            app.UseSwagger();
                            app.UseSwaggerUI();
                        }
                        app.UseCors("AllowSpecificOrigins");
                        app.Use(async (context, next) =>
                        {
                            context.Response.Headers.Add("Cross-Origin-Opener-Policy", "same-origin");
                            context.Response.Headers.Add("Cross-Origin-Embedder-Policy", "require-corp");
                            await next();
                        });

                        app.UseRouting();
                        //app.UseHttpsRedirection();
                        app.UseStaticFiles();
                        app.UseAuthentication();
                        app.UseAuthorization();
                        app.MapControllers();

                        return app;
                    }))
            };
        }
    }
}
