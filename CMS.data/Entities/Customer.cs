using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; // Thêm dòng này

namespace CMS.data.Entities
{
    public class Customer
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // Cấu hình tự tăng
        public int Id { get; set; }

        [Required]
        public string Fullname { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        public string? Phone { get; set; }
        public string? Address { get; set; }

        [Required]
        public string Password { get; set; }

        public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}