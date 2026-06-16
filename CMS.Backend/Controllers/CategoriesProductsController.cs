using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.data;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    [ApiExplorerSettings(IgnoreApi = false, GroupName = "GiaoDienAdmin")]
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CategoriesProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoriesProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ========================================================
        // 1. LẤY TOÀN BỘ DANH MỤC SẢN PHẨM (Dạng JSON rút gọn)
        // URL: GET /api/CategoriesProducts
        // ========================================================
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var categories = await _context.CategoriesProducts
                    .OrderByDescending(c => c.Id)
                    .Select(c => new {
                        c.Id,
                        c.Name,
                        c.Description
                    })
                    .ToListAsync();

                return Ok(categories);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Lỗi kết nối cơ sở dữ liệu hệ thống",
                    detail = ex.Message
                });
            }
        }

        // ========================================================
        // 2. LẤY CHI TIẾT 1 DANH MỤC SẢN PHẨM THEO ID
        // URL: GET /api/CategoriesProducts/5
        // ========================================================
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetDetail(int id)
        {
            try
            {
                var category = await _context.CategoriesProducts
                    .Where(c => c.Id == id)
                    .Select(c => new {
                        c.Id,
                        c.Name,
                        c.Description
                    })
                    .FirstOrDefaultAsync();

                if (category == null)
                {
                    return NotFound(new { message = $"Không tìm thấy danh mục sản phẩm có ID bằng {id}" });
                }

                return Ok(category);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Lỗi xử lý hệ thống khi lấy chi tiết danh mục",
                    detail = ex.Message
                });
            }
        }
    }
}