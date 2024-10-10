using AutoMapper;
using Common.DTO;
using Common.Enums;
using Common.Interfaces;
using Common.Models;
using Microsoft.IdentityModel.Tokens;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using UsersService.Database;

namespace UsersService.Service
{
    public class UserService : IUserService
    {
        private readonly IMapper _mapper;
        private readonly UserDbContext _dbContext;
        private readonly IConfigurationSection _secretKey;
        private readonly IConfigurationSection _tokenAddress;
        private const string _pepper = "aasf3rko3W";

        string Encode(string raw)
        {
            using (var sha = SHA256.Create())
            {
                var computedHash = sha.ComputeHash(
                Encoding.Unicode.GetBytes(raw + _pepper));
                return Convert.ToBase64String(computedHash);
            }
        }
        public UserService(IMapper mapper, UserDbContext dbContext, IConfiguration config)
        {
            _mapper = mapper;
            _dbContext = dbContext;
            _secretKey = config.GetSection("SecretKey");
            _tokenAddress = config.GetSection("tokenAddress");

        }
        public bool AddUser(UserDto userDto)
        {
            try
            {
                var users = _dbContext.Users.Any(s => s.Email == userDto.Email || s.Username == userDto.Username);
                if (users)
                    return false;
                userDto.Password = Encode(userDto.Password);
                if (userDto.Type.ToLower() == "dostavljac")
                {
                    userDto.Activated = false;
                    userDto.Status = SupplierState.NEVERIFIKOVAN;
                }
                else
                    userDto.Activated = true;
                User user = _mapper.Map<User>(userDto);
                user.PhotoUrl = "";
                _dbContext.Users.Add(user);
                _dbContext.SaveChanges();
            }
            catch (Exception e)
            {

                return false;
            }

            return true;
        }

        public List<UserDto> GetUsers()
        {
            List<UserDto> users = _mapper.Map<List<UserDto>>(_dbContext.Users.ToList());
            foreach (var item in users)
            {
                item.Password = "";
            }
            return users;
        }

        public UserDto FindById(long id)
        {
            return _mapper.Map<UserDto>(_dbContext.Users.Find(id));
        }

        public bool ModifyUser(UserDto userdto)
        {
            User user = _dbContext.Users.Find(userdto.Id);
            if (user == null)
                return false;
            user.Firstname = userdto.Firstname;
            user.Address = userdto.Address;
            user.BirthDate = userdto.BirthDate;
            user.Email = userdto.Email;
            user.Firstname = userdto.Firstname;
            user.Lastname = userdto.Lastname;
            user.Password = userdto.Password;
            user.Username = userdto.Username;

            _dbContext.SaveChanges();

            return true;
        }

        public TokenDto Login(LoginDto loginDto)
        {
            var users = _dbContext.Users.Where(s => s.Username == loginDto.Username).Where(x => x.Password == Encode(loginDto.Password)).ToList();
            if (users.Count == 0)
                return null;
            List<Claim> claims = new List<Claim>();
            if (users[0].Activated)
                claims.Add(new Claim("username", users[0].Username));
            claims.Add(new Claim("id", users[0].Id.ToString()));
            claims.Add(new Claim("role", users[0].Type));
            claims.Add(new Claim("isActivated", users[0].Activated.ToString()));
            claims.Add(new Claim("Status", users[0].Status.ToString()));
            SymmetricSecurityKey secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey.Value));
            var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            var tokeOptions = new JwtSecurityToken(//kreiranje JWT
                   issuer: _tokenAddress.Value, //url servera koji je izdao token
                   claims: claims, //claimovi
                   expires: DateTime.Now.AddMinutes(20), //vazenje tokena u minutama
                   signingCredentials: signinCredentials //kredencijali za potpis
               );
            string tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);
            return new TokenDto() { Token = tokenString };
        }

        public List<UserDto> Unactivated()
        {
            return _mapper.Map<List<UserDto>>(_dbContext.Users.Where(x => x.Status == SupplierState.NEVERIFIKOVAN).ToList());
        }

        public async Task<bool> VerifyUserAsync(long id)
        {
            User user = _dbContext.Users.Find(id);
            if (user == null)
                return false;
            user.Activated = true;
            user.Status = SupplierState.VERIFIKOVAN;
            try
            {
                _dbContext.SaveChanges();

                IEmail emailProxy = ServiceProxy.Create<IEmail>(new Uri("fabric:/DeliveryApp/EmailService"));
                await emailProxy.SendMailAsync(user.Email, true);

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> DismissUserAsync(long id)
        {
            User user = _dbContext.Users.Find(id);
            if (user == null)
                return false;

            user.Activated = false;
            user.Status = SupplierState.ODBIJEN;

            try
            {
                _dbContext.SaveChanges();

                IEmail emailProxy = ServiceProxy.Create<IEmail>(new Uri("fabric:/DeliveryApp/EmailService"));
                await emailProxy.SendMailAsync(user.Email, false);

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}