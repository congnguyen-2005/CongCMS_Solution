using CMS.data;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;
        public ProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            var data = _context.Products.ToList();
            return View(data);
        }
    }
}