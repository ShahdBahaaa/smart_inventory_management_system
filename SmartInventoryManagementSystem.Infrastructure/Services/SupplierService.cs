using Microsoft.EntityFrameworkCore;
using SmartInventoryManagementSystem.Application.DTOs.Supplier;
using SmartInventoryManagementSystem.Application.Interfaces;
using SmartInventoryManagementSystem.Domain.Entities;
using SmartInventoryManagementSystem.Infrastructure.Data;

namespace SmartInventoryManagementSystem.Infrastructure.Services
{
    public class SupplierService : ISupplierService
    {
        private readonly AppDbContext _context;

        public SupplierService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Supplier>> GetAllSuppliers()
        {
            return await _context.Suppliers
                .Where(s => s.IsActive)
                .ToListAsync();
        }

        public async Task<Supplier?> GetSupplierById(int id)
        {
            return await _context.Suppliers
                .FirstOrDefaultAsync(s => s.SupplierID == id);
        }

        public async Task<Supplier> CreateSupplier(CreateSupplierDto dto)
        {
            var supplier = new Supplier
            {
                Name = dto.Name,
                ContactPerson = dto.ContactPerson,
                Email = dto.Email,
                Phone = dto.Phone,
                Address = dto.Address,
                LeadTime = dto.LeadTime
            };

            _context.Suppliers.Add(supplier);
            await _context.SaveChangesAsync();
            return supplier;
        }

        public async Task<Supplier> UpdateSupplier(int id, UpdateSupplierDto dto)
        {
            var supplier = await GetSupplierById(id);

            if (supplier == null)
                throw new Exception("Supplier not found");

            supplier.Name = dto.Name ?? supplier.Name;
            supplier.ContactPerson = dto.ContactPerson ?? supplier.ContactPerson;
            supplier.Email = dto.Email ?? supplier.Email;
            supplier.Phone = dto.Phone ?? supplier.Phone;
            supplier.Address = dto.Address ?? supplier.Address;
            supplier.LeadTime = dto.LeadTime ?? supplier.LeadTime;
            supplier.IsActive = dto.IsActive ?? supplier.IsActive;

            await _context.SaveChangesAsync();
            return supplier;
        }

        public async Task DeleteSupplier(int id)
        {
            var supplier = await GetSupplierById(id);

            if (supplier == null)
                throw new Exception("Supplier not found");

            supplier.IsActive = false;
            await _context.SaveChangesAsync();
        }

        public async Task<object> GetSupplierScore(int id)
        {
            var supplier = await GetSupplierById(id);

            if (supplier == null)
                throw new Exception("Supplier not found");

            var overallScore = (supplier.OnTimeDeliveryRate * 0.4m) +
                               (supplier.QualityScore * 0.4m) +
                               (supplier.FulfillmentRate * 0.2m);

            return new
            {
                SupplierID = supplier.SupplierID,
                Name = supplier.Name,
                OnTimeDeliveryRate = supplier.OnTimeDeliveryRate,
                QualityScore = supplier.QualityScore,
                FulfillmentRate = supplier.FulfillmentRate,
                OverallScore = Math.Round(overallScore, 2),
                Classification = supplier.Classification.ToString()
            };
        }
    }
}