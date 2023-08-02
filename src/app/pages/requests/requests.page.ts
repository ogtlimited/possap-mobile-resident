/* eslint-disable @typescript-eslint/naming-convention */
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { GlobalService } from './../../core/services/global/global.service';
import { AlertController, LoadingController } from '@ionic/angular';
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConferenceData } from '../../providers/conference-data';
import { baseEndpoints, serviceEndpoint } from './../../core/config/endpoints';
import { RequestService } from './../../core/request/request.service';
import { environment } from 'src/environments/environment.prod';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { PossapServicesService } from 'src/app/core/services/possap-services/possap-services.service';
import { ServiceResponse } from 'src/app/core/models/ResponseModel';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss'],
})
export class RequestsPage implements OnInit {
  speakers: any[] = [];
  activeServices = [
    'police character certificate',
    'police character certificate diaspora',
    'police extract',
    'escort and guard services',
    'police escort',
  ];
  letters = '0123456789ABCDEF';
  request = [];
  user;
  isModalOpen = false;
  filterForm: FormGroup;
  today = new Date();
  selectedFilter: any;
  searchText = '';
  services = [];
  egsAbbrev = 'ESCORT GUARD SERVICES';
  constructor(
    public confData: ConferenceData,
    private router: Router,
    private route: ActivatedRoute,
    private loader: LoadingController,
    private alertController: AlertController,
    private reqS: RequestService,
    private authS: AuthService,
    private globalS: GlobalService,
    private possapS: PossapServicesService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      startDate: [
        formatDate(
          new Date(new Date().setDate(this.today.getDate() - 90)),
          'yyyy-MM-dd',
          'en'
        ),
        [Validators.required],
      ],
      endDate: [
        formatDate(new Date(), 'yyyy-MM-dd', 'en'),
        [Validators.required],
      ],
      serviceType: ['', []],
    });
  }

  ngOnInit() {
    console.log('entered');
    this.possapS.fetchCBSServices().subscribe((s: ServiceResponse) => {
      console.log(s);
      this.services = s.ResponseObject.services.filter((v) =>
        this.activeServices.includes(v.Name.toLowerCase())
      );
      console.log(this.services);
    });
  }

  async ionViewWillEnter() {
    const queryParams = this.globalS.startEnd();
    this.loadRequest(queryParams);
  }

  async loadRequest(queryParams) {
    const sub = this.authS.currentUser$.subscribe((value) => {
      console.log(value);
      this.user = value;
    });
    sub.unsubscribe();
    if (this.user) {
      const taxId = this.user.TaxEntityID;
      console.log(queryParams, taxId);
      const url = this.globalS.getUrlString(
        baseEndpoints.requests + '/' + taxId,
        queryParams
      );
      const headers = {
        CLIENTID: environment.clientId,
      };
      const body = this.globalS.computeCBSBody(
        'get',
        url,
        headers,
        'SIGNATURE',
        taxId.toString(),
        null
      );
      const loading = await this.loader.create({
        message: 'Loading...',
        duration: 3000,
        cssClass: 'custom-loading',
      });

      loading.present();
      this.reqS.postFormData(serviceEndpoint.fetchData, body).subscribe(
        (res: any) => {
          console.log(res);
          //if (res.data.ResponseObject.Requests.length > 0) {
          this.request = res.data.ResponseObject.Requests.map((e) => ({
            ...e,
            ServiceNameModified: e.ServiceName.toLowerCase().includes('escort')
              ? this.egsAbbrev
              : e.ServiceName,
            bg: this.getRandomColor(),
          }));
          // } else {
          // }
          this.loader.dismiss();
        },
        async (err) => {
          const alert = await this.alertController.create({
            header: 'Error',
            message: 'Failed to connect to server',
            buttons: ['OK'],
          });
          await alert.present();
          console.log(err);
        }
      );
    } else {
      this.presentAlert(
        'You have to signup / login to proceed',
        'Login / Signup',
        'login'
      );
    }
  }
  getRandomColor() {
    let color = '#'; // <-----------
    for (let i = 0; i < 6; i++) {
      color += this.letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  gotoDetail(id, item): void {
    console.log(id, item);
    this.router.navigate(['./details', id], {
      queryParams: { item: JSON.stringify(item) },
      relativeTo: this.route,
    });
  }
  favorite() {}
  share() {}
  unread() {}

  async presentAlert(msg, okText, navigate) {
    const alert = await this.alertController.create({
      header: 'Alert !!',
      message: msg,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.alertController.dismiss().then((v) => {
              this.router.navigate(['app/tabs/home']);
            });
          },
        },
        {
          text: okText,
          role: 'confirm',
          handler: () => {
            this.alertController.dismiss();
            this.router.navigate([navigate]);
          },
        },
      ],
    });

    await alert.present();
  }

  submitFilter() {
    const { value } = this.filterForm;
    value.startDate = new Date(value.startDate).toLocaleDateString('en-GB');
    value.endDate = new Date(value.endDate).toLocaleDateString('en-GB');
    const query = Object.keys(value)
      .filter((key) => value[key] !== '')
      .reduce((cur, key) => Object.assign(cur, { [key]: value[key] }), {});
    console.log(query);
    this.loadRequest(query);
    this.toggleFilterModal();
  }
  toggleFilterModal() {
    this.isModalOpen = !this.isModalOpen;
    // this.inlineModal.dismiss();
  }
  clearFilter() {
    this.selectedFilter = null;
    // this.filteredData = this.data;
  }
}
