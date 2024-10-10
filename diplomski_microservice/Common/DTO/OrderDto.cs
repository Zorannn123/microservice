using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.DTO
{
    public class OrderDto
    {
        public long OrderId { get; set; }
        public long UserId { get; set; }
        public List<OrderPartDto> OrderParts { get; set; }
        public string State { get; set; }
        public string Address { get; set; }
        public string Comment { get; set; }
        public DateTime DateTimeOfDelivery { get; set; }
        public long DeliveredBy { get; set; }
    }
}
