using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace CMS.data.Entities
{
    public class CategoryProduct
    {
        [Key]
        public int Id { get; set; }
        [Required(ErrorMessage = "Ten danh muc khong duoc de trong")]
        public string Name { get; set; }
        public string? Description { get; set; }
        public virtual ICollection<Product>? Products {  get; set; }
    }
}
