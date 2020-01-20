using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Newtonsoft.Json;

namespace Planner.Models
{
    public class TicketsRepository : IRepository<Ticket>
    {
        private readonly string _filePath;

        public TicketsRepository(string fileName)
        {
            _filePath = fileName;
            if (!File.Exists(_filePath))
                File.CreateText(_filePath);
        }

        public void Add(Ticket item)
        {
            var lastLine = File.ReadLines(_filePath).LastOrDefault();
            if (lastLine == null) item.Id = 0;
            else
            {
                var val = (Ticket) JsonConvert.DeserializeObject(lastLine, typeof(Ticket));
                item.Id = val.Id + 1;
            }
            
            var convertedJson = JsonConvert.SerializeObject(item, Formatting.None);
            if (item.Id > 0)
                convertedJson = Environment.NewLine + convertedJson;

            File.AppendAllText(_filePath, convertedJson);
        }

        public void Edit(Ticket item)
        {
            var file = File.ReadAllLines(_filePath);
            foreach (var line in file)
            {
                if (line.Contains($"Id:{item.Id}")) continue;

                using (var writer = new StreamWriter(_filePath))
                {
                    var editItem = JsonConvert.SerializeObject(item, Formatting.None);
                    writer.WriteLine(editItem);
                }
            }
        }

        public void Delete(Ticket item)
        {
            var lines = File.ReadAllLines(_filePath).Where(line => line.Contains($"{{\"Id\":{item.Id},")).ToArray();
            File.WriteAllLines(_filePath, lines);
        }

        public IEnumerable<Ticket> GetAll()
        {
            return File
                .ReadAllLines(_filePath)
                .Select(c => (Ticket) JsonConvert.DeserializeObject(c, typeof(Ticket)));
        }
    }
}