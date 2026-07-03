using CMS.data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // 🌟 ĐÃ SỬA: Đổi chính xác về nhóm HeThongAPI để Swagger bốc về đúng vị trí tab số 2
    [ApiExplorerSettings(IgnoreApi = false, GroupName = "HeThongAPI")]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/products
        [HttpGet]
        public IActionResult GetAll()
        {
            var products = _context.Products
                .OrderByDescending(p => p.Id)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.StockQuantity,
                    CategoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : "Chưa phân loại"
                })
                .ToList();

            return Ok(products);
        }

        // GET: api/products/category/{categoryId}
        [HttpGet("category/{categoryId}")]
        public IActionResult GetByCategory(int categoryId)
        {
            var products = _context.Products
                .Where(p => p.CategoryProductId == categoryId)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.StockQuantity
                })
                .ToList();

            return Ok(products);
        }

        // GET: api/products/{id}
        [HttpGet("{id}")]
        public IActionResult GetDetail(int id)
        {
            var product = _context.Products.FirstOrDefault(p => p.Id == id);
            if (product == null)
            {
                return NotFound(new { message = "Không tìm thấy sản phẩm này" });
            }

            return Ok(product);
        }
        [HttpGet("hot-products")]
        public IActionResult GetHotProducts()
        {
            try
            {
                var hotProducts = (
                    from p in _context.Products
                    join od in _context.OrderDetails
                        on p.Id equals od.ProductId into g
                    select new
                    {
                        p.Id,
                        p.Name,
                        p.Price,
                        p.ImageUrl,
                        TotalSold = g.Sum(x => (int?)x.Quantity) ?? 0
                    })
                    .OrderByDescending(x => x.TotalSold)
                    .Take(3)
                    .ToList();

                return Ok(hotProducts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.ToString());
            }
        }
    }
    
}