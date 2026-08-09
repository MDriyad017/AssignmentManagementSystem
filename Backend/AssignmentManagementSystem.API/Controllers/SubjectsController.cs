using AssignmentManagementSystem.BusinessLogicLayer.DTOs.Subject;
using AssignmentManagementSystem.BusinessLogicLayer.Enums;
using AssignmentManagementSystem.BusinessLogicLayer.Interfaces.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AssignmentManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubjectsController : ControllerBase
    {
        private readonly ISubjectService _subjectService;

        public SubjectsController(ISubjectService subjectService)
        {
            _subjectService = subjectService;
        }

        [HttpGet]
        [Route("CGID001")]
        public async Task<IActionResult> GetById(Guid id)
        {
            try
            {
                var result = await _subjectService.GetSubjectByIdAsync(id);
                if (result == null)
                    return NotFound(new { Success = false, Message = "Subject not found." });
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        [HttpGet]
        [Route("CG001")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var result = await _subjectService.GetAllSubjectsAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        [HttpGet]
        [Route("CGBC001")]
        public async Task<IActionResult> GetByClassId(Guid classId)
        {
            try
            {
                var result = await _subjectService.GetSubjectsByClassIdAsync(classId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        [Authorize(Roles = nameof(UserRole.Admin))]
        [HttpPost]
        [Route("CC001")]
        public async Task<IActionResult> Create(SubjectCreateDto dto)
        {
            try
            {
                await _subjectService.CreateSubjectAsync(dto);
                return Ok(new { Success = true, Message = "Subject created successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        [Authorize(Roles = nameof(UserRole.Admin))]
        [HttpPost]
        [Route("CU001")]
        public async Task<IActionResult> Update(Guid id, SubjectCreateDto dto)
        {
            try
            {
                await _subjectService.UpdateSubjectAsync(id, dto);
                return Ok(new { Success = true, Message = "Subject updated successfully." });
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
                await _subjectService.DeleteSubjectAsync(id);
                return Ok(new { Success = true, Message = "Subject deleted successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
    }
}
