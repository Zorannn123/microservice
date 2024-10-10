using Common.DTO;
using Microsoft.ServiceFabric.Services.Remoting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Interfaces
{
    public interface IOrderService : IService
    {
        void AddEntity(OrderDto entity);
        List<OrderDto> GetUndelivered();
        bool TakeOrder(long orderid, long userId);
        List<OrderDto> History(long userid);
        List<OrderDto> HistoryDeliverer(long userid);
        OrderDto GetCurrentOrder(long userid);
    }
}
