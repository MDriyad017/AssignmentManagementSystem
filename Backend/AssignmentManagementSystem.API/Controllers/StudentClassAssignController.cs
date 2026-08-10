using AssignmentManagementSystem.BusinessLogicLayer.DTOs.StudentClassAssign;
using AssignmentManagementSystem.BusinessLogicLayer.Enums;
using AssignmentManagementSystem.BusinessLogicLayer.Interfaces.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AssignmentManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentClassAssignController : ControllerBase
    {
        private readonly IStudentClassAssignService _service;

        public StudentClassAssignController(IStudentClassAssignService service)
        {
            _service = service;
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
        [Route("CGD001")]
        public async Task<IActionResult> GetStudentClassDetail(Guid studentId)
        {
            try
            {
                var result = await _service.GetStudentClassDetailAsync(studentId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        [Authorize(Roles = nameof(UserRole.Admin))]
        [HttpPost]
        [Route("CA001")]
        public async Task<IActionResult> Assign(StudentClassAssignCreateDto dto)
        {
            try
            {
                var result = await _service.AssignAsync(dto);
                return Ok(new
                {
                    Success = true,
                    Message = "Class assigned successfully.",
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
        public async Task<IActionResult> Update(StudentClassAssignUpdateDto dto)
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

    }
}
