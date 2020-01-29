using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Planner.Storage;

namespace Planner.Controllers
{
    public class TicketsController : ApiController
    {
        private readonly IRepository<Ticket> _repository;
        public TicketsController(IRepository<Ticket> repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public IEnumerable<Ticket> Get()
        {
            return _repository.GetAll();
        }

        [HttpGet]
        public Ticket Get(int id)
        {
            return _repository.GetAll().FirstOrDefault(c => c.Id == id);
        }
        
        [HttpPost]
        public int Post(Ticket item)
        {
            _repository.Add(item);
            return item.Id;
        }

        [HttpPut]
        public void Put(Ticket item)
        {
            _repository.Edit(item);
        }

        [HttpDelete]
        public void Delete(int id)
        {
            _repository.Delete(id);
        }
    }
}