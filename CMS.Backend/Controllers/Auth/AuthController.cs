using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System; // Cần thiết để dùng Exception
using CMS.data;
using CMS.data.Entities;

namespace CMS.Backend.Controllers.Auth
{
    [Route("api/[controller]")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "HeThongAPI")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ===================================================
        // 1. API ĐĂNG KÝ (Dành cho React RegisterPage)
        // ===================================================
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                var existingCustomer = await _context.Customers.FirstOrDefaultAsync(c => c.Email == request.Email);
                if (existingCustomer != null)
                {
                    return BadRequest(new { message = "Email này đã được đăng ký!" });
                }

                var newCustomer = new Customer
                {
                    Fullname = request.Fullname,
                    Email = request.Email,
                    Phone = request.Phone,
                    Address = request.Address,
                    Password = request.Password
                };

                _context.Customers.Add(newCustomer);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Tạo tài khoản thành công!",
                    user = new { id = newCustomer.Id, name = newCustomer.Fullname, email = newCustomer.Email, role = "Customer" }
                });
            }
            catch (Exception ex)
            {
                // Bắt lỗi của SQL Server và trả thẳng về React
                var exactError = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return StatusCode(500, new { message = "Lỗi SQL: " + exactError });
            }
        }

        // ===================================================
        // 2. API ĐĂNG NHẬP (Dành cho React LoginPage)
        // ===================================================
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email == request.Email && c.Password == request.Password);

            if (customer == null)
            {
                return BadRequest(new { message = "Email hoặc mật khẩu không chính xác!" });
            }

            return Ok(new
            {
                message = "Đăng nhập thành công!",
                user = new
                {
                    id = customer.Id,
                    name = customer.Fullname,
                    email = customer.Email,
                    role = "Customer"
                }
            });
        }
    }

    // ===================================================
    // DTO: CHIẾC GIỎ ĐÃ ĐƯỢC NÂNG CẤP ĐỂ HỨNG ĐỦ 5 TRƯỜNG TỪ REACT
    // ===================================================
    public class RegisterRequest
    {
        public string Fullname { get; set; } // Đổi Name thành Fullname
        public string Email { get; set; }
        public string Phone { get; set; }    // Thêm Phone
        public string Address { get; set; }  // Thêm Address
        public string Password { get; set; }
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}