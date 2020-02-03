using Planner.Storage;

namespace Planner.Controllers
{
    public class MembersController : ApiControllerBase<Member>
    {
        public MembersController(IRepository<Member> repository) : base(repository)
        {
        }
    }
}