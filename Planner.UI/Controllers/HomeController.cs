using System.Web.Mvc;

namespace Planner.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Tickets()
        {
            return View("Index");
        }

        public ActionResult Sprints()
        {
            return View();
        }

        public ActionResult Members()
        {
            return View();
        }

        public ActionResult Chart()
        {
            return View();
        }
    }
}