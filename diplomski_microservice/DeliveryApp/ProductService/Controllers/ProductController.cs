using Common.DTO;
using Common.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ProductService.Controllers
{
    [ApiController]
    [Route("products")]
    public class ProductController : ControllerBase
    {
        private readonly IProductService productService;
        public ProductController(IProductService productService)
        {
            this.productService = productService;
        }

        [HttpPost]
        [Route("addProduct")]
        //prilikom pokretanja ApiTest-a ostaviti zakomentarisano, radi lakseg testiranja(zbog slanja tokena)
        //[Authorize(Roles = "Admin")]
        public async Task<ActionResult> Post([FromBody] ProductDto product)
        {
            if (await productService.AddEntity(product))
                return Ok(true);

            return BadRequest(false);
        }

        [HttpGet]
        [Route("getAll")]
        public ActionResult GetAllProducts()
        {
            try
            {
                return Ok(productService.GetAll());
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpGet]
        [Route("getPrice/{id}")]
        public ActionResult GetPrice(long id)
        {
            try
            {
                return Ok(productService.GetProductPrice(id));
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpDelete]
        [Route("deleteProduct/{id}")]
        [Authorize(Roles = "Admin")]
        public ActionResult DeleteProduct(long id)
        {
            if (productService.RemoveEntity(id))
                return Ok(true);
            return BadRequest(false);
        }
    }
}
