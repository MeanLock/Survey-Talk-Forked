using System.Linq.Expressions;

namespace SurveyTalkService.DataAccess.Repositories.interfaces
{
    public interface IGenericRepository<T> where T : class
    {
        IQueryable<T> FindAll(Expression<Func<T, bool>>? predicate = null, params Expression<Func<T, object>>[] includeProperties);
        Task<T?> FindByIdAsync(int id, params Expression<Func<T, object>>[] includeProperties);

        Task<T?> CreateAsync(T entity);
        Task<T?> UpdateAsync(int id, T entity);
        Task<T?> DeleteAsync(object id);
    }
}
