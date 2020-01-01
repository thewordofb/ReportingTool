# JMeter Reporting Sample

This is a sample to automate running JMeter JMX tests, parse and then publish the results so it can be viewable from the Reporting Tool

## Install Powershell scripts

First we need to run a powershell script to register/install a few functions to do the parsing and publishing of JMeter CSV output files

```Powershell
PS C:\> ReportPublisher.ps1
```

The script will add three Powershell functions, ```Git-JMeterJMX```, ```Process-JMeterCSV``` and ```Publish-JMeter```.  The script can be found here: [ReportPublisher.ps1](https://github.com/thewordofb/ReportingTool/blob/master/JMeter/ReportPublisher.ps1)

## Sync Latest JMX Tests

Sync the latest powershell JMX tests from bitbucket

- Install Git for Windows
- Add Git to your PATH
  - Control Panel/System and Security/System/Advanced system settings
  - ;C:\Program Files (x86)\Git\cmd;C:\Program Files (x86)\Git\bin;
- Configure Git
  
  ```Powershell
  C:\> git config --global user.name "Test User"
  C:\> git config --global user.email "TestUser@test.com"
  ```

- Clone from Git

    ```Powershell
    git clone git://bitbucket.com/test/testrepo.git
    ```

## Run JMeter via CommandLine

Run JMeter as a commad-line with no GUI.  Reference your test .jmx files and output the results to a .csv file

```PowerShell
PS C:\>jmeter -n -t D:\TestScripts\script.jmx -l D:\TestScripts\scriptresults.csv
```

## Processing Reports

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
