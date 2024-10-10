using AutoMapper;
using Common.DTO;
using Common.Models;
using Microsoft.EntityFrameworkCore;

namespace ProductService.MappingProfile
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Product, ProductDto>().ReverseMap();
        }
    }
}
