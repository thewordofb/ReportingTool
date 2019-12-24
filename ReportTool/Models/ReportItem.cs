using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ReportTool.Models
{
    public class ReportItem
    {
        [Key]
        public int Id { get; set; }
        public string Label { get; set; }
        public string Samples { get; set; }
        public string Average { get; set; }
        public string Min { get; set; }
        public string Max { get; set; }
        public string StdDev { get; set; }
        public string ErrorRate { get; set; }
        public string Throughput { get; set; }
    }
}
