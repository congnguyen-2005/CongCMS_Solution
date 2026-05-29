using System.Diagnostics;
using CMS.Backend.Models;
using Microsoft.AspNetCore.Mvc;
// THÊM 3 DÒNG USING NÀY VÀO
using Microsoft.EntityFrameworkCore;
using CMS.data;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class HomeController : Controller
    {
        // 1. Khai báo biến _context thay cho _logger
        private readonly ApplicationDbContext _context;

        // 2. Tiêm ApplicationDbContext vào constructor
        public HomeController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 3. Sửa lại hàm Index để lấy 3 bài viết mới nhất
        public IActionResult Index()
        {
            // LINQ: Lấy 3 bài viết mới nhất kèm danh mục
            var latestPosts = _context.Posts
                              .Include(p => p.Category)
                              .OrderByDescending(p => p.CreatedDate)
                              .Take(3)
                              .ToList();

            // Truyền dữ liệu sang View
            return View(latestPosts);
        }

        // ========================================================
        // CÁC HÀM MẶC ĐỊNH BÊN DƯỚI CỨ GIỮ NGUYÊN KHÔNG CẦN ĐỤNG TỚI
        // ========================================================

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}