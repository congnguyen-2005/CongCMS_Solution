using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CMS.data.Entities
{
    public class Customer
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public string Fullname { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        public string? Phone { get; set; }

        public string? Address { get; set; }

        // Sau này sẽ lưu BCrypt Hash
        [Required]
        public string Password { get; set; }

        // ===== OTP =====

        // Mã OTP gồm 6 số
        public string? OtpCode { get; set; }

        // Thời gian hết hạn OTP
        public DateTime? OtpExpireTime { get; set; }

        // Đã xác thực OTP hay chưa
        public bool IsOtpVerified { get; set; } = false;

        public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}