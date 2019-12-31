function Publish-JMeter{
    [cmdletbinding()]
    Param(
    [Parameter(Mandatory=$true)][System.Data.DataTable]$Data,
    [Parameter(Mandatory=$true)][string]$Uri,
    [Parameter(Mandatory=$true)][string]$Project,
    [Parameter(Mandatory=$true)][string]$Repo,
    [Parameter(Mandatory=$true)][string]$Type,
    [Parameter(Mandatory=$true)][string]$Date,
    [Parameter(Mandatory=$true)][string]$Build
    )
    Process {
        $Body = @{
        Project = $Project
        Repo = $Repo
        Type = $Type
        Date = $Date
        Build = $Build
        ReportItems = New-Object System.Collections.ArrayList
        } 

        foreach($row in $Data.Rows)
        {
            $ReportItem = @{
                Label = $row[0]
                Samples = $row[1]
                Average = $row[2]
                Min = $row[3]
                Max = $row[4]
                StdDev = $row[5]
                ErrorRate = $row[6]
                Throughput = $row[7]
            }
            $Body['ReportItems'].Add($ReportItem)
          }

          $Json = ($Body | ConvertTo-Json -Depth 4)

          $Result = Invoke-WebRequest -Uri $Uri -Method Post -Body $Json -ContentType 'application/json'
        }
    }

function Process-JMeterCSV {
    [cmdletbinding()]
    Param( 
    [Parameter(Mandatory=$true)][string]$Path,
    [Parameter(Mandatory=$false)][bool]$HasColumnNames = $true)
    Process {
        # Create the datatable, and autogenerate the columns. 
        $datatable = New-Object System.Data.DataTable 

        # Open the text file from disk 
        $reader = New-Object System.IO.StreamReader($Path) 
        $columns = (Get-Content $Path -First 1).Split(',') 

        if ($HasColumnNames -eq $true) 
        { 
            $null = $reader.readLine() 
        } 

        foreach ($column in $columns) {  
            if($HasColumnNames)
            {
                $null = $datatable.Columns.Add($column) 
            }
            else
            {
                $null = $datatable.Columns.Add()
            }
        } 

        # Read in the data, line by line 
        while (($line = $reader.ReadLine()) -ne $null)  { 
            $null = $datatable.Rows.Add($line.Split(',')) 
        }  

        #$datatable | format-table  | out-host

        # Clean Up 
        $reader.Close()
        $reader.Dispose()
    
        return ,$datatable
    }
}