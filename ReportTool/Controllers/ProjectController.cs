using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReportTool.DataContext;

namespace ReportTool.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public ProjectsController(DatabaseContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetProjects()
        {
            var result = (from i in (from u in _context.Report group u by u.Project into g select g.First())
                          select i.Project).ToList();

            return Ok(result);

        }

        [HttpGet("{project}/Repos")]
        public IActionResult GetRepos(string project)
        {
            var result = (from i in (from u in _context.Report where u.Project == project group u by u.Repo into g select g.First())
                          select i.Repo).ToList();

            return Ok(result);
        }

        [HttpGet("{project}/Repos/{repo}/Types")]
        public IActionResult GetTypes(string project, string repo)
        {
            repo = repo.Substring(repo.IndexOf(" ") + 1);

            var result = (from i in 
                              (from u in _context.Report 
                               where u.Project == project && u.Repo == repo 
                               group u by u.Type into g 
                               select g.First())
                          select i.Type).ToList();

            return Ok(result);
        }
    }
}