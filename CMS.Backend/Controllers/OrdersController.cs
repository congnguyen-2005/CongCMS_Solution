using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.data;
using CMS.data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")] // Đường dẫn sẽ là: api/Orders
    [ApiController]
    [ApiExplorerSettings(IgnoreApi = false, GroupName = "HeThongAPI")]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ========================================================
        // 1. API LẤY LỊCH SỬ ĐƠN HÀNG (Dành cho trang MyOrders.jsx)
        // Đường dẫn: GET api/Orders/customer/{customerId}
        // ========================================================
        [HttpGet("customer/{customerId}")]
        [AllowAnonymous] // Mở khóa tạm thời để React gọi không bị lỗi 401
        public async Task<IActionResult> GetOrdersByCustomer(int customerId)
        {
            try
            {
                var orders = await _context.Orders
                    .Where(o => o.CustomerId == customerId)
                    // 🌟 Nạp chi tiết đơn và thông tin sản phẩm
                    .Include(o => o.OrderDetails)
                        .ThenInclude(od => od.Product)
                    .OrderByDescending(o => o.Id)
                    .ToListAsync();

                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi: {ex.Message}");
            }
        }
        // ========================================================
        // 2. API CHỐT ĐƠN HÀNG VÀ TRỪ KHO (Dành cho trang Checkout.jsx)
        // Đường dẫn: POST api/Orders
        // ========================================================
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> CreateOrder([FromBody] OrderInputDto dto)
        {
            if (dto == null || dto.OrderDetails == null || dto.OrderDetails.Count == 0)
            {
                return BadRequest(new { message = "Gói tin đơn hàng trống rỗng, không thể xử lý!" });
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // A. Tạo hóa đơn
                var newOrder = new Order
                {
                    CustomerId = dto.CustomerId,
                    OrderDate = DateTime.Now,
                    Status = 0, // 0: Chờ duyệt
                    Notes = dto.Notes
                };

                _context.Orders.Add(newOrder);
                await _context.SaveChangesAsync();

                // B. Kiểm tra và trừ kho
                foreach (var item in dto.OrderDetails)
                {
                    var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == item.ProductId);
                    if (product == null)
                    {
                        await transaction.RollbackAsync();
                        return NotFound(new { message = $"Sản phẩm mã #{item.ProductId} không tồn tại!" });
                    }

                    if (product.StockQuantity < item.Quantity)
                    {
                        await transaction.RollbackAsync();
                        return BadRequest(new { message = $"Sản phẩm '{product.Name}' chỉ còn {product.StockQuantity} chiếc, không đủ đáp ứng!" });
                    }

                    product.StockQuantity -= item.Quantity; // Trừ kho vật lý

                    var orderDetail = new OrderDetail
                    {
                        OrderId = newOrder.Id,
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        UnitPrice = item.UnitPrice
                    };

                    _context.OrderDetails.Add(orderDetail);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return StatusCode(201, new { message = "Ghi nhận đơn hàng thành công!", orderId = newOrder.Id });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, $"Lỗi hệ thống máy chủ C#: {ex.Message}");
            }
        }
    }

    // ========================================================
    // ĐỊNH NGHĨA DTO (Nằm cùng file hoặc tách file riêng đều được)
    // ========================================================
    public class OrderInputDto
    {
        public int CustomerId { get; set; }
        public string? Notes { get; set; }
        public List<OrderDetailInputDto> OrderDetails { get; set; }
    }

    public class OrderDetailInputDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}