using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AssignmentManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;
        public UploadController(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        [Authorize(Roles = "Teacher")]
        [HttpPost]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest(new { Success = false, Message = "No file uploaded." });

                // ✅ 200MB limit
                if (file.Length > 200 * 1024 * 1024)
                    return BadRequest(new { Success = false, Message = "File size exceeds 200MB limit." });

                // ✅ Allowed extensions
                var allowedExtensions = new[] { ".pdf", ".docx", ".doc", ".zip", ".rar", ".png", ".jpg", ".jpeg" };
                var extension = Path.GetExtension(file.FileName).ToLower();
                if (!allowedExtensions.Contains(extension))
                    return BadRequest(new { Success = false, Message = $"File type {extension} is not allowed." });

                // ✅ Generate unique filename
                var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
                var uploadPath = Path.Combine(_environment.WebRootPath ?? "wwwroot", "uploads");

                if (!Directory.Exists(uploadPath))
                    Directory.CreateDirectory(uploadPath);

                var filePath = Path.Combine(uploadPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var fileUrl = $"/uploads/{fileName}";

                return Ok(new
                {
                    Success = true,
                    Message = "File uploaded successfully.",
                    FileUrl = fileUrl,
                    FileName = file.FileName
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
    }
}
