using SmartInventoryManagementSystem.Domain.Entities;
using SmartInventoryManagementSystem.Application.DTOs.Company;

namespace SmartInventoryManagementSystem.Application.Interfaces
{
    public interface ICompanyService
    {
        Task<List<Company>> GetAllCompanies();

        Task<Company> CreateCompany(CreateCompanyDto dto);
    }
}
