using AutoMapper;
using Common.DTO;
using Common.Models;

namespace OrderService.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Order, OrderDto>().ReverseMap();
            CreateMap<OrderPart, OrderPartDto>().ReverseMap();
        }
    }
}
