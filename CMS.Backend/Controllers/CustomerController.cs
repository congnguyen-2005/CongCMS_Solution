using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    public class CustomerController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
