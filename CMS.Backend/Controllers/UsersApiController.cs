using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using CMS.data; // Thay bằng namespace chứa ApplicationDbContext của bạn
using CMS.data.Entities;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
   

    // DTO để nhận dữ liệu từ React
    public class RegisterRequest
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }
}