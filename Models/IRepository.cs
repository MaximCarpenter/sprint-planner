﻿using System.Collections.Generic;

namespace Planner.Models
{
    public interface IRepository<T> where T : class
    {
        void Add(T item);
        void Edit(T item);
        void Delete(T item);
        IEnumerable<T> GetAll();
    }
}