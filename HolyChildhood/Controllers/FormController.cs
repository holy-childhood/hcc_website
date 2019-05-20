using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HolyChildhood.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace HolyChildhood.Controllers
{
    [Produces("appication/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class FormController : ControllerBase
    {
        private readonly AppDbContext dbContext;

        public FormController(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        // GET api/values/5
        [HttpGet("{id}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<Form>> GetForm(int id)
        {
            var form = await dbContext.Forms.Include(f => f.FormRows)
                                            .ThenInclude(fr => fr.FormElements)
                                            .ThenInclude(fe => fe.FormElementValues)
                                            .FirstOrDefaultAsync(f => f.Id == id);

            if (form == null) return NotFound();
            return form;
        }

        // POST api/values
        [HttpPost]
        [Authorize]
        [ProducesResponseType(201)]
        public async Task<ActionResult<Form>> PostForm(Form form)
        {
            dbContext.Forms.Add(form);
            await dbContext.SaveChangesAsync();

            return CreatedAtAction("GetForm", new { id = form.Id }, form);
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        [Authorize]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> PutForm(int id, Form form)
        {
            if (id != form.Id) return BadRequest();

            dbContext.Entry(form).State = EntityState.Modified;

            try
            {
                await dbContext.SaveChangesAsync();
            } catch (DbUpdateException)
            {
                if (!dbContext.Forms.Any(f => f.Id == id))
                {
                    return NotFound();
                }
                throw;
            }
            return NoContent();
        }

        [HttpPost("{id}/row")]
        public void AddFormRow(int id, FormRow row)
        {

        }

        [HttpPut("{id}/row/{rowId}")]
        public void UpdateFormRow(int id, int rowId, FormRow row)
        {

        }

        [HttpDelete("{id}/row/{rowId}")]
        public void DeleteFormRow(int id, int rowId)
        {

        }

        [HttpPost("{id}/row/{rowId}/element")]
        public void AddFormElement(int id, int rowId, FormElement element)
        {

        }

        [HttpPut("{id}/row/{rowId}/element/{elementId}")]
        public void UpdateFormElement(int id, int rowId, int elementId, FormElement element)
        {

        }

        [HttpDelete("{id}/row/{rowId}/element/{elementId}")]
        public void DeleteFormElement(int id, int rowId, int elementId)
        {

        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        [Authorize]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<Form>> DeleteForm(int id)
        {
            var form = await dbContext.Forms.FindAsync(id);
            if (form == null) return NotFound();

            dbContext.Forms.Remove(form);
            await dbContext.SaveChangesAsync();

            return form;
        }
    }
}
