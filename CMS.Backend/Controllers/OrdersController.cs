using CMS.data;
using CMS.data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Authorize]
    [ApiExplorerSettings(IgnoreApi = false, GroupName = "GiaoDienAdmin")]
    [Route("[controller]/[action]")]
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ========================================================
        // 🌟 HÀM MỚI: LẤY DỮ LIỆU JSON THUẦN TÚY CỦA 1 ĐƠN HÀNG
        // Đường dẫn test trên Swagger: /Order/GetJson/{id}
        // ========================================================
        [HttpGet("{id}")]
        public IActionResult GetJson(int id)
        {
            // Truy vấn đơn hàng kèm theo thông tin khách hàng liên kết
            var item = _context.Orders
                .Include(o => o.Customer)
                .FirstOrDefault(o => o.Id == id);

            if (item == null)
            {
                return NotFound(new { message = $"Không tìm thấy đơn hàng có ID bằng {id}" });
            }

            // ĐỐI SÁCH: Phẳng hóa cấu trúc Object JSON trả về
            // Giúp bẻ gãy hoàn toàn lỗi sập hệ thống do vòng lặp vô hạn (Object Cycle) giữa Order và Customer
            return Ok(new
            {
                item.Id,
                item.OrderDate,
                item.TotalAmount,
                item.Status,
                item.CustomerId,
                CustomerName = item.Customer != null ? item.Customer.Fullname : "Khách vãng lai"
            });
        }

        // ========================================================
        // 1. HIỂN THỊ DANH SÁCH ĐƠN HÀNG (Trả về giao diện HTML)
        // ========================================================
        [HttpGet]
        public IActionResult Index()
        {
            var orders = _context.Orders
                .Include(o => o.Customer)
                .OrderByDescending(o => o.OrderDate)
                .ToList();

            return View(orders);
        }

        // ========================================================
        // 2. CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG (GET - Giao diện HTML)
        // Đường dẫn chuẩn: /Order/Edit/{id}
        // ========================================================
        [HttpGet("{id?}")]
        public IActionResult Edit(int id)
        {
            var order = _context.Orders.Find(id);
            if (order == null) return NotFound();

            return View(order);
        }

        // 2. CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG (POST - Xử lý lưu)
        [HttpPost("{id?}")]
        public IActionResult Edit(Order model)
        {
            _context.Orders.Update(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // ========================================================
        // 3. XÓA ĐƠN HÀNG KHỎI HỆ THỐNG
        // Đường dẫn chuẩn: /Order/Delete/{id}
        // ========================================================
        [HttpGet("{id?}")]
        public IActionResult Delete(int id)
        {
            var item = _context.Orders.Find(id);

            if (item != null)
            {
                _context.Orders.Remove(item);
                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }
    }
}