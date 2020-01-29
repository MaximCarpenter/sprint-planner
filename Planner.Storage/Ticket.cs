﻿
namespace Planner.Storage
{
    public abstract class EntityBase
    {
        public int Id { get; set; }
    }

    public class Ticket: EntityBase
    {
        public int SprintId { get; set; }
        public double Hrs { get; set; }
        public string PersonName { get; set; }
        public string TicketUrl { get; set; }
        public string Notes { get; set; }
    }
}