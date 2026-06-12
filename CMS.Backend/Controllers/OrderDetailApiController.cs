using CMS.data;
using CMS.data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")] // Đường dẫn gọi qua Swagger/ReactJS: api/OrderDetailApi
    [ApiController]
    [Authorize]
    [ApiExplorerSettings(IgnoreApi = false, GroupName = "HeThongAPI")] // Đưa vào cụm API hệ thống
    public class OrderDetailApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrderDetailApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/OrderDetailApi/order/1
        [HttpGet("order/{orderId}")]
        public async Task<IActionResult> GetByOrderId(int orderId)
        {
            var details = await _context.OrderDetails
                .Include(od => od.Product)
                .Where(od => od.OrderId == orderId)
                .Select(od => new
                {
                    od.Id,
                    od.OrderId,
                    od.ProductId,
                    ProductName = od.Product != null ? od.Product.Name : "Sản phẩm không tồn tại",
                    od.Quantity,
                    od.UnitPrice
                })
                .ToListAsync();

            return Ok(details);
        }

        // GET: api/OrderDetailApi/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var detail = await _context.OrderDetails
                .Include(od => od.Product)
                .Where(od => od.Id == id)
                .Select(od => new
                {
                    od.Id,
                    od.OrderId,
                    od.ProductId,
                    ProductName = od.Product != null ? od.Product.Name : "Sản phẩm không tồn tại",
                    od.Quantity,
                    od.UnitPrice
                })
                .FirstOrDefaultAsync();

            if (detail == null)
            {
                return NotFound(new { message = "Không tìm thấy chi tiết đơn hàng yêu cầu" });
            }

            return Ok(detail);
        }
    }
}