using MongoDB.Driver;

namespace Planner.Storage
{
    public class MembersRepositoryMongo : RepositoryMongoBase<Member>
    {
        public MembersRepositoryMongo(string connection) : base(connection)
        {
            _table = "Members";
            _counterName = "membersid";
        }

        protected override UpdateDefinition<Member> UpdateDefinition(Member item)
        {
            return Builders<Member>.Update
                .Set(it => it.Name, item.Name);
        }
    }
}