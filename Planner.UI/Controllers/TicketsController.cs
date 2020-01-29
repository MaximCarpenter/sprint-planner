using Planner.Storage;

namespace Planner.Controllers
{
    public class TicketsController : ApiControllerBase<Ticket>
    {
        public TicketsController(IRepository<Ticket> repository) : base(repository)
        {
        }
    }
}