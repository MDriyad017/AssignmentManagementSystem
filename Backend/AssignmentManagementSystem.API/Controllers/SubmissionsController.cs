using AssignmentManagementSystem.BusinessLogicLayer.DTOs.Submission;
using AssignmentManagementSystem.BusinessLogicLayer.Enums;
using AssignmentManagementSystem.BusinessLogicLayer.Interfaces.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AssignmentManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubmissionsController : ControllerBase
    {
        private readonly ISubmissionService _service;

        public SubmissionsController(ISubmissionService service)
        {
            _service = service;
        }

        [HttpGet]
        [Route("CG001")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var result = await _service.GetAllAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        [HttpGet]
        [Route("CGID001")]
        public async Task<IActionResult> GetById(Guid id)
        {
            try
            {
                var result = await _service.GetByIdAsync(id);
                if (result == null)
                    return NotFound(new { Success = false, Message = "Submission not found." });
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        [HttpGet]
        [Route("CGS001")]
        public async Task<IActionResult> GetByAssignmentAndStudent(Guid assignmentId, Guid studentId)
        {
            try
            {
                var result = await _service.GetByAssignmentAndStudentAsync(assignmentId, studentId);
                if (result == null)
                    return NotFound(new { Success = false, Message = "Submission not found." });
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        [HttpGet]
        [Route("CGA001")]
        public async Task<IActionResult> GetByAssignmentId(Guid assignmentId)
        {
            try
            {
                var result = await _service.GetByAssignmentIdAsync(assignmentId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        [HttpGet]
        [Route("CGSID001")]
        public async Task<IActionResult> GetByStudentId(Guid studentId)
        {
            try
            {
                var result = await _service.GetByStudentIdAsync(studentId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        [HttpGet]
        [Route("CGT001")]
        public async Task<IActionResult> GetByTeacherId(Guid teacherId)
        {
            try
            {
                var result = await _service.GetByTeacherIdAsync(teacherId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        [Authorize(Roles = nameof(UserRole.Student))]
        [HttpPost]
        [Route("CS001")]
        public async Task<IActionResult> Submit(SubmissionCreateDto dto)
        {
            try
            {
                var result = await _service.SubmitAsync(dto);
                return Ok(new
                {
                    Success = true,
                    Message = "Assignment submitted successfully.",
                    Data = result
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        [Authorize(Roles = nameof(UserRole.Teacher))]
        [HttpPost]
        [Route("CG001")]
        public async Task<IActionResult> Grade(SubmissionGradeDto dto)
        {
            try
            {
                var result = await _service.GradeAsync(dto);
                return Ok(new
                {
                    Success = true,
                    Message = "Submission graded successfully.",
                    Data = result
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        [Authorize(Roles = nameof(UserRole.Teacher) + "," + nameof(UserRole.Admin))]
        [HttpPost]
        [Route("CD001")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                await _service.DeleteAsync(id);
                return Ok(new { Success = true, Message = "Submission deleted successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
    }
}
