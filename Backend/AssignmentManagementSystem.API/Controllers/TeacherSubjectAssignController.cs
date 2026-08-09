using AssignmentManagementSystem.BusinessLogicLayer.DTOs.TeacherSubjectsAssign;
using AssignmentManagementSystem.BusinessLogicLayer.Enums;
using AssignmentManagementSystem.BusinessLogicLayer.Interfaces.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AssignmentManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeacherSubjectAssignController : ControllerBase
    {
        private readonly ITeacherSubjectAssignService _service;

        public TeacherSubjectAssignController(ITeacherSubjectAssignService service)
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
        [Route("CGG001")]
        public async Task<IActionResult> GetAllGrouped()
        {
            try
            {
                var result = await _service.GetAllGroupedAsync();
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
                    return NotFound(new { Success = false, Message = "Assignment not found." });
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

        [HttpGet]
        [Route("CGS001")]
        public async Task<IActionResult> GetBySubjectId(Guid subjectId)
        {
            try
            {
                var result = await _service.GetBySubjectIdAsync(subjectId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        [HttpGet]
        [Route("CGC001")]
        public async Task<IActionResult> GetByClassId(Guid classId)
        {
            try
            {
                var result = await _service.GetByClassIdAsync(classId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        [Authorize(Roles = nameof(UserRole.Admin))]
        [HttpPost]
        [Route("CB001")]
        public async Task<IActionResult> BulkAssign(TeacherSubjectAssignBulkCreateDTO dto)
        {
            try
            {
                var result = await _service.BulkAssignAsync(dto);
                return Ok(new
                {
                    Success = true,
                    Message = $"{result.TotalAssigned} subjects assigned successfully.",
                    Data = result
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        [Authorize(Roles = nameof(UserRole.Admin))]
        [HttpPost]
        [Route("CU001")]
        public async Task<IActionResult> Update(TeacherSubjectAssignUpdateDto dto)
        {
            try
            {
                var result = await _service.UpdateAsync(dto);
                return Ok(new
                {
                    Success = true,
                    Message = "Assignment updated successfully.",
                    Data = result
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        [Authorize(Roles = nameof(UserRole.Admin))]
        [HttpPost]
        [Route("CD001")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                await _service.DeleteAsync(id);
                return Ok(new { Success = true, Message = "Assignment deleted successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        [Authorize(Roles = nameof(UserRole.Admin))]
        [HttpPost]
        [Route("CDT001")]
        public async Task<IActionResult> DeleteByTeacherId(Guid teacherId)
        {
            try
            {
                await _service.DeleteByTeacherIdAsync(teacherId);
                return Ok(new { Success = true, Message = "All assignments for this teacher deleted successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
    }
}
