import { PossapServicesService } from './../../core/services/possap-services/possap-services.service';
import { ActivatedRoute, Router } from '@angular/router';
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-services',
  templateUrl: './services.page.html',
  styleUrls: ['./services.page.scss'],
})
export class ServicesPage implements OnInit {
  services = [];
  // [
  //   {
  //     title: 'Police Extract',
  //     code: 'cc',
  //     subtitle: 'Apply for character certificate',
  //     icon: 'pe',
  //   },
  //   {
  //     title: 'Tint Permit',
  //     subtitle: 'Apply for tint permit',
  //     icon: 'tpermit',
  //     code: 'tp',
  //   },
  //   {
  //     title: 'SPY',
  //     subtitle: 'Apply for spy',
  //     icon: 'spy',
  //     code: 'spy',
  //   },
  //   {
  //     title: 'Central Motor Registry',
  //     subtitle: 'Apply for escort ad guard services',
  //     icon: 'cmr',
  //     code: 'cmr',
  //   },
  //   {
  //     title: 'Police Clearance Certificate',
  //     subtitle: 'Apply for police clearance certificate using your NIN',
  //     icon: 'PCC',
  //     code: 'pcc',
  //   },
  //   {
  //     title: 'Escort and Guard Services',
  //     subtitle: 'Apply for escort ad guard services',
  //     icon: 'egs',
  //     code: 'egs',
  //   },
  // ];
  infoServices = [
    {
      title: 'Citizen Report',
      subtitle: 'Apply for character certificate',
      icon: 'creport',
      code: 'citizensreport',
    },
    {
      title: 'SOS',
      subtitle: 'Apply for police clearance certificate using your NIN',
      icon: 'sos',
      code: 'sos',
    },

    {
      title: 'Incident Booking',
      subtitle: 'Apply for police clearance certificate using your NIN',
      code: 'incidentbooking',
      icon: 'ibooking',
    },
  ];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private possapS: PossapServicesService
  ) {}

  ngOnInit() {
    this.possapS.fetchServices().subscribe((s: any) => {
      console.log(s.data);
      this.services = s.data;
    });
  }

  navigate(path, title, type='') {
    console.log(path);
    this.router.navigate(['/general-form'], {
      queryParams: { service: path, title, type },
    });
  }
}
