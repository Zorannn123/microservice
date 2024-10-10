using Common.DTO;
using Common.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace UsersService.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        public AuthController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("login")]
        public ActionResult Login([FromBody] LoginDto loginDto)
        {
            return Ok(_userService.Login(loginDto));
        }

        [HttpPost("register")]

        public ActionResult Register([FromBody] UserDto userDto)
        {
            if (_userService.AddUser(userDto))
                return Ok(true);
            return Ok(false);
        }
    }
}
