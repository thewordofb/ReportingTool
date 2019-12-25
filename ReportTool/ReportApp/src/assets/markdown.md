# Automated Testing Reports 
## Description
  - Aggregates various types of Testing Reports from your build processes
  - Generates Graphs and Statistics from testing reports
  - Provides a convenient API to publish reports and query reports
  - Organizes reports by Project/Team, per Repo and per Report Type

## Reporting Endpoints

  - **GET api/Projects** Get all Projects
  - **GET api/Project/(project)** Get Project details
  - **GET api/Project/(project)/Repos** Get All Repos for a project
  - **GET api/Project/(project)/Repos/(repo)** Get Repo details

## Publishing Reports 
### Reporting.Cake 
```C#
  #addin "nuget:https://www.nuget.org/api/v2?package=Cake.Http"

  Task("Http-POST-With-Settings-Fluent")
    .Description("Basic http 'POST' request with fluent settings and setting request body.")
    .Does(() =>
  {
    string responseBody = HttpPost("https://www.google.com", settings =>
    {
      settings.SetContentType("application/json")
      settings.SetRequestBody("{ "id": 123, "name": "Test Test" }");
    });
    Information(responseBody);
  });
```
### curl
```sh
  curl -d '{"key1":"value1", "key2":"value2"}' -H "Content-Type: application/json" -X POST http://localhost:3000/data
```
### Powershell
```powershell
  $Uri = 'https://api.contoso.com/v2/profile'
  $Form = @{
    firstName  = 'John'
    lastName   = 'Doe'
    email      = 'john.doe@contoso.com'
    avatar     = Get-Item -Path 'c:\\Pictures\\jdoe.png'
    birthday   = '1980-10-15'
    hobbies    = 'Hiking','Fishing','Jogging'
  }
  $Result = Invoke-WebRequest -Uri $Uri -Method Post -Form $Form
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
  var url = "https://www.duolingo.com/2016-04-13/login?fields=";
  var data = new { identifier = "username", password = "password" };
  var result = await httpClient.PostAsync(url, data.AsJson());
 ```

## Report Format
  - Report
  - ReportItem

## Report Types
  - JMeter csv files
  - Corbetura Code Coverage
  - Anything with a percent or time

## Build
The ReportTool Repo is at:  <br/>
The ReportTool is hosted at: and the database is at:  <br/>
