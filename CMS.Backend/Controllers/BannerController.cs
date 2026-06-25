using CMS.data;
using CMS.data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Authorize]
    [ApiExplorerSettings(IgnoreApi = true)]
    public class BannerController : Controller
    {
        private readonly ApplicationDbContext _context;
        public BannerController(ApplicationDbContext context) => _context = context;

        public IActionResult Index()
        {
            var data = _context.Banners.OrderBy(b => b.DisplayOrder).ToList();
            return View(data);
        }

        [HttpGet]
        public IActionResult Create() => View();

        [HttpPost]
        public IActionResult Create(Banner model, IFormFile uploadImage)
        {
            // Xử lý upload ảnh Banner
            if (uploadImage != null && uploadImage.Length > 0)
            {
                string folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "banners");
                if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                string filePath = Path.Combine(folder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    uploadImage.CopyTo(stream);
                }
                model.ImageUrl = "/uploads/banners/" + fileName;
            }
            else
            {
                model.ImageUrl = "https://dummyimage.com/1200x400/18181b/00f0ff.png&text=CameraClick+Banner";
            }

            _context.Banners.Add(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        [HttpGet]
        public IActionResult Edit(int id)
        {
            var item = _context.Banners.Find(id);
            if (item == null) return NotFound();
            return View(item);
        }

        [HttpPost]
        public IActionResult Edit(Banner model, IFormFile uploadImage)
        {
            if (uploadImage != null && uploadImage.Length > 0)
            {
                string folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "banners");
                if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                string filePath = Path.Combine(folder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    uploadImage.CopyTo(stream);
                }
                model.ImageUrl = "/uploads/banners/" + fileName;
            }
            else
            {
                // Nếu không upload ảnh mới, giữ lại link ảnh cũ
                var oldItem = _context.Banners.AsNoTracking().FirstOrDefault(b => b.Id == model.Id);
                if (oldItem != null) model.ImageUrl = oldItem.ImageUrl;
            }

            _context.Banners.Update(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        public IActionResult Delete(int id)
        {
            var item = _context.Banners.Find(id);
            if (item != null)
            {
                _context.Banners.Remove(item);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}