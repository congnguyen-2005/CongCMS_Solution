using CMS.data;
using CMS.data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")] // Đường dẫn: api/CategoryApi
    [ApiController]
    [Authorize]
    [ApiExplorerSettings(IgnoreApi = false, GroupName = "HeThongAPI")]
    public class CategoryApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoryApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/CategoryApi
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _context.Categories.ToListAsync();
            return Ok(categories);
        }

        // GET: api/CategoryApi/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return NotFound();
            return Ok(category);
        }

        // POST: api/CategoryApi
        [HttpPost]
        public async Task<IActionResult> Create(Category model)
        {
            _context.Categories.Add(model);
            await _context.SaveChangesAsync();
            return Ok(model);
        }

        // PUT: api/CategoryApi/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Edit(int id, Category model)
        {
            if (id != model.Id) return BadRequest();

            _context.Categories.Update(model);
            await _context.SaveChangesAsync();
            return Ok(model);
        }

        // DELETE: api/CategoryApi/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return NotFound();

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Xóa thành công" });
        }
    }
}