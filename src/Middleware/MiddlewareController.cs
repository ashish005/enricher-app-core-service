using Microsoft.AspNetCore.Mvc;

namespace Enricher.Middleware
{
    public class MiddlewareController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}