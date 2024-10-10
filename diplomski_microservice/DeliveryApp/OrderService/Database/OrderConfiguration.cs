using Common.Models;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace OrderService.Database
{
    public class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            builder.HasKey(x => x.OrderId);
            builder.Property(x => x.OrderId).ValueGeneratedOnAdd();

            builder.Property(x => x.UserId).IsRequired();

            /*builder.HasMany(x => x.OrderParts)
                   .WithOne(x => x.Order);*/
        }
    }
}
