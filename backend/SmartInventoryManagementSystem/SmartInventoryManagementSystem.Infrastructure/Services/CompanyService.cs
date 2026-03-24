using Microsoft.EntityFrameworkCore;
using SmartInventoryManagementSystem.Application.DTOs.Company;
using SmartInventoryManagementSystem.Application.Interfaces;
using SmartInventoryManagementSystem.Domain.Entities;
using SmartInventoryManagementSystem.Infrastructure.Data;

namespace SmartInventoryManagementSystem.Infrastructure.Services
{
    public class CompanyService : ICompanyService
    {
        private readonly AppDbContext _context;

        public CompanyService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Company>> GetAllCompanies()
        {
            return await _context.Companies.ToListAsync();
        }

        public async Task<Company> CreateCompany(CreateCompanyDto dto)
        {
            var company = new Company
            {
                Name = dto.Name
            };

            _context.Companies.Add(company);

            await _context.SaveChangesAsync();

            return company;
        }
    }
}
