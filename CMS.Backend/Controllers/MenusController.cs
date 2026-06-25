using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.data;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [ApiExplorerSettings(IgnoreApi = false, GroupName = "HeThongAPI")]
    public class MenusController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MenusController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ========================================================
        // LẤY DANH SÁCH MENU ĐIỀU HƯỚNG HIỂN THỊ LÊN HEADER
        // URL: GET /api/Menus
        // ========================================================
        [HttpGet]
        [AllowAnonymous] // 🟢 Cực kỳ quan trọng: Mở khóa để ReactJS gọi lấy Menu mà không bị chặn
        public async Task<IActionResult> GetActiveMenus()
        {
            try
            {
                var menus = await _context.Menus
                    .Where(m => m.IsActive) // Chỉ lấy những Menu đang được bật
                    .OrderBy(m => m.DisplayOrder) // Sắp xếp đúng thứ tự 1, 2, 3...
                    .Select(m => new {
                        m.Id,
                        m.Name,
                        m.LinkUrl,
                        m.ParentId
                    })
                    .ToListAsync();

                return Ok(menus);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy dữ liệu Menu", detail = ex.Message });
            }
        }
    }
}