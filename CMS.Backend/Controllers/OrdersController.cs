using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.data;
using CMS.data.Entities;
using CMS.Backend.Services; // Thêm dòng này
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "HeThongAPI")]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly EmailService _emailService; // Khai báo service

        public OrdersController(ApplicationDbContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> CreateOrder([FromBody] OrderInputDto dto)
        {
            if (dto == null || dto.OrderDetails == null || dto.OrderDetails.Count == 0)
                return BadRequest(new { message = "Giỏ hàng trống!" });

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var newOrder = new Order
                {
                    CustomerId = dto.CustomerId,
                    OrderDate = DateTime.Now,
                    Status = 0,
                    Notes = dto.Notes,
                    TotalAmount = dto.OrderDetails.Sum(x => x.Quantity * x.UnitPrice)
                };

                _context.Orders.Add(newOrder);

                await _context.SaveChangesAsync();

                foreach (var item in dto.OrderDetails)
                {
                    var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == item.ProductId);
                    if (product == null || product.StockQuantity < item.Quantity)
                    {
                        await transaction.RollbackAsync();
                        return BadRequest(new { message = $"Sản phẩm '{product?.Name}' không đủ hàng!" });
                    }

                    product.StockQuantity -= item.Quantity;
                    _context.OrderDetails.Add(new OrderDetail { OrderId = newOrder.Id, ProductId = item.ProductId, Quantity = item.Quantity, UnitPrice = item.UnitPrice });
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                // 🌟 GỬI EMAIL SAU KHI ĐƠN HÀNG THÀNH CÔNG
                try
                {
                    var customer = await _context.Customers.FindAsync(dto.CustomerId);
                    if (customer != null && !string.IsNullOrEmpty(customer.Email))
                    {
                        string subject = "Xác nhận đặt hàng thành công - Mã đơn #" + newOrder.Id;
                        string body = $"<h1>Cảm ơn {customer.Fullname},</h1><p>Đơn hàng #{newOrder.Id} của bạn đã được đặt thành công.</p>";
                        await _emailService.SendEmail(customer.Email,subject,body);
                    }
                }
                catch (Exception ex) { Console.WriteLine("Lỗi gửi mail: " + ex.Message); }

                return StatusCode(201, new { message = "Đặt hàng thành công!", orderId = newOrder.Id });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, $"Lỗi hệ thống: {ex.Message}");
            }
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderById(int id)
        {
            var order = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy đơn hàng."
                });
            }

            return Ok(order);
        }
        [HttpGet("customer/{customerId}")]
        public async Task<IActionResult> GetOrdersByCustomer(int customerId)
        {
            var orders = await _context.Orders
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .Where(o => o.CustomerId == customerId)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            return Ok(orders);
        }
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
}