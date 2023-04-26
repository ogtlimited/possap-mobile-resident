import { LoadingController } from '@ionic/angular';
import { PossapServicesService } from './../../core/services/possap-services/possap-services.service';
import { ActivatedRoute, Router } from '@angular/router';
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { IService, ServiceResponse } from 'src/app/core/models/ResponseModel';

@Component({
  selector: 'app-services',
  templateUrl: './services.page.html',
  styleUrls: ['./services.page.scss'],
})
export class ServicesPage implements OnInit {
  services: IService[];
  activeServices = [
    'POLICE CHARACTER CERTIFICATE',
    'POLICE CHARACTER CERTIFICATE DIASPORA',
    'POLICE EXTRACT',
  ];
  icons = ['pcc', 'pe', 'pcc'];
  infoServices = [
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
  jsonForm: any;
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
    this.possapS.fetchServices().subscribe((schema: any) => {
      // console.log(schema);
      this.possapS.fetchCBSServices().subscribe((s: ServiceResponse) => {
        // console.log(s);
        loading.dismiss();
        this.services = s.ResponseObject.services.filter((v) =>
          this.activeServices.includes(v.Name)
        );
        this.possapS.mapSchemaToCBSID(schema, this.services);
      });
    });
  }

  navigate(path, title, type = '') {
    console.log(path);
    this.router.navigate(['/general-form'], {
      queryParams: { service: path, title, type },
    });
  }
}
