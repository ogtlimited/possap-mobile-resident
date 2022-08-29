import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report-incidence',
  templateUrl: './report-incidence.component.html',
  styleUrls: ['./report-incidence.component.scss'],
})
export class ReportIncidenceComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {}

  navigate(path, title){
    console.log(path);
    this.router.navigate(['/general-form'], {queryParams: {service: path, title} });
  }

}
