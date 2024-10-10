using Common.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Models
{
    public class Order
    {
        public long OrderId { get; set; }
        public long UserId { get; set; }
        public List<OrderPart> OrderParts { get; set; }
        public OrderStatus State { get; set; }
        public string Address { get; set; }
        public string Comment { get; set; }
        public DateTime DateTimeOfDelivery { get; set; }
        public long DeliveredBy { get; set; }
    }
}
