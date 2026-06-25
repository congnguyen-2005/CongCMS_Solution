using CMS.data;
using CMS.data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Authorize] // Bắt buộc đăng nhập Admin
    [ApiExplorerSettings(IgnoreApi = true)] // Ẩn khỏi Swagger vì đây là trả về giao diện HTML
    public class MenuController : Controller
    {
        private readonly ApplicationDbContext _context;
        public MenuController(ApplicationDbContext context) => _context = context;

        // 1. HIỂN THỊ DANH SÁCH MENU
        public IActionResult Index()
        {
            var data = _context.Menus.OrderBy(m => m.DisplayOrder).ToList();
            return View(data);
        }

        // 2. THÊM MENU
        // 2. THÊM MENU
        [HttpGet]
        public IActionResult Create() => View();

        [HttpPost]
        public IActionResult Create(Menu model)
        {
            if (ModelState.IsValid)
            {
                // 🌟 THÊM DÒNG NÀY: Xóa sổ ID rác từ Form gửi lên, giao quyền tự tăng cho SQL Server
                model.Id = 0;

                _context.Menus.Add(model);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(model);
        }

        // 3. SỬA MENU
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var item = _context.Menus.Find(id);
            if (item == null) return NotFound();
            return View(item);
        }

        [HttpPost]
        public IActionResult Edit(Menu model)
        {
            if (ModelState.IsValid)
            {
                _context.Menus.Update(model);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(model);
        }

        // 4. XÓA MENU
        public IActionResult Delete(int id)
        {
            var item = _context.Menus.Find(id);
            if (item != null)
            {
                _context.Menus.Remove(item);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}