using SurveyTalkService.DataAccess.Repositories.interfaces;
using Microsoft.EntityFrameworkCore;
using SurveyTalkService.DataAccess.Data;
using System.Linq.Expressions;

namespace SurveyTalkService.DataAccess.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        private readonly AppDbContext _appDbContext;
        internal DbSet<T> _dbSet;

        public GenericRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
            _dbSet = _appDbContext.Set<T>();
        }

        public IQueryable<T> FindAll(Expression<Func<T, bool>>? predicate = null, params Expression<Func<T, object>>[] includeProperties)
        {
            IQueryable<T> items = _appDbContext.Set<T>();

            if (includeProperties.Any())
            {
                foreach (var property in includeProperties)
                {
                    items = items.Include(property);
                }
            }


            if (predicate != null)
            {
                items = items.Where(predicate);
            }

            return items;
        }


        public async Task<T?> FindByIdAsync(int id, params Expression<Func<T, object>>[] includeProperties)
        {
            var query = _appDbContext.Set<T>().AsQueryable();

            // Thêm Include() với các thuộc tính liên quan
            foreach (var includeProperty in includeProperties)
            {
                query = query.Include(includeProperty);
            }

            return await query.FirstOrDefaultAsync(e => EF.Property<int>(e, "Id") == id);
        }

        public async Task<T?> CreateAsync(T entity)
        {
            var entry = await _dbSet.AddAsync(entity);
            await _appDbContext.SaveChangesAsync();
            return entry.Entity;
        }

        public async Task<T?> UpdateAsync(int id, T entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity), "Entity không được để null.");
            }

            var existingEntity = await _dbSet.FindAsync(id);
            if (existingEntity == null)
            {
                Console.WriteLine($"Không tìm thấy entity với ID {id}.");
                return null;
            }

            _appDbContext.Entry(existingEntity).State = EntityState.Detached;
            _appDbContext.Entry(entity).State = EntityState.Modified;
            // _appDbContext.Entry(existingEntity).CurrentValues.SetValues(entity);


            await _appDbContext.SaveChangesAsync();
            return entity;
        }

        public async Task<T?> DeleteAsync(object id)
        {
            var entity = await _dbSet.FindAsync(id);
            if (entity != null)
            {
                _dbSet.Remove(entity);
                await _appDbContext.SaveChangesAsync();
                return entity;
            }

            return null;
        }



    }
}
