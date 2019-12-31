# Automated Testing Reporting Tool  

## Description

- Aggregates various types of Testing Reports from your build processes
- Generates Graphs and Statistics from testing reports
- Provides a convenient API to publish reports and query reports
- Organizes reports by Project/Team, per Repo and per Report Type

![Screenshot](Docs/Screenshot.png?raw=true)

## Reporting Endpoints

- **GET api/Projects** Get all Projects
- **GET api/Project/(project)** Get Project details
- **GET api/Project/(project)/Repos** Get All Repos for a project
- **GET api/Project/(project)/Repos/(repo)** Get Repo details
- **POST api/Reports** Post a new Report

## Publishing Reports  

Below are some examples to how to submit reports in an automated way.  Possible a Cake step in Jenkins, or via command line with powershell or bash, or in a custom C# Application.

### Reporting.Cake  

```C#
  #addin "nuget:https://www.nuget.org/api/v2?package=Cake.Http"

  Task("Http-POST-ReportItems")
    .Description("Post Performance Report Items")
    .Does(() =>
  {
    string responseBody = HttpPost("http://localhost:6000/api/Reports", settings =>
    {
      settings.SetContentType("application/json")
      settings.SetRequestBody("{{"+
        "\"Project\":\"Test\","+
        "\"Repo\":\"TestApi\","+
        "\"Type\":\"Performance\","+
        "\"Date\":\"1/1/2020\","+
        "\"Build\":\"1.0.0\","+
        "\"ReportItems\":["+
          "{{"+
            "\"Label\":\"Spike\","+
            "\"Samples\":\"1\","+
            "\"Average\":\"37\","+
            "\"Min\":\"37\","+
            "\"Max\":\"37\","+
            "\"StdDev\":\"0\","+
            "\"ErrorRate\":\"0\","+
            "\"Throughput\":\"1\""+
          "}},"+
          "{{"+
            "\"Label\":\"Load\","+
            "\"Samples\":\"1\","+
            "\"Average\":\"40\","+
            "\"Min\":\"40\","+
            "\"Max\":\"40\","+
            "\"StdDev\":\"0\","+
            "\"ErrorRate\":\"0\","+
            "\"Throughput\":\"1\""+
          "}}"+
        "]"+
      "}}");  
    });
    Information(responseBody);
  });
```

### curl

```sh
  curl -H "Content-Type: application/json" -X POST http://localhost:6000/api/Reports  
    -d '{
        "Project":"Test",
        "Repo":"TestApi",
        "Type":"Performance",
        "Date":"1/1/2020",
        "Build":"1.0.0",
        "ReportItems":[
          {
            "Label":"Spike",
            "Samples":"1",
            "Average":"37",
            "Min":"37",
            "Max":"37",
            "StdDev":"0",
            "ErrorRate":"0",
            "Throughput":"1"
          },
          {
            "Label":"Load",
            "Samples":"1",
            "Average":"40",
            "Min":"40",
            "Max":"40",
            "StdDev":"0",
            "ErrorRate":"0",
            "Throughput":"1"
          }
        ]
      }");
    }'
```

### Powershell

```powershell
  $Uri = 'http://localhost:6000/api/Reports'
  $Body = @{
    Project = 'Test'
    Repo = 'TestApi'
    Type = 'Performance'
    Date = '1/1/2020'
    Build = '1.0.0'
    ReportItems = {  
      Label = 'Spike'
      Samples = '1'
      Average = '37'
      Min = '37'
      Max = '37'
      StdDev = '0'
      ErrorRate = '0'
      Throughput = '1'
    },
    {  
      Label = 'Load'
      Samples = '1'
      Average = '40'
      Min = '40'
      Max = '40'
      StdDev = '0'
      ErrorRate = '0'
      Throughput = '1'
    }
  }
  $Result = Invoke-WebRequest -Uri $Uri -Method Post -Body $Body -ContentType 'application/json'
```

### C# HttpClient

```C#
  using Newtonsoft.Json;
  using System.Net.Http;
  using System.Text;

  public static class Extensions
  {
    public static StringContent AsJson(this object o)
      => new StringContent(JsonConvert.SerializeObject(o), Encoding.UTF8, "application/json");
  }

  var httpClient = new HttpClient();
  var url = "http://localhost:6000/api/Reports";
  var data = new  
  {  
    Project = "Test",
    Repo = "TestApi",
    Type = "Performance",
    Date = "1/1/2020",
    Build = "1.0.0",
    ReportItems = new[]
    {
       new
       {
         Label = "Spike",
         Samples = "1",
         Average = "37",
         Min = "37",
         Max = "37",
         StdDev = "0",
         ErrorRate = "0",
         Throughput = "1"
       },
       new
       {
         Label = "Load",
         Samples = "1",
         Average = "40",
         Min = "40",
         Max = "40",
         StdDev = "0",
         ErrorRate = "0",
         Throughput = "1"
       }
    }
  };
  var result = await httpClient.PostAsync(url, data.AsJson());
 ```

### JMeter Reporting Sample

  You can find a [JMeter Reporting Sample](JMeter/README.md) in the JMeter directory.  This sample will allow you to run the JMeter JMX files via command-line, capture the output csv data, and publish it.

## Report Format

  Each Report is categorized by Project, then Repo, then Type.  These are defined by whoever submits the report.
  They each Report is ordered by the Date it was submitted and a Build metadata can be included.  Each Report can
  contain multiple ReportItems.  These are grouped by Label, each label is graphed as its own line in the chart.  

  ```JSON
    {
      "Project":"",
      "Repo":"",
      "Type":"",
      "Date":"",
      "Build":"",
      "ReportItems":[
        {
          "Label":"",
          "Samples":"",
          "Average":"",
          "Min":"",
          "Max":"",
          "StdDev":"",
          "ErrorRate":"",
          "Throughput":""
        }
      ]
    }
  ```

## Report Types

  These could be anything, some examples could be reporting output from:

- JMeter csv files
- Corbetura Code Coverage
- Anything with a percent or time

## Build

The ReportTool Repo is at:  
The ReportTool is hosted at: and the database is at:  
