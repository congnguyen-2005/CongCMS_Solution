using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System;
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

        // 1. API ĐĂNG KÝ
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
                return BadRequest(new { message = "Email và mật khẩu không được để trống!" });

            try
            {
                // Kiểm tra email tồn tại (Case-insensitive)
                var existingCustomer = await _context.Customers
                    .FirstOrDefaultAsync(c => c.Email.ToLower() == request.Email.ToLower());

                if (existingCustomer != null)
                    return BadRequest(new { message = "Email này đã được đăng ký!" });

                var newCustomer = new Customer
                {
                    Fullname = request.Fullname?.Trim(),
                    Email = request.Email.Trim(),
                    Phone = request.Phone?.Trim(),
                    Address = request.Address?.Trim(),
                    Password = request.Password // Khuyên dùng: Hash mật khẩu tại đây
                };

                _context.Customers.Add(newCustomer);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Tạo tài khoản thành công!",
                    user = new { id = newCustomer.Id, name = newCustomer.Fullname, email = newCustomer.Email }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống: " + ex.Message });
            }
        }

        // 2. API ĐĂNG NHẬP
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.Email))
                return BadRequest(new { message = "Thông tin đăng nhập không hợp lệ" });

            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email.ToLower() == request.Email.Trim().ToLower());

            if (customer == null)
                return BadRequest(new { message = "Email không tồn tại" });

            // Sử dụng Trim() để tránh lỗi khoảng trắng thừa từ Database hoặc từ Client
            if (customer.Password?.Trim() != request.Password?.Trim())
                return BadRequest(new { message = "Sai mật khẩu" });

            return Ok(new
            {
                message = "Đăng nhập thành công!",
                user = new { id = customer.Id, name = customer.Fullname, email = customer.Email }
            });
        }
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.NewPassword))
            {
                return BadRequest(new { message = "Email và mật khẩu mới không được để trống." });
            }

            var customer = await _context.Customers
                .FirstOrDefaultAsync(x => x.Email.ToLower() == request.Email.Trim().ToLower());

            if (customer == null)
            {
                return BadRequest(new { message = "Email không tồn tại." });
            }

            customer.Password = request.NewPassword.Trim();

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Đổi mật khẩu thành công."
            });
        }
    }

    public class RegisterRequest
    {
        public string Fullname { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string Password { get; set; }
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
    public class ForgotPasswordRequest
    {
        public string Email { get; set; }
        public string NewPassword { get; set; }
    }
}