using CMS.data;
using CMS.data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Authorize]
    [ApiExplorerSettings(IgnoreApi = false, GroupName = "GiaoDienAdmin")]
    [Route("[controller]/[action]")]
    public class CategoryController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CategoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ========================================================
        // 🌟 LẤY DỮ LIỆU JSON THUẦN TÚY CỦA 1 DANH MỤC
        // ========================================================
        [HttpGet("{id}")]
        public IActionResult GetJson(int id)
        {
            var item = _context.Categories.FirstOrDefault(c => c.Id == id);
            if (item == null)
            {
                return NotFound(new { message = $"Không tìm thấy danh mục có ID bằng {id}" });
            }
            return Ok(new { item.Id, item.Name, item.Description });
        }

        [HttpGet]
        public IActionResult Index()
        {
            var categories = _context.Categories.OrderByDescending(c => c.Id).ToList();
            return View(categories);
        }

        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // 🌟 HÀM TẠO MỚI DANH MỤC (CHUẨN)
        [HttpPost]
        public IActionResult Create(Category model)
        {
            if (string.IsNullOrEmpty(model.Name))
            {
                ModelState.AddModelError("Name", "Tên danh mục không được để trống.");
                return View(model);
            }

            // Chống lỗi NULL khi xuống SQL Server
            if (string.IsNullOrEmpty(model.Description))
            {
                model.Description = "Chưa có mô tả";
            }

            _context.Categories.Add(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        [HttpGet("{id?}")]
        public IActionResult Edit(int id)
        {
            var category = _context.Categories.Find(id);
            if (category == null) return NotFound();
            return View(category);
        }

        // 🌟 HÀM SỬA DANH MỤC (CHUẨN)
        [HttpPost("{id?}")]
        public IActionResult Edit(Category model)
        {
            if (string.IsNullOrEmpty(model.Name))
            {
                ModelState.AddModelError("Name", "Tên danh mục không được để trống.");
                return View(model);
            }

            if (string.IsNullOrEmpty(model.Description))
            {
                model.Description = "Chưa có mô tả";
            }

            _context.Categories.Update(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        [HttpGet("{id?}")]
        public IActionResult Delete(int id)
        {
            var category = _context.Categories.Find(id);
            if (category != null)
            {
                _context.Categories.Remove(category);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}