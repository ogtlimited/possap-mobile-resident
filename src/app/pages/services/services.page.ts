/* eslint-disable @typescript-eslint/naming-convention */
import { LoadingController } from '@ionic/angular';
import { PossapServicesService } from './../../core/services/possap-services/possap-services.service';
import { ActivatedRoute, Router } from '@angular/router';
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { AxiosResponse, IService } from 'src/app/core/models/ResponseModel';
import { AbbrevPipe } from 'src/app/core/pipes/abbrev.pipe';
import { Preferences, Preferences as Storage } from '@capacitor/preferences';
@Component({
  selector: 'app-services',
  templateUrl: './services.page.html',
  styleUrls: ['./services.page.scss'],
})
export class ServicesPage implements OnInit {
  services: IService[];
  activeServices = [
    'police character certificate',
    'police character certificate diaspora',
    'police extract',
    'escort and guard services',
    'police escort',
  ];
  egsAbbrev = 'ESCORT GUARD SERVICES';
  icons = ['pcc', 'pe', 'pccd'];
  infoServices = [
    {
      title: 'CMR',
      subtitle: 'Apply for CMR services',
      icon: 'cmr',
      slug: 'CMR',
      code: 'CMR',
      id: 3,
    },
    // {
    //   title: 'SOS',
    //   subtitle: 'Apply for police clearance certificate using your NIN',
    //   icon: 'sos',
    //   code: 'sos',
    // },

    // {
    //   title: 'Incident Booking',
    //   subtitle: 'Apply for police clearance certificate using your NIN',
    //   code: 'incidentbooking',
    //   icon: 'ibooking',
    // },
  ];
  jsonForm: any;
  themeMode: string;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private possapS: PossapServicesService,
    private loader: LoadingController
  ) {}

  ionViewWillEnter() {
    this.loadData();
  }
  async ngOnInit() {
    this.loadData();
  }

  async loadData() {
    const theme = await Preferences.get({ key: 'themeMode' });
    this.themeMode = theme.value;
    const loading = await this.loader.create({
      message: 'Loading...',
      duration: 3000,
      cssClass: 'custom-loading',
    });

    loading.present();
    this.possapS.fetchServices().subscribe((schema: any) => {
      console.log(schema);
      this.possapS.fetchCBSServices().subscribe((s: AxiosResponse) => {
        console.log(s);
        loading.dismiss();
        this.services = s.data.ResponseObject.services.filter((v) =>
          this.activeServices.includes(v.Name.toLowerCase())
        ).map(d => ({...d, ServiceNameModified: d.Name.toLowerCase().includes('escort')
        ? this.egsAbbrev : d.Name }));
        console.log(this.services);
        this.possapS.mapSchemaToCBSID(schema, this.services);
      });
    });
  }

  navigate(path, title, type = '') {
    console.log(path, title);
    if (title.toLowerCase().includes('escort')) {
      this.router.navigate(['/egs'], {
        queryParams: { service: path, title, type },
      });
    } else {
      this.router.navigate(['/general-form'], {
        queryParams: { service: path, title, type },
      });
    }
  }
  goto(path, title, type = '') {
    this.router.navigate(['/general-form/cmr'], {
      queryParams: { service: path, title, type },
    });
  }
}
