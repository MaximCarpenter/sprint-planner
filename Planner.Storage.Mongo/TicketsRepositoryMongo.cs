using MongoDB.Driver;

namespace Planner.Storage
{
    public class TicketsRepositoryMongo : RepositoryMongoBase<Ticket>
    {
        public TicketsRepositoryMongo(string connection) : base(connection)
        {

            _table = "Tickets";
            _counterName = "ticketid";
        }

        protected override UpdateDefinition<Ticket> UpdateDefinition(Ticket item)
        {
            return Builders<Ticket>.Update
                .Set(it => it.Hrs, item.Hrs)
                .Set(it => it.Notes, item.Notes)
                .Set(it => it.PersonId, item.PersonId)
                .Set(it => it.SprintId, item.SprintId)
                .Set(it => it.Resolved, item.Resolved)
                .Set(it => it.TicketUrl, item.TicketUrl);
        }
    }
}