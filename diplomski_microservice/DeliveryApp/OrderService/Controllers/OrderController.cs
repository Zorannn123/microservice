using Common.DTO;
using Common.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace OrderService.Controllers
{
    [ApiController]
    [Route("order")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService orderService;
        public OrderController(IOrderService orderService)
        {
            this.orderService = orderService;
        }

        [HttpPost]
        [Route("AddOrder")]
        [Authorize]
        public ActionResult AddOrder([FromBody] OrderDto order)
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
            order.UserId = long.Parse(userId);

            orderService.AddEntity(order);
            return Ok(true);
        }

        [HttpGet]
        [Route("Undelivered")]
        [Authorize(Roles = "Dostavljac")]
        public ActionResult Undelivered()
        {
            var result = orderService.GetUndelivered();
            if (result == null)
            {
                return BadRequest();
            }
            return Ok(result);
        }

        [HttpPost]
        [Route("TakeOrder")]
        [Authorize(Roles = "Dostavljac")]
        public ActionResult TakeOrder(long orderId)
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
            if (orderService.TakeOrder(orderId, long.Parse(userId)))
                return Ok(true);

            return BadRequest(false);
        }

        [HttpGet]
        [Route("currentOrder")]
        [Authorize]
        public ActionResult GetCurrentOrder()
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == "id")?.Value;

            if (userId != null)
                return Ok(orderService.GetCurrentOrder(long.Parse(userId)));

            return BadRequest();
        }

        [HttpGet]
        [Route("historyDeliverer")]
        [Authorize(Roles = "Dostavljac")]
        public ActionResult HistoryDeliverer()
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
            if (userId != null)
                return Ok(orderService.HistoryDeliverer(long.Parse(userId)));

            return BadRequest();

        }

        [HttpGet]
        [Route("history")]
        [Authorize(Roles = "Korisnik")]
        public ActionResult History()
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == "id")?.Value;

            if (userId != null)
                return Ok(orderService.History(long.Parse(userId)));

            return BadRequest();

        }
    }
}
