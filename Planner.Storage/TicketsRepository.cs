using System;
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
	    SprintNr int NOT NULL,
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
                                   "Tickets (SprintNr, Hrs, PersonName, TicketUrl, Notes) " +
                                   "values (@SprintNr, @Hrs, @PersonName, @TicketUrl, @Notes)",
                    new {item.SprintNr, item.Hrs, item.PersonName, item.TicketUrl, item.Notes});
                connection.Close();
            }
        }

        public void Edit(Ticket item)
        {
            using (var connection = new SqlConnection(_connection))
            {
                connection.Open();
                connection.Execute("Update " +
                                   "Tickets set SprintNr = @SprintNr, Hrs = @Hrs, PersonName = @PersonName, " +
                                   "TicketUrl = @TicketUrl, Notes = @Notes Where Id = @Id ",
                    new { item.Id, item.SprintNr, item.Hrs, item.PersonName, item.TicketUrl, item.Notes });
                connection.Close();
            }
        }

        public void Delete(Ticket item)
        {
            using (SqlConnection connection = new SqlConnection(_connection))
            {
                connection.Open();
                connection.Execute("Delete from Tickets Where Id = @Id", new { item.Id });
                connection.Close();
            }
        }

        public IEnumerable<Ticket> GetAll()
        {
            List<Ticket> tickets;
            using (var connection = new SqlConnection(_connection))
            {
                connection.Open();
                tickets = connection.Query<Ticket>("SELECT Id, SprintNr, Hrs," +
                                                   "PersonName, TicketUrl, Notes FROM [Tickets]").ToList();
                connection.Close();
            }
            return tickets;
        }
    }
}