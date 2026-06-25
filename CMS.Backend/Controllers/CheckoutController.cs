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
        public class CheckoutRequest
        {
            public string Notes { get; set; }
            public List<CartItemRequest> Items { get; set; }
        }

        public class CartItemRequest
        {
            public int ProductId { get; set; }
            public int Quantity { get; set; }
            public decimal UnitPrice { get; set; }
        }

        // ========================================================
        // 🌟 API ĐẶT HÀNG (POST: /api/Checkout/PlaceOrder)
        // ========================================================
        [HttpPost("PlaceOrder")]
        [AllowAnonymous]
        public IActionResult PlaceOrder([FromBody] CheckoutRequest request)
        {
            // 1. Kiểm tra giỏ hàng rỗng
            if (request.Items == null || !request.Items.Any())
            {
                return BadRequest(new { message = "Giỏ hàng của bạn đang trống!" });
            }

            using var transaction = _context.Database.BeginTransaction();
            try
            {
                // 🌟 FIX LỖI 500: TỰ ĐỘNG TÌM HOẶC TẠO KHÁCH VÃNG LAI
                var guestCustomer = _context.Customers.FirstOrDefault(c => c.Phone == "0000000000");
                if (guestCustomer == null)
                {
                    guestCustomer = new Customer
                    {
                        Fullname = "Khách Vãng Lai",
                        Phone = "0000000000",
                        Address = "Khách hàng mua trực tiếp không qua tài khoản",
                        Email = "guest@cameraclick.com",
                        Password = "guestpassword123" // 🌟 Đã cấp Password mặc định để trị dứt điểm lỗi SQL Server
                    };
                    _context.Customers.Add(guestCustomer);
                    _context.SaveChanges(); // Lưu để EF tự sinh ID mới
                }

                // 🌟 KIỂM TRA TỒN KHO THỰC TẾ TRƯỚC KHI CHO ĐẶT HÀNG
                foreach (var item in request.Items)
                {
                    var product = _context.Products.Find(item.ProductId);
                    if (product == null)
                    {
                        return NotFound(new { message = $"Sản phẩm mã #{item.ProductId} không tồn tại!" });
                    }

                    // Chặn đứng nếu kho không đủ hàng
                    if (product.StockQuantity < item.Quantity)
                    {
                        return BadRequest(new { message = $"Thiết bị '{product.Name}' đã hết hàng hoặc không đủ số lượng trong kho!" });
                    }
                }

                // 2. Tạo Đơn hàng mới (Order)
                var newOrder = new Order
                {
                    OrderDate = DateTime.Now,
                    Status = 0, // 0 = Chờ xử lý (Tạm giữ hàng)
                    Notes = request.Notes,
                    CustomerId = guestCustomer.Id, // Dùng ID linh hoạt vừa lấy được ở trên
                    TotalAmount = request.Items.Sum(i => i.Quantity * i.UnitPrice)
                };

                _context.Orders.Add(newOrder);
                _context.SaveChanges();

                // 3. Tạo các Chi tiết đơn hàng (OrderDetail)
                foreach (var item in request.Items)
                {
                    var orderDetail = new OrderDetail
                    {
                        OrderId = newOrder.Id,
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        UnitPrice = item.UnitPrice
                    };
                    _context.OrderDetails.Add(orderDetail);
                }

                _context.SaveChanges();
                transaction.Commit();

                return Ok(new
                {
                    message = "Đặt hàng thành công!",
                    orderId = newOrder.Id
                });
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                // Bóc tách lỗi chi tiết để báo lên Frontend nếu vẫn còn sập
                string errorDetail = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return StatusCode(500, new { message = "Lỗi hệ thống khi tạo đơn hàng", error = errorDetail });
            }
        }
    }
}