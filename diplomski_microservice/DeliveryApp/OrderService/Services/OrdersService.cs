using AutoMapper;
using Common.DTO;
using Common.Enums;
using Common.Interfaces;
using Common.Models;
using Microsoft.EntityFrameworkCore;
using OrderService.Database;

namespace OrderService.Services
{
    public class OrdersService : IOrderService
    {
        private readonly IMapper _mapper;
        private readonly OrderDbContext _dbContext;
        private static readonly Object thisLock = new Object();

        public OrdersService(IMapper mapper, OrderDbContext dbContext)
        {
            _mapper = mapper;
            _dbContext = dbContext;
        }
        public void AddEntity(OrderDto entity)
        {
            try
            {
                Order order = _mapper.Map<Order>(entity);
                order.State = OrderStatus.NOTDELEVERED;
                order.DeliveredBy = 0;
                order.DateTimeOfDelivery = DateTime.Now;
                _dbContext.Orders.Add(order);
                _dbContext.SaveChanges();
            }
            catch
            {
                return;
            }
        }

        public OrderDto GetCurrentOrder(long userid)
        {
            var order = _dbContext.Orders
                .Where(x => x.UserId == userid || x.DeliveredBy == userid)
                .Where(x => x.DateTimeOfDelivery < DateTime.Now)
                .Include(x => x.OrderParts)
                .OrderByDescending(x => x.DateTimeOfDelivery) // Order by the most recent delivery date
                .FirstOrDefault(); // Get the latest order

            if (order == null)
                return null;

            return _mapper.Map<OrderDto>(order);
        }

        public List<OrderDto> GetUndelivered()
        {
            var ret = _mapper.Map<List<OrderDto>>(_dbContext.Orders.Include(x => x.OrderParts).Where(c => c.State == OrderStatus.NOTDELEVERED).ToList());
            foreach (OrderDto item in ret)
            {
                if (item.DeliveredBy != 0 && item.DateTimeOfDelivery > DateTime.Now)
                {
                    item.State = "DELIVERING";
                }
            }
            return ret;
        }

        public List<OrderDto> History(long userid)
        {
            var ret = _mapper.Map<List<OrderDto>>(_dbContext.Orders.Include(x => x.OrderParts).Where(x => x.UserId == userid).Where(x => x.DeliveredBy != 0).ToList());
            foreach (OrderDto item in ret)
            {
                if (item.DeliveredBy != 0 && item.DateTimeOfDelivery > DateTime.Now)
                {
                    item.State = "DELIVERING";
                }
            }
            return ret;
        }

        public List<OrderDto> HistoryDeliverer(long userid)
        {
            var ret = _mapper.Map<List<OrderDto>>(_dbContext.Orders.Include(x => x.OrderParts).Where(x => x.DeliveredBy == userid).Where(x => x.DeliveredBy != 0).ToList());
            foreach (OrderDto item in ret)
            {
                if (item.DeliveredBy != 0 && item.DateTimeOfDelivery > DateTime.Now)
                {
                    item.State = "DELIVERING";
                }
            }
            return ret;
        }

        Random random = new Random();
        public bool TakeOrder(long orderid, long userId)
        {
            lock (thisLock)
            {
                List<Order> orders = (List<Order>)_dbContext.Orders.Where(x => x.DateTimeOfDelivery > DateTime.UtcNow).Where(x => x.DeliveredBy == userId).ToList();
                List<Order> orders2 = (List<Order>)_dbContext.Orders.Where(x => x.OrderId == orderid).Where(x => x.State == OrderStatus.DELIVERED).ToList();
                if (orders2.Count == 0)
                {
                    Order order = _dbContext.Orders.Find(orderid);
                    order.State = OrderStatus.DELIVERED;
                    order.DeliveredBy = userId;
                    order.DateTimeOfDelivery = DateTime.Now.AddMinutes(random.Next(5, 30));
                    _dbContext.SaveChanges();
                    return true;
                }
                return false;
            }
        }
    }
}
