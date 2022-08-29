import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-most-used',
  templateUrl: './most-used.component.html',
  styleUrls: ['./most-used.component.scss'],
})
export class MostUsedComponent implements OnInit {
  services = [
    {
      title: 'Police Character Certificate',
      subtitle: 'Apply for character certificate',
      icon: 'CC',
      code: 'pcc',
    },
    {
      title: 'Police Extract',
      subtitle: 'Apply for police extract using your NIN',
      icon: 'PCC',
      code: 'pe'
    },
    {
      title: 'Escort and Guard Services',
      subtitle: 'Apply for escort ad guard services',
      icon: 'EGS',
      code: 'egs'
    }
  ];
  constructor(private router: Router) { }

  ngOnInit() {}

  navigate(path, title){
    console.log(path);
    this.router.navigate(['/general-form'], {queryParams: {service: path, title} });
  }

}
