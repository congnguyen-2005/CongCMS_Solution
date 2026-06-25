using CMS.data;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.SwaggerGen; // Bắt buộc để dùng hàm TryGetMethodInfo

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
    // Cụm tài liệu 1: Quản lý các cổng giao diện điều hướng Admin
    c.SwaggerDoc("GiaoDienAdmin", new global::Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "ThaiCMS - Giao Diện Admin",
        Version = "v1",
        Description = "Hệ thống quản lý điều hướng các trang chức năng MVC View (.cshtml)"
    });

    // Cụm tài liệu 2: Quản lý hệ thống API thô (JSON) phục vụ Mobile App / ReactJS
    c.SwaggerDoc("HeThongAPI", new global::Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "ThaiCMS - Hệ Thống API Kết Nối",
        Version = "v1",
        Description = "Các đầu cổng dịch vụ xử lý dữ liệu bất đồng bộ trả về chuỗi JSON thô"
    });

    // BỘ LỌC ĐỒNG BỘ: Ép Swagger tự động nhặt Controller bỏ vào đúng nhóm dựa trên GroupName
    c.DocInclusionPredicate((docName, apiDesc) => apiDesc.GroupName == docName);

    // Giúp Swagger lấy chính xác tên hàm làm ID hành động để chạy test, tránh trùng lặp endpoint
    c.CustomOperationIds(apiDesc => apiDesc.TryGetMethodInfo(out var methodInfo) ? methodInfo.Name : null);
});

// Cấu hình chính sách CORS (Mở cửa cho ReactJS hoặc các ứng dụng bên thứ ba gọi API)
builder.Services.AddCors(options => {
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Cho phép ReactJS ở port 3000 gọi tới
              .AllowAnyHeader()                     // Cho phép mọi loại Header (Content-Type, Authorization...)
              .AllowAnyMethod()                     // Cho phép mọi phương thức HTTP (GET, POST, PUT, DELETE)
              .AllowCredentials();                  // Hỗ trợ truyền Cookie/Session nếu cần sau này
    });
});

// Cấu hình bảo mật Cookie (Tự động chặn quyền & chuyển hướng trang 401, 403)
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        // Khi người dùng chưa đăng nhập cố tình vào trang quản trị (401), tự đẩy về trang đăng nhập
        options.LoginPath = "/Account/Login";

        // Khi tài khoản Editor cố tình truy cập vào vùng Admin (403), tự đẩy về trang AccessDenied
        options.AccessDeniedPath = "/Account/AccessDenied";

        // Thời gian duy trì phiên làm việc Cookie trên trình duyệt
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
app.UseStaticFiles();

// KÍCH HOẠT SWAGGER & ĐỊNH TUYẾN GIAO DIỆN KIỂM THỬ TÁCH BIỆT KHÔNG GÂY LỖI 404
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    // Tạo 2 dòng tùy chọn tài liệu trên thanh Dropdown nằm ở góc trên bên phải trang Swagger
    c.SwaggerEndpoint("/swagger/GiaoDienAdmin/swagger.json", "1. Hệ Thống Điều Hướng Admin");
    c.SwaggerEndpoint("/swagger/HeThongAPI/swagger.json", "2. Các API Phục Vụ Kết Nối");

    c.RoutePrefix = "swagger"; // Đường dẫn truy cập trang test: https://localhost:xxxx/swagger
});

// --- SẮP XẾP LẠI THỨ TỰ PIPELINE CHUẨN ĐỂ KHÔNG BỊ LẶP LINK ---
app.UseRouting();

// 1. Kích hoạt CORS (Dùng đúng tên "AllowReactApp" đã đăng ký ở trên)
app.UseCors("AllowReactApp");

// 2. Kiểm tra danh tính người dùng (Đọc Cookie) TRƯỚC
app.UseAuthentication();
app.UseStaticFiles();
// 3. Kiểm tra quyền truy cập vào Controller SAU
app.UseAuthorization();

// ===============================================================
// 3. KHU VỰC ĐỊNH TUYẾN PHÂN LUỒNG ÁNH XẠ (ROUTING MAP)
// ===============================================================

// Phân luồng A: Ánh xạ cấu trúc cho các Web API (Các hàm xử lý dữ liệu thô JSON)
app.MapControllers();

// Phân luồng B: Ánh xạ đường dẫn cho giao diện Web MVC truyền thức (.cshtml)
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();