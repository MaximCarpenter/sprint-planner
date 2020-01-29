using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Planner.Storage;

namespace Planner.Controllers
{
    public class ApiControllerBase<T> : ApiController where T: EntityBase
    {
        protected readonly IRepository<T> _repository;
        public ApiControllerBase(IRepository<T> repository)
        {
            _repository = repository;
        }
        [HttpGet]
        public IEnumerable<T> Get()
        {
            return _repository.GetAll();
        }

        [HttpGet]
        public T Get(int id)
        {
            return _repository.GetAll().FirstOrDefault(c => c.Id == id);
        }
        
        [HttpPost]
        public int Post(T item)
        {
            _repository.Add(item);
            return item.Id;
        }

        [HttpPut]
        public void Put(T item)
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