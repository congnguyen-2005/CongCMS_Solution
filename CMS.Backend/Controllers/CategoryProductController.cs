using CMS.data;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class CategoryProductController : Controller
    {
        private readonly ApplicationDbContext _context;
        public CategoryProductController(ApplicationDbContext context) { _context = context; }

        public IActionResult Index()
        {
            var data = _context.CategoriesProducts.ToList();
            return View(data);
        }
    }
}