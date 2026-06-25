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
    public class BannersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BannersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ========================================================
        // LẤY DANH SÁCH BANNER QUẢNG CÁO HIỂN THỊ LÊN TRANG CHỦ
        // URL: GET /api/Banners
        // ========================================================
        [HttpGet]
        [AllowAnonymous] // 🟢 Mở khóa để ReactJS lấy Banner
        public async Task<IActionResult> GetActiveBanners()
        {
            try
            {
                var banners = await _context.Banners
                    .Where(b => b.IsActive) // Chỉ lấy những Banner đang được bật
                    .OrderBy(b => b.DisplayOrder) // Sắp xếp đúng thứ tự slide
                    .Select(b => new {
                        b.Id,
                        b.Title,
                        b.ImageUrl,
                        b.TargetUrl
                    })
                    .ToListAsync();

                return Ok(banners);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy dữ liệu Banner", detail = ex.Message });
            }
        }
    }
}