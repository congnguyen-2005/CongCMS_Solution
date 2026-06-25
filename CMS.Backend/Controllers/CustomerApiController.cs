using CMS.data;
using CMS.data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    [ApiExplorerSettings(IgnoreApi = false, GroupName = "HeThongAPI")]
    public class CustomerApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CustomerApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/CustomerApi
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var customers = await _context.Customers
                .OrderByDescending(c => c.Id)
                .ToListAsync();

            return Ok(customers);
        }

        // GET: api/CustomerApi/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var customer = await _context.Customers.FindAsync(id);

            if (customer == null)
            {
                return NotFound(new { message = "Không tìm thấy khách hàng trong hệ thống" });
            }

            return Ok(customer);
        }

        // POST: api/CustomerApi
        [HttpPost]
        public async Task<IActionResult> Create(Customer model)
        {
            model.Id = 0;

            if (string.IsNullOrEmpty(model.Password))
            {
                model.Password = "123456";
            }
            if (string.IsNullOrEmpty(model.Email))
            {
                model.Email = "chuaco@email.com"; // Gán tạm để SQL Server không báo lỗi NULL
            }

            if (string.IsNullOrEmpty(model.Password))
            {
                model.Password = "123456";
            }
            _context.Customers.Add(model);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Thêm khách hàng thành công qua API",
                data = model
            });
        }

        // PUT: api/CustomerApi/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Customer model)
        {
            if (id != model.Id)
            {
                return BadRequest(new { message = "Id trên đường dẫn không khớp với dữ liệu" });
            }

            var oldCustomer = await _context.Customers
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == id);

            if (oldCustomer == null)
            {
                return NotFound(new { message = "Khách hàng không tồn tại để cập nhật" });
            }

            // Giữ lại email cũ nếu người dùng gửi chuỗi trống
            if (string.IsNullOrEmpty(model.Email))
            {
                model.Email = oldCustomer.Email;
            }

            // Giữ lại mật khẩu cũ nếu không muốn thay đổi
            if (string.IsNullOrEmpty(model.Password))
            {
                model.Password = oldCustomer.Password;
            }

            _context.Customers.Update(model);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Cập nhật thông tin khách hàng thành công",
                data = model
            });
        }

        // DELETE: api/CustomerApi/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var customer = await _context.Customers.FindAsync(id);

            if (customer == null)
            {
                return NotFound(new { message = "Không tìm thấy khách hàng cần xóa" });
            }

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa tài khoản khách hàng thành công" });
        }
    }
}