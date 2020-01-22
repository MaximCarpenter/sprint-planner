using System.Collections.Generic;
using System.Configuration;
using Autofac;
using Autofac.Integration.Mvc;
using System.Web.Mvc;
using Autofac.Core;
using Planner.Storage;

namespace Planner.App_Start
{
    public class AutofacConfig
    {
        public static void ConfigureContainer()
        {
            var builder = new ContainerBuilder();
            builder.RegisterControllers(typeof(MvcApplication).Assembly);
            var connectionString = ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;
            builder.RegisterType<TicketsRepositoryDapper>()
                .As<IRepository<Ticket>>()
                .WithParameters(new List<Parameter> {new NamedParameter("connection", connectionString) })
                .InstancePerRequest(); 

            var container = builder.Build();
            DependencyResolver.SetResolver(new AutofacDependencyResolver(container));
        }
    }
}