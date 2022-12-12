import { PossapServicesService } from './../../../../core/services/possap-services/possap-services.service';
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
      slug: 'PCC',
      id: 1,
    },
    {
      title: 'Police Extract',
      subtitle: 'Apply for police extract using your NIN',
      icon: 'PCC',
      slug: 'PE',
      id: 2,
    },
    {
      title: 'CMR',
      subtitle: 'Apply for CMR services',
      icon: 'EGS',
      slug: 'CMR',
      id: 3,
    },
  ];
  constructor(private router: Router, private possapS: PossapServicesService) {}

  ngOnInit() {
    this.possapS.fetchServices().subscribe((s: any) => {
      console.log(s.data);
      // loading.dismiss();
      this.services = s.data
        .map((e) => ({
          ...e,
          title: e.name,
          subtitle: 'Apply for ' + e.name + ' services',
        }))
        .slice(0, 3);
      console.log(this.services);
    });
  }

  navigate(path, service, type = '') {
    console.log(path, service, type);
    this.router.navigate(['/general-form'], {
      queryParams: { service: path, title: service.title, type },
    });
  }
}
