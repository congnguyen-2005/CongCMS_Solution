using CMS.data.Entities;
using System.Collections.Generic;

namespace CMS.Backend.Models
{
    public class HomeViewModel
    {
        public IEnumerable<Post> LatestPosts { get; set; }
        public IEnumerable<Product> FeaturedProducts { get; set; }
    }
}