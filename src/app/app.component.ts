// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css'],
// })
// export class AppComponent {
//   title = 'employee-table-app';
// }

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Employee-details';
  data: any = [];
  employeeTotalTimes: any = []; // Array to store total time for each employee

  constructor(private http: HttpClient) {}

  getData() {
    const url =
      'https://rc-vault-fap-live-1.azurewebsites.net/api/gettimeentries?code=vO17RnE8vuzXzPJo5eaLLjXjmRW07law99QTD90zat9FfOQJKKUcgQ==';
    this.http.get(url).subscribe((res: any) => {
      this.data = res;
      console.log(this.data);
      this.calculateTotalTimes();
    });
  }

  calculateTotalTimes() {
    this.employeeTotalTimes = this.data.map((employee: any) => {
      const startTime = new Date(employee.StarTimeUtc);
      const endTime = new Date(employee.EndTimeUtc);

      const timeDiff = endTime.getTime() - startTime.getTime();

      // Calculate hours, minutes, and seconds
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      // Format the total time
      const totalTime = `${hours}h ${minutes}m ${seconds}s`;
      console.log(totalTime)

      return {
        ...employee,
        totalTime: totalTime,
      };
    });
  }

  isLessThan100Hours(totalTime: string): boolean {
    const hoursRegex = /\d+h/;
    const matchResult = totalTime.match(hoursRegex);
    
    if (matchResult) {
      const hours = Number(matchResult[0].replace('h', ''));
      return hours < 1;
    }
  
    return false;
  }
  

  ngOnInit() {
    this.getData();
  }
}

