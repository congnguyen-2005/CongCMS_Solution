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
    public class CustomerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CustomerController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ========================================================
        // 🌟 HÀM MỚI: LẤY DỮ LIỆU JSON THUẦN TÚY CỦA 1 KHÁCH HÀNG
        // Đường dẫn test trên Swagger: /Customer/GetJson/{id}
        // ========================================================
        [HttpGet("{id}")]
        public IActionResult GetJson(int id)
        {
            // Tìm kiếm thông tin khách hàng trong database theo ID
            var item = _context.Customers.FirstOrDefault(c => c.Id == id);

            if (item == null)
            {
                return NotFound(new { message = $"Không tìm thấy khách hàng có ID bằng {id}" });
            }

            // Trả về chuỗi JSON phẳng sạch sẽ
            // Lưu ý bảo mật: Chúng ta ẩn trường Password đi, không trả về API công cộng
            return Ok(new
            {
                item.Id,
                item.Fullname
                // Nếu class Customer của bạn có thêm trường Email, PhoneNumber... hãy viết thêm vào đây nhé
            });
        }

        // ========================================================
        // Hiển thị thẳng sạch đẹp trên Swagger: /Customer/Index (Trả về HTML)
        // ========================================================
        [HttpGet]
        public IActionResult Index()
        {
            var customers = _context.Customers.OrderByDescending(c => c.Id).ToList();
            return View(customers);
        }

        // ========================================================
        // Hiển thị thẳng sạch đẹp trên Swagger: /Customer/Create (Trả về HTML)
        // ========================================================
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Create(Customer model)
        {
            if (string.IsNullOrEmpty(model.Fullname))
            {
                ModelState.AddModelError("FullName", "Tên khách hàng không được để trống.");
                return View(model);
            }

            if (string.IsNullOrEmpty(model.Password))
            {
                model.Password = "123456";
            }

            model.Id = 0;
            _context.Customers.Add(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // ========================================================
        // Giao diện chỉnh sửa thông tin khách hàng (Trả về HTML)
        // Đường dẫn: /Customer/Edit/{id}
        // ========================================================
        [HttpGet("{id?}")]
        public IActionResult Edit(int id)
        {
            var customer = _context.Customers.Find(id);
            if (customer == null) return NotFound();
            return View(customer);
        }

        [HttpPost("{id?}")]
        public IActionResult Edit(Customer model)
        {
            if (string.IsNullOrEmpty(model.Fullname))
            {
                ModelState.AddModelError("FullName", "Tên khách hàng không được để trống.");
                return View(model);
            }

            _context.Customers.Update(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // ========================================================
        // Tác vụ xóa khách hàng khỏi hệ thống
        // Đường dẫn: /Customer/Delete/{id}
        // ========================================================
        [HttpGet("{id?}")]
        public IActionResult Delete(int id)
        {
            var customer = _context.Customers.Find(id);
            if (customer != null)
            {
                _context.Customers.Remove(customer);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}