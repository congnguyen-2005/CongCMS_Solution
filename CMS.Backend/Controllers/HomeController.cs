using System.Diagnostics;
using CMS.Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.data;
using System.Linq;

namespace CMS.Backend.Controllers
{
    // 🌟 ĐÃ ĐỒNG BỘ: Đưa Home vào đúng nhóm và cấu trúc tuyến đường phẳng giống Post/Product
    [ApiExplorerSettings(IgnoreApi = false, GroupName = "GiaoDienAdmin")]
    [Route("[controller]/[action]")]
    public class HomeController : Controller
    {
        private readonly ApplicationDbContext _context;

        public HomeController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ========================================================
        // 1. TRANG CHỦ NGƯỜI DÙNG (Chấp nhận cả link gốc "/" và "/Home/Index")
        // ========================================================
        [HttpGet("~/")]
        [HttpGet]
        public IActionResult Index()
        {
            var viewModel = new HomeViewModel
            {
                LatestPosts = _context.Posts
                              .Include(p => p.Category)
                              .OrderByDescending(p => p.CreatedDate)
                              .Take(3)
                              .ToList(),

                FeaturedProducts = _context.Products
                                  .Include(p => p.CategoryProduct)
                                  .OrderByDescending(p => p.Id)
                                  .Take(6)
                                  .ToList()
            };

            return View(viewModel);
        }

        // ========================================================
        // 2. CÁC TRANG MẶC ĐỊNH HỆ THỐNG
        // ========================================================
        [HttpGet]
        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        [HttpGet]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        // ========================================================
        // 3. BẢNG ĐIỀU KHIỂN ADMIN (URL chuẩn: /Home/Dashboard)
        // ========================================================
        [HttpGet]
        public IActionResult Dashboard()
        {
            ViewBag.TotalPosts = _context.Posts.Count();
            ViewBag.TotalUsers = _context.Users.Count();
            ViewBag.TotalCategories = _context.Categories.Count();
            ViewBag.TotalProducts = _context.Products.Count();

            return View();
        }
    }
}