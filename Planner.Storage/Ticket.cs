
namespace Planner.Storage
{
    public class Ticket
    {
        public int Id { get; set; }
        public int SprintNr { get; set; }
        public double Hrs { get; set; }
        public string PersonName { get; set; }
        public string TicketUrl { get; set; }
        public string Notes { get; set; }
    }
}