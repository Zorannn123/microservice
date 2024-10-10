using Common.DTO;
using Microsoft.ServiceFabric.Services.Remoting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Interfaces
{
    public interface IProductService : IService
    {
        List<ProductDto> GetAll();
        Task<bool> AddEntity(ProductDto entity);
        bool RemoveEntity(long id);
        bool ModifyEntity(ProductDto entity, long id);
        long GetWithId(ProductDto product);
        double GetProductPrice(long productId);
    }
}
