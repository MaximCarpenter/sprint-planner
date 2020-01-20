using System;
using System.Collections.Generic;
using Autofac;
using Autofac.Integration.Mvc;
using System.Web.Mvc;
using Autofac.Core;
using Planner.Models;

namespace Planner.App_Start
{
    public class AutofacConfig
    {
        public static void ConfigureContainer()
        {
            var builder = new ContainerBuilder();
            builder.RegisterControllers(typeof(MvcApplication).Assembly);
            builder.RegisterType<TicketsRepository>()
                .As<IRepository<Ticket>>()
                .WithParameters(new List<Parameter> {new NamedParameter("fileName", "d://planner/storage")})
                .InstancePerRequest(); 

            var container = builder.Build();
            DependencyResolver.SetResolver(new AutofacDependencyResolver(container));
        }
    }
}