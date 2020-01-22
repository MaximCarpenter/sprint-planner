using System.Linq;
using System.Web.Mvc;
using Planner.Storage;

namespace Planner.Controllers
{
    public class HomeController : Controller
    {
        private readonly IRepository<Ticket> _repository;
        public HomeController(IRepository<Ticket> repository)
        {
            _repository = repository;
        }

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult AddRecord(Ticket item)
        {
            _repository.Add(item);
            return Json(item.Id);
        }

        public void EditRecord(Ticket item)
        {
            _repository.Edit(item);
        }

        public void DeleteRecord(Ticket item)
        {
            _repository.Delete(item);
        }

        public JsonResult GetRecords()
        {
            var list = _repository.GetAll().ToList();
            return Json(list);
        }
    }
}