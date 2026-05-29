using CMS.data;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;

        // "Tiêm" ApplicationDbContext vào Controller (Constructor Injection)
        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            // Lấy tất cả bài viết từ Database
            var posts = _context.Posts.ToList();

            // Truyền danh sách bài viết sang View
            return View(posts);
        }
    }
}