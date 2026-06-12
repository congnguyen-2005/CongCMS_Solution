using CMS.data;
using CMS.data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Authorize]
    // ĐÃ SỬA 1: Phân vào đúng nhóm GiaoDienAdmin trên Swagger để đồng bộ hệ thống
    [ApiExplorerSettings(IgnoreApi = false, GroupName = "GiaoDienAdmin")]
    // ĐÃ SỬA 2: Giữ đường dẫn phẳng sạch đẹp ở cấp lớp, không dính /{id?} thừa cho Index/Create
    [Route("[controller]/[action]")]
    public class ProductCategoryController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ProductCategoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ========================================================
        // 🌟 HÀM MỚI: LẤY DỮ LIỆU JSON THUẦN TÚY CỦA 1 DANH MỤC SẢN PHẨM
        // Đường dẫn test trên Swagger: /ProductCategory/GetJson/{id}
        // ========================================================
        [HttpGet("{id}")]
        public IActionResult GetJson(int id)
        {
            // Tìm kiếm danh mục sản phẩm theo mã ID
            var item = _context.CategoriesProducts.FirstOrDefault(c => c.Id == id);

            if (item == null)
            {
                return NotFound(new { message = $"Không tìm thấy danh mục sản phẩm có ID bằng {id}" });
            }

            // Trả về JSON phẳng bẻ gãy hoàn toàn nguy cơ dính vòng lặp thực thể Object Cycle
            return Ok(new
            {
                item.Id,
                item.Name,
                item.Description
            });
        }

        // ========================================================
        // 1. XEM DANH SÁCH DANH MỤC SẢN PHẨM (Trả về giao diện HTML)
        // Đường dẫn phẳng chuẩn: /ProductCategory/Index
        // ========================================================
        [HttpGet]
        public IActionResult Index()
        {
            var data = _context.CategoriesProducts
                .OrderByDescending(c => c.Id)
                .ToList();

            return View(data);
        }

        // ========================================================
        // 2. THÊM DANH MỤC SẢN PHẨM MỚI (GET & POST)
        // Đường dẫn phẳng chuẩn: /ProductCategory/Create
        // ========================================================
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Create(CategoryProduct model)
        {
            // Bảo vệ an toàn dữ liệu: Chặn nếu tên danh mục để trống
            if (string.IsNullOrEmpty(model.Name))
            {
                ModelState.AddModelError("Name", "Tên danh mục sản phẩm không được để trống.");
                return View(model);
            }

            model.Id = 0; // Đảm bảo ID tự tăng hoạt động ổn định
            _context.CategoriesProducts.Add(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // ========================================================
        // 3. CẬP NHẬT DANH MỤC SẢN PHẨM (GET & POST)
        // ĐÃ SỬA 3: Đưa {id?} vào thuộc tính để nút bấm ngoài View nhận đúng URL và không bị 404
        // Đường dẫn chuẩn: /ProductCategory/Edit/{id}
        // ========================================================
        [HttpGet("{id?}")]
        public IActionResult Edit(int id)
        {
            var item = _context.CategoriesProducts.Find(id);

            if (item == null)
                return NotFound();

            return View(item);
        }

        [HttpPost("{id?}")]
        public IActionResult Edit(CategoryProduct model)
        {
            if (string.IsNullOrEmpty(model.Name))
            {
                ModelState.AddModelError("Name", "Tên danh mục sản phẩm không được để trống.");
                return View(model);
            }

            _context.CategoriesProducts.Update(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // ========================================================
        // 4. XÓA DANH MỤC SẢN PHẨM KHỎI HỆ THỐNG
        // Đường dẫn chuẩn: /ProductCategory/Delete/{id}
        // ========================================================
        [HttpGet("{id?}")]
        public IActionResult Delete(int id)
        {
            var item = _context.CategoriesProducts.Find(id);

            if (item != null)
            {
                _context.CategoriesProducts.Remove(item);
                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }
    }
}