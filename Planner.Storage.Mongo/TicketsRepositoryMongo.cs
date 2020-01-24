using System.Collections.Generic;
using System.Linq;
using MongoDB.Driver;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;


namespace Planner.Storage
{
    public class TicketsRepositoryMongo : IRepository<Ticket>
    {
        private MongoClient _client;
        private readonly IMongoDatabase _database;
        private string _dbName = "SprintPlanner";
        private string _table = "Tickets";
        private string _counters = "Counters";
        public TicketsRepositoryMongo(string connection)
        {
            _client = new MongoClient(connection);
            _database = _client.GetDatabase(_dbName);
            AddCounter();
        }

        private void AddCounter()
        {
            var dbExists = _client.ListDatabases().ToList()
                .Any(c => c?.ToString().Contains(_dbName) ?? false);
            if (dbExists) return;

            _database.CreateCollection(_counters);
            var col = _database.GetCollection<BsonDocument>(_counters);
            col.InsertOne(BsonDocument.Parse("{_id: \"ticketid\", sequence_value: 0}"));
        }

        private int GetNextSequence()
        {
            var col = _database.GetCollection<BsonDocument>(_counters);
            var id = (int)col.FindOneAndUpdate(Builders<BsonDocument>.Filter.Eq("_id", "ticketid"),
                Builders<BsonDocument>.Update.Inc("sequence_value", 1))?.GetValue("sequence_value");
            return id;
        }

        public void Add(Ticket item)
        {
            var col = _database.GetCollection<BsonDocument>(_table);
            item.Id = GetNextSequence();
            var bson = item.ToBsonDocument();
            col.InsertOne(bson);
        }

        public void Edit(Ticket item)
        {
            var col = _database.GetCollection<BsonDocument>(_table);

            var bson = item.ToBsonDocument();
            col.UpdateOne(Builders<BsonDocument>.Filter.Eq("_id", item.Id), bson);
        }

        public void Delete(Ticket item)
        {
            var col = _database.GetCollection<BsonDocument>(_table);
            col.DeleteOne(Builders<BsonDocument>.Filter.Eq("_id", item.Id));
        }

        public IEnumerable<Ticket> GetAll()
        {
            var col = _database.GetCollection<BsonDocument>(_table);
            List<Ticket> tickets = new List<Ticket>();
            using (var cursor = col.Find(new BsonDocument()).ToCursor())
            {
                while (cursor.MoveNext()) //Cursor maintain the batch size here.
                {
                    foreach (var doc in cursor.Current)////represent the current document in the cursor
                    {
                        var myObj = BsonSerializer.Deserialize<Ticket>(doc);
                        tickets.Add(myObj);
                    }
                }
            }
            return tickets;
        }
    }
}