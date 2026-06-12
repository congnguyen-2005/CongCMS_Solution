using CMS.data;
using CMS.data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Authorize]
    [ApiExplorerSettings(IgnoreApi = false, GroupName = "GiaoDienAdmin")]
    // Giữ định tuyến phẳng sạch đẹp ở cấp lớp (Class level)
    [Route("[controller]/[action]")]
    public class OrderDetailController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderDetailController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ========================================================
        // 🌟 HÀM MỚI: LẤY DỮ LIỆU JSON THUẦN TÚY CỦA 1 CHI TIẾT ĐƠN HÀNG
        // Đường dẫn test trên Swagger: /OrderDetail/GetJson/{id}
        // ========================================================
        [HttpGet("{id}")]
        public IActionResult GetJson(int id)
        {
            // Tìm kiếm chi tiết đơn hàng kèm theo thông tin sản phẩm liên kết
            var item = _context.OrderDetails
                .Include(od => od.Product)
                .FirstOrDefault(od => od.Id == id);

            if (item == null)
            {
                return NotFound(new { message = $"Không tìm thấy chi tiết đơn hàng có ID bằng {id}" });
            }

            // ĐỐI SÁCH: Phẳng hóa cấu trúc Object JSON trả về
            // Giúp bẻ gãy hoàn toàn lỗi sập hệ thống do vòng lặp vô hạn (Object Cycle) giữa OrderDetail và Product
            return Ok(new
            {
                item.Id,
                item.OrderId,
                item.ProductId,
                item.Quantity,
                item.UnitPrice,
                ProductName = item.Product != null ? item.Product.Name : "Sản phẩm không tồn tại"
            });
        }

        // ========================================================
        // Giao diện hiển thị thẳng sạch đẹp: /OrderDetail/Index (Trả về HTML)
        // ========================================================
        [HttpGet]
        public IActionResult Index()
        {
            // Lấy toàn bộ chi tiết đơn hàng kèm thông tin Tên sản phẩm để hiển thị lên bảng
            var orderDetails = _context.OrderDetails
                .Include(od => od.Product)
                .OrderByDescending(od => od.Id)
                .ToList();

            return View(orderDetails);
        }

        // ========================================================
        // Giao diện hiển thị thẳng sạch đẹp: /OrderDetail/Create (Trả về HTML)
        // ========================================================
        [HttpGet]
        public IActionResult Create()
        {
            // Nạp danh sách sản phẩm để chọn khi thêm thủ công chi tiết đơn hàng
            ViewBag.ProductList = new SelectList(_context.Products.OrderBy(p => p.Name).ToList(), "Id", "Name");
            return View();
        }

        [HttpPost]
        public IActionResult Create(OrderDetail model)
        {
            if (model.Quantity <= 0 || model.UnitPrice <= 0)
            {
                ModelState.AddModelError("", "Số lượng và giá sản phẩm phải lớn hơn 0.");
                ViewBag.ProductList = new SelectList(_context.Products.OrderBy(p => p.Name).ToList(), "Id", "Name", model.ProductId);
                return View(model);
            }

            model.Id = 0;
            _context.OrderDetails.Add(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // ========================================================
        // Giao diện chỉnh sửa chi tiết đơn hàng (Trả về HTML)
        // Đường dẫn chuẩn: /OrderDetail/Edit/{id}
        // ========================================================
        [HttpGet("{id?}")]
        public IActionResult Edit(int id)
        {
            var detail = _context.OrderDetails.Find(id);
            if (detail == null) return NotFound();

            ViewBag.ProductList = new SelectList(_context.Products.OrderBy(p => p.Name).ToList(), "Id", "Name", detail.ProductId);
            return View(detail);
        }

        [HttpPost("{id?}")]
        public IActionResult Edit(OrderDetail model)
        {
            if (model.Quantity <= 0 || model.UnitPrice <= 0)
            {
                ModelState.AddModelError("", "Số lượng và giá sản phẩm phải lớn hơn 0.");
                ViewBag.ProductList = new SelectList(_context.Products.OrderBy(p => p.Name).ToList(), "Id", "Name", model.ProductId);
                return View(model);
            }

            _context.OrderDetails.Update(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // ========================================================
        // Tác vụ xóa chi tiết đơn hàng
        // Đường dẫn chuẩn: /OrderDetail/Delete/{id}
        // ========================================================
        [HttpGet("{id?}")]
        public IActionResult Delete(int id)
        {
            var detail = _context.OrderDetails.Find(id);
            if (detail != null)
            {
                _context.OrderDetails.Remove(detail);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}