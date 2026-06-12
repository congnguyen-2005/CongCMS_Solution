using CMS.data;
using CMS.data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace CMS.Backend.Controllers
{
    // Cấp quyền Admin và Administrator được phép truy cập
    [Authorize(Roles = "Admin,Administrator")]
    [ApiExplorerSettings(IgnoreApi = false, GroupName = "GiaoDienAdmin")]
    [Route("[controller]/[action]")]
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ========================================================
        // 🌟 HÀM MỚI: LẤY DỮ LIỆU JSON THUẦN TÚY CỦA 1 THÀNH VIÊN
        // Đường dẫn test trên Swagger: /User/GetJson/{id}
        // ========================================================
        [HttpGet("{id}")]
        public IActionResult GetJson(int id)
        {
            // Tìm kiếm thành viên hệ thống dựa vào ID
            var item = _context.Users.FirstOrDefault(u => u.Id == id);

            if (item == null)
            {
                return NotFound(new { message = $"Không tìm thấy thành viên có ID bằng {id}" });
            }

            // Trả về JSON phẳng gọn gàng
            // Lưu ý bảo mật: Tuyệt đối không trả về chuỗi mã hóa mật khẩu (PasswordHash)
            return Ok(new
            {
                item.Id,
                item.Username,
                item.Fullname,
                item.Role
            });
        }

        // ========================================================
        // 1. TRANG DANH SÁCH THÀNH VIÊN (Trả về giao diện HTML)
        // ========================================================
        [HttpGet]
        public IActionResult Index()
        {
            var users = _context.Users.OrderByDescending(u => u.Id).ToList();
            return View(users);
        }

        // ========================================================
        // 2. TÁC VỤ THÊM MỚI THÀNH VIÊN (GET & POST)
        // ========================================================
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Create(User model)
        {
            // Kiểm tra thủ công dữ liệu bắt buộc đầu vào
            if (string.IsNullOrEmpty(model.Username) || string.IsNullOrEmpty(model.PasswordHash) || string.IsNullOrEmpty(model.Fullname))
            {
                ModelState.AddModelError("", "Vui lòng nhập đầy đủ các thông tin bắt buộc.");
                return View(model);
            }

            // Kiểm tra trùng lặp tài khoản đăng nhập
            var checkExist = _context.Users.Any(u => u.Username == model.Username);
            if (checkExist)
            {
                ModelState.AddModelError("Username", "Tên đăng nhập này đã tồn tại trên hệ thống!");
                return View(model);
            }

            // Ép ID tự tăng và thực hiện lưu vào Database
            model.Id = 0;
            _context.Users.Add(model);
            _context.SaveChanges();

            // THÀNH CÔNG: Quay thẳng về trang danh sách
            return RedirectToAction("Index");
        }

        // ========================================================
        // 3. TÁC VỤ CẬP NHẬT THÀNH VIÊN (GET & POST)
        // ========================================================
        [HttpGet("{id?}")]
        public IActionResult Edit(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null)
            {
                return NotFound();
            }
            return View(user);
        }

        [HttpPost("{id?}")]
        public IActionResult Edit(User model, string NewPassword)
        {
            // Kiểm tra dữ liệu tên hiển thị bắt buộc
            if (string.IsNullOrEmpty(model.Fullname))
            {
                ModelState.AddModelError("Fullname", "Họ và tên không được để trống.");
                return View(model);
            }

            // Truy vấn lấy dữ liệu gốc từ DB ra để so sánh
            var existingUser = _context.Users.AsNoTracking().FirstOrDefault(u => u.Id == model.Id);
            if (existingUser == null)
            {
                return NotFound();
            }

            // Xử lý logic mật khẩu:
            // Nếu admin gõ vào ô NewPassword -> Thay thế mật khẩu mới.
            // Nếu ô NewPassword bỏ trống -> Giữ nguyên mã Hash mật khẩu cũ của user đó.
            if (!string.IsNullOrEmpty(NewPassword))
            {
                model.PasswordHash = NewPassword;
            }
            else
            {
                model.PasswordHash = existingUser.PasswordHash;
            }

            // Bảo toàn tên tài khoản cũ từ DB (vì ô input ngoài view đang để trạng thái readonly)
            model.Username = existingUser.Username;

            // Tiến hành cập nhật bản ghi xuống database
            _context.Users.Update(model);
            _context.SaveChanges();

            // THÀNH CÔNG: Điều hướng trang về màn hình danh sách thành viên
            return RedirectToAction("Index");
        }

        // ========================================================
        // 4. TÁC VỤ XÓA THÀNH VIÊN
        // ========================================================
        [HttpGet("{id?}")]
        public IActionResult Delete(int id)
        {
            var user = _context.Users.Find(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}