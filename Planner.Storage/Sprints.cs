
using System;

namespace Planner.Storage
{
    public class Sprint : EntityBase
    {
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public int Status { get; set; }
        public string Comments { get; set; }

        public int Nr { get; set; }
        public string Name { get; set; }
    }
}