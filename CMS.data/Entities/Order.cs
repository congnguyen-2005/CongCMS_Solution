using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CMS.data.Entities
{
    public class Order
    {
        [Key]
        public int Id { get; set; }

        public DateTime OrderDate { get; set; }

        // ĐÃ ĐỒNG BỘ: Kiểu decimal để lưu trữ tiền tệ khớp với câu lệnh SQL ở Bước 1
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        public string? Status { get; set; }

        // ĐÃ BỔ SUNG: Khai báo lại trường này để khớp với cột 'Notes' đang có trong DB của bạn
        public string? Notes { get; set; }

        public int CustomerId { get; set; }

        [ForeignKey("CustomerId")]
        public virtual Customer? Customer { get; set; }
    }
}