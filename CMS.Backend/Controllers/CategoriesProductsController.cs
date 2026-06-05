using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.data;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoriesProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var categories = await _context.CategoriesProducts
                    .OrderBy(c => c.DisplayOrder)
                    .Select(c => new {
                        c.Id,
                        c.Name,
                        c.Description,
                        c.DisplayOrder,
                        c.IsActive
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
    }
}