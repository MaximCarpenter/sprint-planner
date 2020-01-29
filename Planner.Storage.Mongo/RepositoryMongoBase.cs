using System.Collections.Generic;
using System.Linq;
using MongoDB.Driver;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;


namespace Planner.Storage
{
    public abstract class RepositoryMongoBase<T> : IRepository<T> where T : EntityBase
    {
        private MongoClient _client;
        private readonly IMongoDatabase _database;
        private string _dbName = "SprintPlanner";
        protected string _table;
        private string _counters = "Counters";
        protected string _counterName;

        public RepositoryMongoBase(string connection)
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
            col.InsertOne(BsonDocument.Parse($"{{_id: \"{_counterName}\", sequence_value: 0}}"));
        }

        private int GetNextSequence()
        {
            var col = _database.GetCollection<BsonDocument>(_counters);
            var id = (int)col.FindOneAndUpdate(Builders<BsonDocument>.Filter.Eq("_id", _counterName),
                Builders<BsonDocument>.Update.Inc("sequence_value", 1))?.GetValue("sequence_value");
            return id;
        }

        public void Add(T item)
        {
            var col = _database.GetCollection<BsonDocument>(_table);
            item.Id = GetNextSequence();
            var bson = item.ToBsonDocument();
            col.InsertOne(bson);
        }

        public void Edit(T item)
        {
            var col = _database.GetCollection<T>(_table);
            var updateOption = new UpdateOptions { IsUpsert = true };
            var update = UpdateDefinition(item);

            var filter = Builders<T>.Filter.Eq("Id", item.Id);
            col.UpdateOne(filter, update, updateOption);
        }

        protected abstract UpdateDefinition<T> UpdateDefinition(T item);


        public void Delete(int id)
        {
            var col = _database.GetCollection<T>(_table);
            col.DeleteOne(Builders<T>.Filter.Eq("Id", id));
        }

        public IEnumerable<T> GetAll()
        {
            var col = _database.GetCollection<BsonDocument>(_table);
            List<T> tickets = new List<T>();
            using (var cursor = col.Find(new BsonDocument()).ToCursor())
            {
                while (cursor.MoveNext()) //Cursor maintain the batch size here.
                {
                    foreach (var doc in cursor.Current) ////represent the current document in the cursor
                    {
                        var myObj = BsonSerializer.Deserialize<T>(doc);
                        tickets.Add(myObj);
                    }
                }
            }

            return tickets;
        }
    }
}