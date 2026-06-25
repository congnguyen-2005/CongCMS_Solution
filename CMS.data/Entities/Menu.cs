using System.ComponentModel.DataAnnotations;

namespace CMS.data.Entities
{
    public class Menu
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } // Tên hiển thị (VD: Máy ảnh DSLR)

        [MaxLength(255)]
        public string LinkUrl { get; set; } // Đường dẫn (VD: /shop/dslr)

        public int? ParentId { get; set; } // Dùng nếu muốn làm Menu thả xuống (Dropdown)

        public int DisplayOrder { get; set; } // Số thứ tự ưu tiên hiển thị

        public bool IsActive { get; set; } = true; // Trạng thái Ẩn/Hiện
    }
}