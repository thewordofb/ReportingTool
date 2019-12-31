# JMeter Reporting Sample

This is a sample to automate running JMeter JMX tests, parse and then publish the results so it can be viewable from the Reporting Tool

## Run JMeter via CommandLine

```PowerShell
PS C:\>
```

## Processing Reports

First we need to run a powershell script to register/install a few functions to do the parsing and publishing of JMeter CSV output files

```Powershell
PS C:\> ReportPublisher.ps1
```

The script will add two Powershell functions, ```Process-JMeterCSV``` and ```Publish-JMeter```.  The script can be found here: [ReportPublisher.ps1](https://github.com/thewordofb/ReportingTool/blob/master/JMeter/ReportPublisher.ps1)

### Parse Reports

Next we need to parse the output.csv file so we can extract the line items from the reports

Sample CSV Data

```CSV
Label,Samples,Average,Min,Max,StdDev,ErrorRate,Throughput
Spike,1,20,20,20,0,0,1
Load,1,30,30,30,0,0,1
```

Run the script

```Powershell
PS C:\>$csvtable = Process-JMeterCSV -Path D:\output.csv
```

### Publish Reports

Now that we have the CSV data stored in the ```$csvtable``` variable, we can POST it to the Reports api endpoint

```Powershell
PS C:\>Publish-JMeter -Data $csvtable -Uri http://localhost:64666/api/Reports -Project Test -Repo TestRepo -Type Perf -Date '1/1/2020' -Build '1.0.0'
```
