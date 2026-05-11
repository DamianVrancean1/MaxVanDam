using MaxVanDam.Domain.Models.Service;

namespace MaxVanDam.BusinessLayer.Interfaces;

public interface IEmailService
{
    Task<ServiceResponse> SendWelcomeEmailAsync(string toEmail, string firstName, string lastName);
    Task<ServiceResponse> SendSubscriptionConfirmationAsync(string toEmail, string firstName, string planId, decimal amount);
    Task<ServiceResponse> SendAdminNotificationAsync(string subject, string message);
}
