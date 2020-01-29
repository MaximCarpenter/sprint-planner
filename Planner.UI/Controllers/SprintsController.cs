using Planner.Storage;

namespace Planner.Controllers
{
    public class SprintsController : ApiControllerBase<Sprint> 
    {
        public SprintsController(IRepository<Sprint> repository) : base(repository)
        {
        }
    }
}