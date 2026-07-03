using CMS.Backend.Services;
using CMS.data;
using CMS.data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Crypto.Generators;
using System;
using System.Security.Cryptography;
using System.Threading.Tasks;


namespace CMS.Backend.Controllers.Auth
{
    [Route("api/[controller]")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "HeThongAPI")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly EmailService _emailService;

        public AuthController(ApplicationDbContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
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
                    Password = BCrypt.Net.BCrypt.HashPassword(request.Password)
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

            if (!BCrypt.Net.BCrypt.Verify(request.Password, customer.Password))
            {
                return BadRequest(new { message = "Sai mật khẩu" });
            }

            return Ok(new
            {
                message = "Đăng nhập thành công!",
                user = new { id = customer.Id, name = customer.Fullname, email = customer.Email }
            });
        }

        // 3. API QUÊN MẬT KHẨU
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.Email))
                return BadRequest(new { message = "Email không được để trống." });

            var customer = await _context.Customers
                .FirstOrDefaultAsync(x => x.Email.ToLower() == request.Email.ToLower());

            if (customer == null)
            {
                return BadRequest(new { message = "Email không tồn tại." });
            }

            string otp = GenerateOTP();
            customer.OtpCode = otp;
            customer.OtpExpireTime = DateTime.Now.AddMinutes(5);
            customer.IsOtpVerified = false;

            await _context.SaveChangesAsync();

            await _emailService.SendEmail(
                customer.Email,
                "Mã OTP đặt lại mật khẩu",
                $@"<h2>Xin chào {customer.Fullname}</h2>
                   <p>Mã OTP của bạn là:</p>
                   <h1>{otp}</h1>
                   <p>OTP có hiệu lực trong 5 phút.</p>"
            );

            return Ok(new { message = "Đã gửi OTP." });
        }

        // API TEST MAIL
        [HttpGet("test-mail")]
        public async Task<IActionResult> TestMail()
        {
            await _emailService.SendEmail(
                "cong.nguyen.t2005@gmail.com",
                "Kiểm tra Gmail",
                "<h2>Xin chào Thành Công!</h2><p>Nếu bạn nhận được email này thì EmailService đã hoạt động.</p>"
            );

            return Ok(new { message = "Đã gửi email thành công." });
        }

        // Hàm tạo OTP an toàn bảo mật hơn
        private string GenerateOTP()
        {
            return RandomNumberGenerator.GetInt32(100000, 999999).ToString();
        }
        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp(
    [FromBody] VerifyOtpRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Otp))
            {
                return BadRequest(new
                {
                    message = "Email hoặc OTP không được để trống."
                });
            }

            var customer = await _context.Customers
                .FirstOrDefaultAsync(x =>
                    x.Email.ToLower() == request.Email.Trim().ToLower());

            if (customer == null)
            {
                return BadRequest(new
                {
                    message = "Email không tồn tại."
                });
            }

            if (customer.OtpCode != request.Otp.Trim())
            {
                return BadRequest(new
                {
                    message = "OTP không chính xác."
                });
            }

            if (customer.OtpExpireTime == null ||
                customer.OtpExpireTime < DateTime.Now)
            {
                return BadRequest(new
                {
                    message = "OTP đã hết hạn."
                });
            }

            customer.IsOtpVerified = true;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Xác thực OTP thành công."
            });
        }
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(
    [FromBody] ResetPasswordRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.NewPassword) ||
                string.IsNullOrWhiteSpace(request.ConfirmPassword))
            {
                return BadRequest(new
                {
                    message = "Vui lòng nhập đầy đủ thông tin."
                });
            }

            if (request.NewPassword != request.ConfirmPassword)
            {
                return BadRequest(new
                {
                    message = "Xác nhận mật khẩu không đúng."
                });
            }

            var customer = await _context.Customers
                .FirstOrDefaultAsync(x =>
                    x.Email.ToLower() == request.Email.Trim().ToLower());

            if (customer == null)
            {
                return BadRequest(new
                {
                    message = "Email không tồn tại."
                });
            }

            // Kiểm tra đã xác thực OTP chưa
            if (!customer.IsOtpVerified)
            {
                return BadRequest(new
                {
                    message = "Bạn chưa xác thực OTP."
                });
            }

            // Lưu BCrypt Hash
            customer.Password =
                BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

            // Xóa OTP
            customer.OtpCode = null;

            customer.OtpExpireTime = null;

            customer.IsOtpVerified = false;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Đổi mật khẩu thành công."
            });
        }



    }


    // --- CÁC CLASS REQUEST (NẰM NGOÀI CONTROLLER, TRONG CÙNG NAMESPACE) ---
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
    }

    public class VerifyOtpRequest
    {
        public string Email { get; set; }
        public string Otp { get; set; }
    }

    public class ResetPasswordRequest
    {
        public string Email { get; set; }

        public string NewPassword { get; set; }

        public string ConfirmPassword { get; set; }
    }
}