using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReportTool.DataContext;
using ReportTool.Models;

namespace ReportTool.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public ReportsController(DatabaseContext context)
        {
            _context = context;
        }

        // GET: api/Reports?project={}&repo={}&type={}
        [HttpGet]
        public IEnumerable<Report> GetReport([FromQuery]string project, [FromQuery]string repo, [FromQuery]string type)
        {
            var reports = from i in _context.Report.Include(i => i.ReportItems)
                          where i.Project == project && i.Repo == repo && i.Type == type
                          select i;
            return reports.ToList();
        }

        // GET: api/Reports/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetReport([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var report = await _context.Report.Include(i => i.ReportItems).FirstOrDefaultAsync(a => a.Id == id);
            //var report = await _context.Report.FindAsync(id);

            if (report == null)
            {
                return NotFound();
            }

            return Ok(report);
        }

        // PUT: api/Reports/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReport([FromRoute] int id, [FromBody] Report report)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != report.Id)
            {
                return BadRequest();
            }

            _context.Entry(report).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReportExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Reports
        [HttpPost]
        public async Task<IActionResult> PostReport([FromBody] Report report)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Report.Add(report);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetReport", new { id = report.Id }, report);
        }

        // DELETE: api/Reports/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReport([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var report = await _context.Report.FindAsync(id);
            if (report == null)
            {
                return NotFound();
            }

            _context.Report.Remove(report);
            await _context.SaveChangesAsync();

            return Ok(report);
        }

        private bool ReportExists(int id)
        {
            return _context.Report.Any(e => e.Id == id);
        }
    }
}