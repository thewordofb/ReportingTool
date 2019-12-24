using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ReportTool.Models
{
    public class Report
    {
        [Key]
        public int Id { get; set; }
        public string Project { get; set; }
        public string Repo { get; set; }
        public string Type { get; set; }
        public DateTime Date { get; set; }      
        public string Build { get; set; }
        public IEnumerable<ReportItem> ReportItems { get; set; }
    }
}
