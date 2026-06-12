using CMS.data;
using CMS.data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http; // Bắt buộc phải có để dùng IFormFile
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering; // Bắt buộc phải có để dùng SelectList
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    [Authorize]
    [ApiExplorerSettings(IgnoreApi = false, GroupName = "GiaoDienAdmin")]
    // Giữ định tuyến phẳng sạch đẹp ở cấp lớp (Class level)
    [Route("[controller]/[action]")]
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ========================================================
        // 🌟 HÀM MỚI: LẤY DỮ LIỆU JSON THUẦN TÚY CỦA 1 BÀI VIẾT
        // Đường dẫn test trên Swagger: /Post/GetJson/{id}
        // ========================================================
        [HttpGet("{id}")]
        public IActionResult GetJson(int id)
        {
            // Tìm kiếm bài viết kèm theo bảng chuyên mục tin tức liên kết
            var item = _context.Posts
                .Include(p => p.Category)
                .FirstOrDefault(p => p.Id == id);

            if (item == null)
            {
                return NotFound(new { message = $"Không tìm thấy bài viết có ID bằng {id}" });
            }

            // ĐỐI SÁCH: Phẳng hóa dữ liệu đối tượng JSON trả về
            // Giúp ngăn chặn triệt để lỗi sập hệ thống do vòng lặp vô hạn (Object Cycle) giữa Post và Category
            return Ok(new
            {
                item.Id,
                item.Title,
                item.Content,
                item.ImageUrl,
                item.CreatedDate,
                item.CategoryId,
                CategoryName = item.Category != null ? item.Category.Name : "Chưa phân loại"
            });
        }

        // ==========================================================
        // 1. XEM DANH SÁCH BÀI VIẾT (Trả về giao diện HTML View)
        // Tuyến đường trên Swagger công cộng: /Post/Index
        // ==========================================================
        [HttpGet]
        public IActionResult Index()
        {
            var posts = _context.Posts.Include(p => p.Category).OrderByDescending(p => p.Id).ToList();
            return View(posts);
        }

        // ==========================================================
        // 2. THÊM MỚI BÀI VIẾT (GET)
        // Tuyến đường trên Swagger công cộng: /Post/Create
        // ==========================================================
        [HttpGet]
        public IActionResult Create()
        {
            // Đổ dữ liệu từ bảng Categories vào SelectList để View nhận diện qua ViewBag.CategoryList
            ViewBag.CategoryList = new SelectList(_context.Categories.OrderBy(c => c.Name).ToList(), "Id", "Name");
            return View();
        }

        // 2. THÊM MỚI BÀI VIẾT (POST)
        [HttpPost]
        public async Task<IActionResult> Create(Post model, IFormFile uploadImage)
        {
            // Kiểm tra thủ công các trường bắt buộc để không bị kẹt trang
            if (string.IsNullOrEmpty(model.Title) || model.CategoryId == 0)
            {
                if (string.IsNullOrEmpty(model.Title))
                    ModelState.AddModelError("Title", "Tiêu đề bài viết không được để trống.");

                if (model.CategoryId == 0)
                    ModelState.AddModelError("CategoryId", "Vui lòng chọn một chuyên mục.");

                // Nếu lỗi, phải nạp lại danh sách chuyên mục trước khi trả về View
                ViewBag.CategoryList = new SelectList(_context.Categories.OrderBy(c => c.Name).ToList(), "Id", "Name", model.CategoryId);
                return View(model);
            }

            // XỬ LÝ UPLOAD ẢNH ĐẠI DIỆN
            if (uploadImage != null && uploadImage.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await uploadImage.CopyToAsync(stream);
                }

                model.ImageUrl = "/uploads/" + fileName;
            }
            else
            {
                model.ImageUrl = "/uploads/default-news.png"; // Ảnh mặc định nếu bỏ trống
            }

            model.Id = 0; // Đảm bảo ID tự động tăng
            _context.Posts.Add(model);
            await _context.SaveChangesAsync();

            return RedirectToAction("Index");
        }

        // ==========================================================
        // 3. SỬA BÀI VIẾT (GET)
        // Tuyến đường chuẩn: /Post/Edit/{id}
        // ==========================================================
        [HttpGet("{id?}")]
        public IActionResult Edit(int id)
        {
            var post = _context.Posts.Find(id);
            if (post == null)
            {
                return NotFound();
            }

            // Nạp danh sách chuyên mục tin tức và chọn sẵn mục hiện tại của bài viết
            ViewBag.CategoryList = new SelectList(_context.Categories.OrderBy(c => c.Name).ToList(), "Id", "Name", post.CategoryId);
            return View(post);
        }

        // 3. SỬA BÀI VIẾT (POST)
        [HttpPost("{id?}")]
        public async Task<IActionResult> Edit(Post model, IFormFile uploadImage)
        {
            if (string.IsNullOrEmpty(model.Title) || model.CategoryId == 0)
            {
                if (string.IsNullOrEmpty(model.Title))
                    ModelState.AddModelError("Title", "Tiêu đề bài viết không được để trống.");

                if (model.CategoryId == 0)
                    ModelState.AddModelError("CategoryId", "Vui lòng chọn một chuyên mục.");

                ViewBag.CategoryList = new SelectList(_context.Categories.OrderBy(c => c.Name).ToList(), "Id", "Name", model.CategoryId);
                return View(model);
            }

            // XỬ LÝ ẢNH KHI CẬP NHẬT
            if (uploadImage != null && uploadImage.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await uploadImage.CopyToAsync(stream);
                }

                model.ImageUrl = "/uploads/" + fileName;
            }
            else
            {
                // ĐỐI SÁCH AN TOÀN: Giữ lại ảnh cũ nếu đợt chỉnh sửa này không cập nhật file ảnh mới
                var oldItem = _context.Posts.AsNoTracking().FirstOrDefault(p => p.Id == model.Id);
                if (oldItem != null)
                {
                    model.ImageUrl = oldItem.ImageUrl;
                }
            }

            _context.Posts.Update(model);
            await _context.SaveChangesAsync();

            return RedirectToAction("Index");
        }

        // ==========================================================
        // 4. XÓA BÀI VIẾT KHỎI HỆ THỐNG
        // Tuyến đường chuẩn: /Post/Delete/{id}
        // ==========================================================
        [HttpGet("{id?}")]
        public IActionResult Delete(int id)
        {
            var post = _context.Posts.Find(id);
            if (post != null)
            {
                _context.Posts.Remove(post);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}