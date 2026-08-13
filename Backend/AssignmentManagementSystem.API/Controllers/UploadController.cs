using AssignmentManagementSystem.BusinessLogicLayer.Entities;
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

        [Authorize(Roles = "Teacher,Student")]
        [HttpPost]
        public async Task<IActionResult> UploadFile(IFormFile file, string type = "unknown")
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest(new { Success = false, Message = "No file uploaded." });

                if (file.Length > 200 * 1024 * 1024)
                    return BadRequest(new { Success = false, Message = "File size exceeds 200MB limit." });

                var allowedExtensions = new[] { ".pdf", ".docx", ".doc", ".zip", ".rar", ".png", ".jpg", ".jpeg" };
                var extension = Path.GetExtension(file.FileName).ToLower();
                if (!allowedExtensions.Contains(extension))
                    return BadRequest(new { Success = false, Message = $"File type {extension} is not allowed." });

                var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";

                string uploadPath;
                string folderPath;

                if (type == "submission")
                {
                    folderPath = Path.Combine("Submission", "StudentSubmission");
                    uploadPath = Path.Combine(_environment.WebRootPath ?? "wwwroot", folderPath);
                }
                else if (type == "assignment")
                {
                    folderPath = Path.Combine("Assignment", "TeacherAssignment");
                    uploadPath = Path.Combine(_environment.WebRootPath ?? "wwwroot", folderPath);
                }
                else
                {
                    folderPath = Path.Combine("Unknown");
                    uploadPath = Path.Combine(_environment.WebRootPath ?? "wwwroot", folderPath);
                }

                if (!Directory.Exists(uploadPath))
                    Directory.CreateDirectory(uploadPath);

                var filePath = Path.Combine(uploadPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var fileUrl = $"/{folderPath.Replace("\\", "/")}/{fileName}";

                return Ok(new
                {
                    Success = true,
                    Message = "File uploaded successfully.",
                    FileUrl = fileUrl,
                    FileName = file.FileName,
                    Type = type
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
    }
}
