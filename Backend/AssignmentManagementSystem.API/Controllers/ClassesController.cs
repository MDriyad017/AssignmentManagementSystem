using AssignmentManagementSystem.BusinessLogicLayer.DTOs.Class;
using AssignmentManagementSystem.BusinessLogicLayer.Interfaces.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AssignmentManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClassesController : ControllerBase
    {
        private readonly IClassService _classService;

        public ClassesController(IClassService classService)
        {
            _classService = classService;
        }

        
        [HttpGet]
        [Route("CGID001")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var result = await _classService.GetClassByIdAsync(id);

                if (result == null)
                    return NotFound(new
                    {
                        Success = false,
                        Message = "Class not found."
                    });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    Success = false,
                    Message = ex.Message
                });
            }
        }

        [HttpGet]
        [Route("CG001")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var result = await _classService.GetAllClassesAsync();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    Success = false,
                    Message = ex.Message
                });
            }
        }

        [HttpPost]
        [Route("CC001")]
        public async Task<IActionResult> Create(ClassCreateDto dto)
        {
            try
            {
                await _classService.CreateClassAsync(dto);

                return Ok(new
                {
                    Success = true,
                    Message = "Class created successfully."
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    Success = false,
                    Message = ex.Message
                });
            }
        }

        [HttpPost]
        [Route("CU001")]
        public async Task<IActionResult> Update(int id, ClassUpdateDto dto)
        {
            try
            {
                await _classService.UpdateClassAsync(id, dto);

                return Ok(new
                {
                    Success = true,
                    Message = "Class updated successfully."
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    Success = false,
                    Message = ex.Message
                });
            }
        }

        [HttpPost]
        [Route("CD001")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _classService.DeleteClassAsync(id);

                return Ok(new
                {
                    Success = true,
                    Message = "Class deleted successfully."
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    Success = false,
                    Message = ex.Message
                });
            }
        }

    }
}
