using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CMS.data.Entities
{
    public class Product
    {
        [Key]
        public int Id { get; set; }
        // Trong class Product
        public virtual ICollection<OrderDetail>? OrderDetails { get; set; }
        [Required(ErrorMessage = "Ten san pham khong duoc de trong")]
        public string Name { get; set; }
        public string? Description { get; set; }

        [Range(0, double.MaxValue)]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
        public string? ImageUrl { get; set; }

        public int CategoryProductId { get; set; }

        [ForeignKey("CategoryProductId")]
        public virtual CategoryProduct? CategoryProduct { get; set; }
        //public object OrderDetails { get; set; }

        // ĐÃ XÓA DÒNG public object Category ĐỂ TRÁNH LỖI BIÊN DỊCH
    }
}