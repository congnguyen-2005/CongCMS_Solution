using CMS.data;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class OrderDetailController : Controller
    {
        private readonly ApplicationDbContext _context;
        public OrderDetailController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            var data = _context.OrderDetails.ToList();
            return View(data);
        }
    }
}