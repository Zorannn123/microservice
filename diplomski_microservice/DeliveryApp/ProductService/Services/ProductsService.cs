using AutoMapper;
using Common.DTO;
using Common.Interfaces;
using Common.Models;
using ProductService.Database;

namespace ProductService.Services
{
    public class ProductsService : IProductService
    {
        private readonly IMapper _mapper;
        private readonly ProductDbContext _dbContext;

        public ProductsService(IMapper mapper, ProductDbContext dbContext)
        {
            _mapper = mapper;
            _dbContext = dbContext;
        }
        public async Task<bool> AddEntity(ProductDto entity)
        {
            try
            {
                Product product = _mapper.Map<Product>(entity);
                _dbContext.Products.Add(product);
                _dbContext.SaveChanges();
            }
            catch (Exception e)
            {
                return false;
            }

            return true;
        }

        public List<ProductDto> GetAll()
        {
            return _mapper.Map<List<ProductDto>>(_dbContext.Products.ToList());
        }

        public long GetWithId(ProductDto product)
        {
            var entity = _dbContext.Products
                .FirstOrDefault(s => s.Name == product.Name && s.Ingredients == product.Ingredients);

            if (entity == null)
            {
                throw new InvalidOperationException("Product not found.");
            }

            return _mapper.Map<ProductDto>(entity).ProductId;
        }

        //TODO:
        public bool ModifyEntity(ProductDto entity, long id)
        {
            throw new System.NotImplementedException();
        }

        public bool RemoveEntity(long id)
        {
            try
            {
                var product = _dbContext.Products.FirstOrDefault(p => p.ProductId == id);

                if (product == null)
                {
                    return false;
                }

                _dbContext.Products.Remove(product);
                _dbContext.SaveChanges();
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error removing product: {e.Message}");
                return false;
            }

            return true;
        }

        public double GetProductPrice(long productId)
        {
            var product = _dbContext.Products.FirstOrDefault(p => p.ProductId == productId);

            if (product == null)
            {
                throw new InvalidOperationException("Product not found.");
            }

            return product.Price;
        }
    }
}
