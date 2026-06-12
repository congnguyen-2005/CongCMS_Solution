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
        // 🌟 HÀM MỚI: LẤY DỮ LIỆU JSON THUẦN TÚY CỦA 1 DANH MỤC
        // Đường dẫn test trên Swagger: /Category/GetJson/{id}
        // ========================================================
        [HttpGet("{id}")]
        public IActionResult GetJson(int id)
        {
            // Tìm kiếm danh mục dựa vào ID truyền vào
            var item = _context.Categories.FirstOrDefault(c => c.Id == id);

            if (item == null)
            {
                return NotFound(new { message = $"Không tìm thấy danh mục có ID bằng {id}" });
            }

            // Trả về JSON phẳng gọn gàng, bẻ gãy hoàn toàn lỗi Object Cycle (vòng lặp thực thể)
            return Ok(new
            {
                item.Id,
                item.Name
                // Nếu class Category của bạn có thêm trường gì (Ví dụ: Description...), hãy thêm vào đây
            });
        }

        // ========================================================
        // Hiển thị thẳng sạch đẹp trên Swagger: /Category/Index (Trả về HTML)
        // ========================================================
        [HttpGet]
        public IActionResult Index()
        {
            var categories = _context.Categories.OrderByDescending(c => c.Id).ToList();
            return View(categories);
        }

        // ========================================================
        // Hiển thị thẳng sạch đẹp trên Swagger: /Category/Create (Trả về HTML)
        // ========================================================
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Create(Category model)
        {
            if (string.IsNullOrEmpty(model.Name))
            {
                ModelState.AddModelError("Name", "Tên danh mục không được để trống.");
                return View(model);
            }

            _context.Categories.Add(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // ========================================================
        // Giao diện chỉnh sửa danh mục (Trả về HTML)
        // Đường dẫn: /Category/Edit/{id}
        // ========================================================
        [HttpGet("{id?}")]
        public IActionResult Edit(int id)
        {
            var category = _context.Categories.Find(id);
            if (category == null) return NotFound();
            return View(category);
        }

        [HttpPost("{id?}")]
        public IActionResult Edit(Category model)
        {
            if (string.IsNullOrEmpty(model.Name))
            {
                ModelState.AddModelError("Name", "Tên danh mục không được để trống.");
                return View(model);
            }

            _context.Categories.Update(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // ========================================================
        // Tác vụ xóa dữ liệu danh mục
        // Đường dẫn: /Category/Delete/{id}
        // ========================================================
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