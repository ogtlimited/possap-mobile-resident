import { LoadingController } from '@ionic/angular';
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
 infoServices = [
    // {
    //   title: 'Citizen Report',
    //   subtitle: 'Apply for character certificate',
    //   icon: 'creport',
    //   code: 'citizensreport',
    // },
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
    private possapS: PossapServicesService,
    private loader: LoadingController
  ) {}

  async ngOnInit() {
    const loading = await this.loader.create({
      message: 'Loading...',
      duration: 3000,
      cssClass: 'custom-loading',
    });

    loading.present();
    this.possapS.fetchServices().subscribe((s: any) => {
      console.log(s.data);
      loading.dismiss();
      this.services = s.data;
    });
  }

  navigate(path, title, type = '') {
    console.log(path);
    this.router.navigate(['/general-form'], {
      queryParams: { service: path, title, type },
    });
  }
}
