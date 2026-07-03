using CMS.data;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.SwaggerGen;

var builder = WebApplication.CreateBuilder(args);

// ==============================================================
// 1. KHU VỰC ĐĂNG KÝ DỊCH VỤ (SERVICES CONTAINER)
// ==============================================================

// Nhận diện cả MVC Controller (View) và API Controller
builder.Services.AddControllersWithViews();

// Cấu hình Kết nối Cơ sở dữ liệu SQL Server
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Cấu hình Hệ thống Swagger nâng cao chia thành 2 nhóm chuyên nghiệp
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("GiaoDienAdmin", new global::Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "ThaiCMS - Giao Diện Admin",
        Version = "v1",
        Description = "Hệ thống quản lý điều hướng các trang chức năng MVC View (.cshtml)"
    });

    c.SwaggerDoc("HeThongAPI", new global::Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "ThaiCMS - Hệ Thống API Kết Nối",
        Version = "v1",
        Description = "Các đầu cổng dịch vụ xử lý dữ liệu bất đồng bộ trả về chuỗi JSON thô"
    });

    c.DocInclusionPredicate((docName, apiDesc) => apiDesc.GroupName == docName);
    c.CustomOperationIds(apiDesc => apiDesc.TryGetMethodInfo(out var methodInfo) ? methodInfo.Name : null);
});

// 🌟 CẤU HÌNH CORS CHUẨN: Mở cửa cho ReactJS
builder.Services.AddCors(options => {
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Trỏ đúng cổng của React
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Cấu hình bảo mật Cookie
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login";
        options.AccessDeniedPath = "/Account/AccessDenied";
        options.ExpireTimeSpan = TimeSpan.FromMinutes(20);
    });

var app = builder.Build();

// ==============================================================
// 2. KHU VỰC CẤU HÌNH MIDDLEWARE (REQUEST PIPELINE)
// ==============================================================
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles(); // 🌟 Chỉ gọi 1 lần ở đây để nạp CSS/JS/Ảnh

// KÍCH HOẠT SWAGGER
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/GiaoDienAdmin/swagger.json", "1. Hệ Thống Điều Hướng Admin");
    c.SwaggerEndpoint("/swagger/HeThongAPI/swagger.json", "2. Các API Phục Vụ Kết Nối");
    c.RoutePrefix = "swagger";
});

// 🌟 SẮP XẾP THỨ TỰ PIPELINE CỐT LÕI (TUYỆT ĐỐI KHÔNG ĐẢO LỘN VỊ TRÍ NÀY)
app.UseRouting();

// CORS bắt buộc phải nằm giữa Routing và Auth
app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

// ===============================================================
// 3. KHU VỰC ĐỊNH TUYẾN PHÂN LUỒNG ÁNH XẠ (ROUTING MAP)
// ===============================================================

// Phân luồng A: Cho Web API
app.MapControllers();

// Phân luồng B: Cho Web MVC (.cshtml)
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.PropertyNamingPolicy = null; // Giữ nguyên chữ hoa/thường của C#
    });