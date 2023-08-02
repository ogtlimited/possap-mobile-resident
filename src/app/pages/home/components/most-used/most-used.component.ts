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
  ];
  mainServices = [
    // 'ESCORT AND GUARD SERVICES',
    'POLICE CHARACTER CERTIFICATE',
    'POLICE EXTRACT',
  ];
  constructor(private router: Router, private possapS: PossapServicesService) {}

  ngOnInit() {
    this.possapS.fetchCoreServices().then((s: any) => {
      console.log(s);
      // loading.dismiss();
      this.services = s.services.filter((f) => this.mainServices.includes(f.Name))
      .map((e) => ({
        ...e,
        title: this.toCapital(e.Name),
        icon: e.Name.includes('EXTRACT') ? 'PE' : 'PCC',
        slug: e.Name.includes('EXTRACT') ? 'PE' : 'PCC',

        subtitle: 'Apply for ' + this.toCapital(e.Name) + ' services',
      }));;

      console.log(this.services);
    });
  }

  navigate(path, service, type = '') {
    console.log(path, service, type);
    this.router.navigate(['/general-form'], {
      queryParams: { service: path, title: service.title, type },
    });
  }

  toCapital(str: string){
    const spl = str.split(' ');
    const result = spl.map(s => s[0].toUpperCase() + s.slice(1).toLowerCase() + ' ');
    return result.join(' ');
  }
}
