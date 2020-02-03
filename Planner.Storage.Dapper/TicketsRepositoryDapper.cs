using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using Dapper;

namespace Planner.Storage
{
    /*
    IF OBJECT_ID('[dbo].[Tickets]') IS NULL 
    BEGIN
	    CREATE TABLE [dbo].Ticket(
	    Id int NOT NULL IDENTITY PRIMARY KEY,
	    SprintId int NOT NULL,
	    Hrs float NOT NULL,
	    PersonName varchar (50) NOT NULL,
	    TicketUrl varchar (200) NOT NULL,
	    Notes varchar (200) NULL)
    END		
    --GO
     */
    public class TicketsRepositoryDapper : IRepository<Ticket>
    {
        private readonly string _connection;
        public TicketsRepositoryDapper(string connection)
        {
            _connection = connection;
        }

        public void Add(Ticket item)
        {
            using (var connection = new SqlConnection(_connection))
            {
                connection.Open();
                connection.Execute("Insert into " +
                                   "Tickets (SprintId, Hrs, PersonId, TicketUrl, Notes) " +
                                   "values (@SprintId, @Hrs, @PersonId, @TicketUrl, @Notes)",
                    new {item.SprintId, item.Hrs, item.PersonId, item.TicketUrl, item.Notes});
                connection.Close();
            }
        }

        public void Edit(Ticket item)
        {
            using (var connection = new SqlConnection(_connection))
            {
                connection.Open();
                connection.Execute("Update " +
                                   "Tickets set SprintId = @SprintId, Hrs = @Hrs, PersonId = @PersonId, " +
                                   "TicketUrl = @TicketUrl, Notes = @Notes Where Id = @Id ",
                    new { item.Id, item.SprintId, item.Hrs, item.PersonId, item.TicketUrl, item.Notes });
                connection.Close();
            }
        }

        public void Delete(int id)
        {
            using (SqlConnection connection = new SqlConnection(_connection))
            {
                connection.Open();
                connection.Execute("Delete from Tickets Where Id = @Id", new { id });
                connection.Close();
            }
        }

        public IEnumerable<Ticket> GetAll()
        {
            List<Ticket> tickets;
            using (var connection = new SqlConnection(_connection))
            {
                connection.Open();
                tickets = connection.Query<Ticket>("SELECT Id, SprintId, Hrs," +
                                                   "PersonId, TicketUrl, Notes FROM [Tickets]").ToList();
                connection.Close();
            }
            return tickets;
        }
    }
}