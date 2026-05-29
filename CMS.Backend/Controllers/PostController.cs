using CMS.data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; 
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Thêm int? id vào tham số
        public IActionResult Index(int? id)
        {
            // 1. Kiểm tra nếu không có id truyền vào thì báo lỗi
            if (id == null)
            {
                return BadRequest("Vui lòng cung cấp mã danh mục (Ví dụ: /Post/Index/1).");
            }

            // 2. Sử dụng LINQ để lọc, sắp xếp và kết nối bảng
            var posts = _context.Posts
                .Where(p => p.CategoryId == id) 
                .OrderByDescending(p => p.CreatedDate)
                .Include(p => p.Category) 
                .ToList();

            // 3. Truyền dữ liệu ra View
            return View(posts);
        }
    }
}