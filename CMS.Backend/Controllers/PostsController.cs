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
    [Authorize]
    [ApiExplorerSettings(IgnoreApi = false, GroupName = "HeThongAPI")] // Gom đúng vào cụm API hệ thống trên Swagger
    public class PostsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PostsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ========================================================
        // 1. LẤY TOÀN BỘ BÀI VIẾT (Hiển thị dạng danh bạ rút gọn)
        // URL: GET /api/Posts
        // ========================================================
        [HttpGet]
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
                    CategoryName = p.Category != null ? p.Category.Name : "Chưa phân loại"
                })
                .ToListAsync();

            return Ok(posts);
        }

        // ========================================================
        // 2. LẤY BÀI VIẾT THEO CHUYÊN MỤC TIN TỨC
        // URL: GET /api/Posts/category/5
        // ========================================================
        [HttpGet("category/{categoryId}")]
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
                    CategoryName = p.Category != null ? p.Category.Name : "Chưa phân loại"
                })
                .ToListAsync();

            return Ok(posts);
        }

        // ========================================================
        // 3. LẤY CHI TIẾT 1 BÀI VIẾT (Đã sửa: Chống lỗi vòng lặp Object Cycle)
        // URL: GET /api/Posts/5
        // ========================================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            // ĐỐI SÁCH: Sử dụng .Select() để phẳng hóa dữ liệu, bốc tách riêng trường Content 
            // giúp ngăn chặn việc sinh vòng lặp vô hạn gây sập ứng dụng ReactJS/Mobile
            var post = await _context.Posts
                .Include(p => p.Category)
                .Where(p => p.Id == id)
                .Select(p => new {
                    p.Id,
                    p.Title,
                    p.Content, // Lấy đầy đủ nội dung chi tiết bài viết
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
    }
}