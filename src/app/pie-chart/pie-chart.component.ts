
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent {

  public pieChartData: any[] = [];
  public pieChartLegend = true; 
  

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getTimeEntries();
  }

  getTimeEntries(): void {
    const apiUrl = 'https://rc-vault-fap-live-1.azurewebsites.net/api/gettimeentries?code=vO17RnE8vuzXzPJo5eaLLjXjmRW07law99QTD90zat9FfOQJKKUcgQ==';

    this.http.get<any[]>(apiUrl).subscribe((data: any[]) => {
      const totalWorkedTime = this.calculateTotalWorkedTime(data);
      this.generatePieChartData(data, totalWorkedTime);
    });
  }


  //calculate the total time work by an employee

  calculateTotalWorkedTime(timeEntries: any[]): number {
    let totalDuration = 0;
    for (const entry of timeEntries) {
      const startTime = new Date(entry.StarTimeUtc);
      const endTime = new Date(entry.EndTimeUtc);
      const duration = endTime.getTime() - startTime.getTime();
      totalDuration += duration;
    }
    return totalDuration;
  }

  //calculate the percentage of hour work by an employee
  //push the employee and percentage to an array for using in the pie chart

  generatePieChartData(timeEntries: any[], totalWorkedTime: number): void {
    for (const entry of timeEntries) {
      const startTime = new Date(entry.StarTimeUtc);
      const endTime = new Date(entry.EndTimeUtc);
      const duration = endTime.getTime() - startTime.getTime();
      const percentage = (duration / totalWorkedTime) * 100;
      console.log(percentage)
      this.pieChartData.push({
        name: entry.EmployeeName,
        value: percentage
      });
    }
  }

  onChartSelect(event: any): void {
    // Handle chart select event if needed
  }


}


