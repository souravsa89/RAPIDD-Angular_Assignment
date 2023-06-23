// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-employee-details',
//   templateUrl: './employee-details.component.html',
//   styleUrls: ['./employee-details.component.css']
// })
// export class EmployeeDetailsComponent {

// }


import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {
  title = 'Employee-details';
  data: any = [];
  employeeTotalTimes: any = [];
  currentPage = 1;
  pageSize = 20;  //show 20 employee per page
  totalPages = 0;  // page start from 0
  pagedEmployees: any[] = [];

 
  constructor(private http: HttpClient) {}


    // get data from the api

  getData() {
    const url =
      'https://rc-vault-fap-live-1.azurewebsites.net/api/gettimeentries?code=vO17RnE8vuzXzPJo5eaLLjXjmRW07law99QTD90zat9FfOQJKKUcgQ==';
    this.http.get(url).subscribe((res: any) => {
      this.data = res;
      this.calculateTotalTimes();
      this.calculatePagination();
    });
  }
    // calculate total time employee work
    //calculate from start time and end time
  calculateTotalTimes() {
    this.employeeTotalTimes = this.data.map((employee: any) => {
      const startTime = new Date(employee.StarTimeUtc);
      const endTime = new Date(employee.EndTimeUtc);

      const timeDiff = endTime.getTime() - startTime.getTime();

      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      const totalTime = `${hours}h ${minutes}m ${seconds}s`;

      return {
        ...employee,
        totalTime: totalTime,
      };
    });
  }

    // function for the employee work less than a certain time
    // 
  isLessThan100Hours(totalTime: string): boolean {
    const hoursRegex = /\d+h/;
    const matchResult = totalTime.match(hoursRegex);
    
    if (matchResult) {
      const hours = Number(matchResult[0].replace('h', ''));
      return hours < 1;
    }
  
    return false;
  }
  
    // this functiom calculate for the pegination and 
  calculatePagination() {
    this.totalPages = Math.ceil(this.employeeTotalTimes.length / this.pageSize);
    this.currentPage = 1;
    this.updatePagedEmployees();
  }
    // function for updating the page
  updatePagedEmployees() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedEmployees = this.employeeTotalTimes.slice(startIndex, endIndex);
  }
    // previous page function
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedEmployees();
    }
  }
    //next page function
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedEmployees();
    }
  }

  

  ngOnInit() {
    this.getData();
  }
}
