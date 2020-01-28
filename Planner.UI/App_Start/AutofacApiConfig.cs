﻿using System.Collections.Generic;
using System.Configuration;
using System.Reflection;
using System.Web.Http;
using Autofac;
using Autofac.Integration.Mvc;
using System.Web.Mvc;
using Autofac.Core;
using Autofac.Integration.WebApi;
using Planner.Storage;

namespace Planner.App_Start
{
    public class AutofacApiConfig
    {
        public static IContainer Container;

        public static void Initialize(HttpConfiguration config)
        {
            Initialize(config, RegisterServices(new ContainerBuilder()));
        }


        public static void Initialize(HttpConfiguration config, IContainer container)
        {
            config.DependencyResolver = new AutofacWebApiDependencyResolver(container);
        }

        private static IContainer RegisterServices(ContainerBuilder builder)
        {
            //Register your Web API controllers.  
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly());

            var connectionString = ConfigurationManager.ConnectionStrings["ConnectionStringMongo"].ConnectionString;
            builder.RegisterType<TicketsRepositoryMongo>()
                .As<IRepository<Ticket>>()
                .WithParameters(new List<Parameter> {new NamedParameter("connection", connectionString)})
                .InstancePerRequest();

            //Set the dependency resolver to be Autofac.  
            Container = builder.Build();

            return Container;
        }
    }
}