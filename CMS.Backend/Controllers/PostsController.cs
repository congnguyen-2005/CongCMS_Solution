using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.data;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System; // Bắt buộc thêm để dùng hàm Math.Min

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [ApiExplorerSettings(IgnoreApi = false, GroupName = "HeThongAPI")]

    // 🔐 KHÓA TỔNG: Bật bảo vệ toàn bộ Controller. Ai không có vé (Token/Cookie) sẽ bị đuổi ra!
    [Authorize]
    public class PostsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PostsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ========================================================
        // 1. LẤY TOÀN BỘ BÀI VIẾT (Hiển thị ngoài trang chủ)
        // ========================================================
        [HttpGet]
        // 🟢 THẺ MIỄN TRỪ: Mở cửa riêng cho hàm này để khách vãng lai (ReactJS) có thể xem
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var posts = await _context.Posts
                .Include(p => p.Category)
                .OrderByDescending(p => p.Id)
                .Select(p => new {
                    p.Id,
                    p.Title,
                    p.ImageUrl,
                    p.CreatedDate,
                    CategoryName = p.Category != null ? p.Category.Name : "Chưa phân loại",
                    ShortDescription = string.IsNullOrEmpty(p.Content)
                                       ? ""
                                       : p.Content.Substring(0, Math.Min(p.Content.Length, 120)) + "..."
                })
                .ToListAsync();

            return Ok(posts);
        }

        // ========================================================
        // 2. LẤY BÀI VIẾT THEO CHUYÊN MỤC
        // ========================================================
        [HttpGet("category/{categoryId}")]
        [AllowAnonymous] // 🟢 THẺ MIỄN TRỪ
        public async Task<IActionResult> GetByCategory(int categoryId)
        {
            var posts = await _context.Posts
                .Include(p => p.Category)
                .Where(p => p.CategoryId == categoryId)
                .Select(p => new {
                    p.Id,
                    p.Title,
                    p.ImageUrl,
                    p.CreatedDate,
                    CategoryName = p.Category != null ? p.Category.Name : "Chưa phân loại",
                    ShortDescription = string.IsNullOrEmpty(p.Content)
                                       ? ""
                                       : p.Content.Substring(0, Math.Min(p.Content.Length, 120)) + "..."
                })
                .ToListAsync();

            return Ok(posts);
        }

        // ========================================================
        // 3. LẤY CHI TIẾT 1 BÀI VIẾT
        // ========================================================
        [HttpGet("{id}")]
        [AllowAnonymous] // 🟢 THẺ MIỄN TRỪ
        public async Task<IActionResult> GetDetail(int id)
        {
            var post = await _context.Posts
                .Include(p => p.Category)
                .Where(p => p.Id == id)
                .Select(p => new {
                    p.Id,
                    p.Title,
                    p.Content,
                    p.ImageUrl,
                    p.CreatedDate,
                    p.CategoryId,
                    CategoryName = p.Category != null ? p.Category.Name : "Chưa phân loại"
                })
                .FirstOrDefaultAsync();

            if (post == null)
            {
                return NotFound(new { message = "Không tìm thấy bài viết này trong hệ thống" });
            }

            return Ok(post);
        }

        // ⚠️ NẾU SAU NÀY BẠN VIẾT THÊM HÀM [HttpPost] TẠO BÀI VIẾT Ở ĐÂY:
        // Bạn không ghi [AllowAnonymous], hàm đó sẽ tự động được bảo vệ bởi khóa tổng [Authorize] ở trên cùng. Vô cùng an toàn!
    }
}