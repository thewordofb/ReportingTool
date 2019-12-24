import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'angular-highcharts';
import { seriesType } from 'highcharts';
import { ActivatedRoute } from '@angular/router';
import { DataTableResource } from 'angular-bootstrap-data-table';

@Component({
  selector: 'app-graph-view',
  templateUrl: './graph-view.component.html',
  styleUrls: ['./graph-view.component.css']
})
export class GraphViewComponent implements OnInit, OnDestroy {
  id: string;
  repo: string;
  type: string;
  reports: Report[];
  public isVisible: boolean = false;
  private sub: any;

  constructor(private route: ActivatedRoute, private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
  }

  chart: Chart;

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id']; // (+) converts string 'id' to a number

      this.http.get<string[]>(this.baseUrl + 'api/Projects/'+this.id+'/Repos').subscribe(result => {
        this.repos = result;
      }, error => console.error(error));
      // In a real app: dispatch action to load the details here.
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onRepoChanged(repoValue: string) {
    this.repo = repoValue.substring(repoValue.indexOf(" ") + 1);
    console.log(this.repo);

    this.http.get<string[]>(this.baseUrl + 'api/Projects/' + this.id + '/Repos/' + this.repo + '/Types').subscribe(result => {
      this.types = result;
    }, error => console.error(error));
  }

  onTypeChanged(typeValue: string) {
    this.type = typeValue.substring(typeValue.indexOf(" ") + 1);
    console.log(this.type);
  }

  createGraph() {
    this.http.get<Report[]>(this.baseUrl + 'api/Reports?project=' + this.id + '&repo=' + this.repo + '&type=' + this.type).subscribe(result => {
      this.reports = result;
      this.initGraph();
      this.initTable();

    }, error => console.error(error));
  }

  initGraph() {
    var seriesData = new Array();
    this.reports.forEach(report => {
      report.reportItems.forEach(reportItem => {

        if (!(reportItem.label in seriesData)) {
          seriesData[reportItem.label] = new Array();
        }
        seriesData[reportItem.label].push(new Array<any>(Date.parse(report.date), +reportItem.average));
        console.log(reportItem.label + ': ' + report.date + ' ' + reportItem.average);
      });
    });

    let chart = new Chart({
      chart: {
        type: 'line'
      },
      title: {
        text: this.type
      },
      credits: {
        enabled: false
      },
      xAxis: {
        type: 'datetime'
      }
    });

    for (const key in seriesData) {
      chart.addSeries({
        type: 'line',
        name: key,
        data: seriesData[key]
      }, true, true)
    }

    this.chart = chart;
 
    chart.ref$.subscribe(console.log);
  }

  initTable() {
    var dataValues = new Array();
    this.reports.forEach(report => {
      report.reportItems.forEach(reportItem => {
        var itemValues = new Array();
        itemValues["Date"] = report.date;
        itemValues["Build"] = report.build;
        itemValues["Label"] = reportItem.label;
        itemValues["Average"] = reportItem.average;
        itemValues["Samples"] = reportItem.samples;
        itemValues["Min"] = reportItem.min;
        itemValues["Max"] = reportItem.max;
        itemValues["StdDev"] = reportItem.stdDev;
        itemValues["ErrorRate"] = reportItem.errorRate;
        dataValues.push(itemValues);
      });
    });

    this.itemResource = new DataTableResource(dataValues);
    this.itemResource.count().then(count => (this.itemCount = count));

    this.isVisible = true;
  }

  public repos: string[];
  public types: string[];

  itemResource = new DataTableResource([]);
  items = [];
  itemCount = 0;

  reloadItems(params) {
    this.itemResource.query(params).then(items => (this.items = items));
  }
}

export interface ReportItem {
  id: number;
  label: string;
  samples: string;
  average: string;
  min: string;
  max: string;
  stdDev: string;
  errorRate: string;
  throughput: string;
}
export interface Report {
  id: number;
  project: string;
  repo: string;
  type: string;
  date: string;
  build: string;
  reportItems: ReportItem[];
} 
