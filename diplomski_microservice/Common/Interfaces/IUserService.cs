using Common.DTO;
using Microsoft.ServiceFabric.Services.Remoting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Interfaces
{
    public interface IUserService : IService
    {
        List<UserDto> GetUsers();
        UserDto FindById(long id);
        bool AddUser(UserDto userDto);
        bool ModifyUser(UserDto user);
        TokenDto Login(LoginDto loginDto);
        List<UserDto> Unactivated();
        Task<bool> VerifyUserAsync(long id);
        Task<bool> DismissUserAsync(long id);
    }
}
