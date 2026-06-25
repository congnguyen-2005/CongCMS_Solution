using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.data; // Đảm bảo đúng namespace chứa ApplicationDbContext
using CMS.data.Entities; // Đảm bảo đúng namespace chứa Order
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Action hiển thị danh sách đơn hàng
        [Route("Order")]
        [Route("Order/Index")]
        public IActionResult Index()
        {
            // Lấy danh sách đơn hàng kèm thông tin khách hàng
            var orders = _context.Orders
                .Include(o => o.Customer)
                .OrderByDescending(o => o.OrderDate)
                .ToList();

            return View(orders);
        }

        // Action xóa đơn hàng
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