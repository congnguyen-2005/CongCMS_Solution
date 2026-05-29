using CMS.data;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Tiêm ApplicationDbContext vào Controller thông qua Constructor
        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Action hiển thị danh sách thành viên
        public IActionResult Index()
        {
            // Lấy toàn bộ danh sách thành viên từ bảng Users trong Database
            var users = _context.Users.ToList();

            // Truyền danh sách này sang giao diện (View)
            return View(users);
        }
    }
}