using CMS.data;
using CMS.data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [ApiExplorerSettings(IgnoreApi = false, GroupName = "HeThongAPI")]
    public class CheckoutController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CheckoutController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ========================================================
        // 🌟 KHAI BÁO CÁC LỚP DTO ĐỂ HỨNG DỮ LIỆU TỪ REACTJS
        // ========================================================
        //public class CheckoutRequest
        //{
        //    public string Notes { get; set; }
        //    public List<CartItemRequest> Items { get; set; }
        //}

        public class CartItemRequest
        {
            public int ProductId { get; set; }
            public int Quantity { get; set; }
            public decimal UnitPrice { get; set; }
        }

        // ========================================================
        // 🌟 API ĐẶT HÀNG (POST: /api/Checkout/PlaceOrder)
        // ========================================================
        // 1. Cập nhật DTO để nhận CustomerId
        public class CheckoutRequest
        {
            public int? CustomerId { get; set; } // Nhận từ React
            public string Notes { get; set; }
            public List<CartItemRequest> Items { get; set; }
        }

        // 2. Sửa hàm PlaceOrder
        [HttpPost("PlaceOrder")]
        [AllowAnonymous]
        public IActionResult PlaceOrder([FromBody] CheckoutRequest request)
        {
            if (request.Items == null || !request.Items.Any())
                return BadRequest(new { message = "Giỏ hàng trống!" });

            using var transaction = _context.Database.BeginTransaction();
            try
            {
                // Logic: Nếu gửi lên CustomerId > 0 thì dùng, không thì lấy ID khách vãng lai
                int customerIdToUse = (request.CustomerId.HasValue && request.CustomerId > 0)
                                        ? request.CustomerId.Value
                                        : _context.Customers.FirstOrDefault(c => c.Phone == "0000000000")?.Id ?? 19;

                // Kiểm tra sản phẩm và kho hàng... (giữ nguyên logic của bạn)

                var newOrder = new Order
                {
                    OrderDate = DateTime.Now,
                    Status = 0,
                    Notes = request.Notes,
                    CustomerId = customerIdToUse, // 🌟 ĐÃ SỬA: Dùng ID linh hoạt
                    TotalAmount = request.Items.Sum(i => i.Quantity * i.UnitPrice)
                };

                _context.Orders.Add(newOrder);
                _context.SaveChanges();

                // ... (lưu OrderDetails và commit transaction) ...
                transaction.Commit();
                return Ok(new { message = "Đặt hàng thành công!", orderId = newOrder.Id });
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                return StatusCode(500, new { message = "Lỗi hệ thống", error = ex.Message });
            }
        }
    }
}