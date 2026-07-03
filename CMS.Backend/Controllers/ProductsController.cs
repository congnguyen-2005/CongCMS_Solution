using CMS.data;
using CMS.data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Authorize]
    [ApiExplorerSettings(IgnoreApi = false, GroupName = "GiaoDienAdmin")]
    [Route("[controller]/[action]")]
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ========================================================
        // 🌟 HÀM MỚI: LẤY DỮ LIỆU JSON THUẦN TÚY CỦA 1 SẢN PHẨM
        // Đường dẫn test trên Swagger: /Product/GetJson/{id}
        // ========================================================
        [HttpGet("{id}")]
        public IActionResult GetJson(int id)
        {
            // Tìm kiếm sản phẩm trong database kèm theo bảng danh mục liên kết
            var item = _context.Products
                .Include(p => p.CategoryProduct)
                .FirstOrDefault(p => p.Id == id);

            if (item == null)
            {
                return NotFound(new { message = $"Không tìm thấy sản phẩm có ID bằng {id}" });
            }

            // ĐỐI SÁCH: Thực hiện phẳng hóa dữ liệu trả về (Select Object)
            // Việc này giúp Swagger xuất ra chuỗi JSON đẹp và chống hoàn toàn lỗi sập hệ thống "Object cycle"
            return Ok(new
            {
                item.Id,
                item.Name,
                item.Description,
                item.Price,
                item.StockQuantity,
                item.ImageUrl,
                item.CategoryProductId,
                CategoryName = item.CategoryProduct != null ? item.CategoryProduct.Name : "Chưa phân loại"
            });
        }

        // ========================================================
        // 1. HIỂN THỊ DANH SÁCH SẢN PHẨM (Trả về giao diện HTML)
        // ========================================================
        [HttpGet]
        public IActionResult Index()
        {
            var data = _context.Products
                .Include(p => p.CategoryProduct)
                .OrderByDescending(p => p.Id)
                .ToList();

            return View(data);
        }

        // ========================================================
        // 2. THÊM SẢN PHẨM MỚI (GET & POST)
        // ========================================================
        [HttpGet]
        public IActionResult Create()
        {
            ViewBag.CategoryList = new SelectList(_context.CategoriesProducts, "Id", "Name");
            return View();
        }

        [HttpPost]
        public IActionResult Create(Product model, IFormFile uploadImage)
        {
            if (string.IsNullOrEmpty(model.Name))
            {
                ModelState.AddModelError("Name", "Tên sản phẩm không được để trống.");
                ViewBag.CategoryList = new SelectList(_context.CategoriesProducts, "Id", "Name", model.CategoryProductId);
                return View(model);
            }

            if (uploadImage != null && uploadImage.Length > 0)
            {
                string folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "products");
                if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                string filePath = Path.Combine(folder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    uploadImage.CopyTo(stream);
                }

                model.ImageUrl = "/uploads/products/" + fileName;
            }
            else
            {
                model.ImageUrl = "/uploads/products/default-product.png";
            }

            model.Id = 0;
            _context.Products.Add(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // ========================================================
        // 3. SỬA SẢN PHẨM (GET & POST - Trả về giao diện HTML)
        // ========================================================
        [HttpGet("{id?}")]
        public IActionResult Edit(int id)
        {
            var item = _context.Products.Find(id);
            if (item == null) return NotFound();

            ViewBag.CategoryList = new SelectList(_context.CategoriesProducts, "Id", "Name", item.CategoryProductId);
            return View(item);
        }

        [HttpPost("{id?}")]
        public IActionResult Edit(Product model, IFormFile uploadImage)
        {
            if (string.IsNullOrEmpty(model.Name))
            {
                ModelState.AddModelError("Name", "Tên sản phẩm không được để trống.");
                ViewBag.CategoryList = new SelectList(_context.CategoriesProducts, "Id", "Name", model.CategoryProductId);
                return View(model);
            }

            if (uploadImage != null && uploadImage.Length > 0)
            {
                string folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "products");
                if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                string filePath = Path.Combine(folder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    uploadImage.CopyTo(stream);
                }

                model.ImageUrl = "/uploads/products/" + fileName;
            }
            else
            {
                var oldItem = _context.Products.AsNoTracking().FirstOrDefault(p => p.Id == model.Id);
                if (oldItem != null)
                {
                    model.ImageUrl = oldItem.ImageUrl;
                }
            }

            _context.Products.Update(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // ========================================================
        // 4. XÓA SẢN PHẨM
        // ========================================================
        [HttpGet("{id?}")]
        public IActionResult Delete(int id)
        {
            var item = _context.Products.Find(id);
            if (item != null)
            {
                _context.Products.Remove(item);
                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }
        [HttpGet("{id}")] // Định tuyến chính xác cấp hàm để nhận số ID từ URL (/Product/Details/3)
        public IActionResult Details(int id)
        {
            // 1. Tìm sản phẩm hiện tại và nạp kèm bảng Danh mục để hiển thị tên phân khúc
            var product = _context.Products
                .Include(p => p.CategoryProduct)
                .FirstOrDefault(p => p.Id == id);

            // Nếu không tìm thấy ID sản phẩm này trong Database, trả về trang 404 chuẩn của hệ thống
            if (product == null)
            {
                return NotFound();
            }

            // 2. Tìm các sản phẩm cùng phân khúc (cùng CategoryProductId và loại trừ sản phẩm hiện tại)
            // Lấy tối đa 3 sản phẩm để hiển thị vừa vặn trên Grid giao diện của bạn
            ViewBag.RelatedProducts = _context.Products
                .Where(p => p.CategoryProductId == product.CategoryProductId && p.Id != product.Id)
                .Take(3)
                .ToList();

            // 3. Trả về đúng file giao diện Details.cshtml kèm cục dữ liệu Model
            return View(product);
        }
  
        
    }
}