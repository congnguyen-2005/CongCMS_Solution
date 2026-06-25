using System.ComponentModel.DataAnnotations;

namespace CMS.data.Entities
{
    public class Banner
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } // Tiêu đề quảng cáo

        [Required]
        public string ImageUrl { get; set; } // Link ảnh chụp banner

        [MaxLength(255)]
        public string TargetUrl { get; set; } // Link khi khách click vào ảnh

        public int DisplayOrder { get; set; } // Thứ tự xuất hiện

        public bool IsActive { get; set; } = true; // Trạng thái Ẩn/Hiện
    }
}