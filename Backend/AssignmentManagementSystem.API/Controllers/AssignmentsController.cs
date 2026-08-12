using AssignmentManagementSystem.BusinessLogicLayer.DTOs.Assignment;
using AssignmentManagementSystem.BusinessLogicLayer.Interfaces.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AssignmentManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AssignmentsController : ControllerBase
    {
        private readonly IAssignmentService _service;

        public AssignmentsController(IAssignmentService service)
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

        [Authorize(Roles = "Teacher")]
        [HttpPost]
        [Route("CA001")]
        public async Task<IActionResult> Create(AssignmentCreateDto dto)
        {
            try
            {
                var result = await _service.CreateAsync(dto);
                return Ok(new
                {
                    Success = true,
                    Message = "Assignment created successfully.",
                    Data = result
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        [Authorize(Roles = "Teacher")]
        [HttpPost]
        [Route("CU001")]
        public async Task<IActionResult> Update(AssignmentUpdateDto dto)
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

        [Authorize(Roles = "Teacher")]
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
    }
}
