using MongoDB.Driver;


namespace Planner.Storage
{
    public class SprintsRepositoryMongo : RepositoryMongoBase<Sprint>
    {
        public SprintsRepositoryMongo(string connection) : base(connection)
        {
            _counterName = "sprintid";
            _table = "Sprints";
        }


        protected override UpdateDefinition<Sprint> UpdateDefinition(Sprint item)
        {
            return Builders<Sprint>.Update
                .Set(it => it.Start, item.Start)
                .Set(it => it.End, item.End)
                .Set(it => it.Comments, item.Comments)
                .Set(it => it.Nr, item.Nr)
                .Set(it => it.Status, item.Status)
                .Set(it => it.Name, item.Name);
        }
    }
}