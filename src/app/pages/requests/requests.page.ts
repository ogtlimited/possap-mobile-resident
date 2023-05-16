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

@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss'],
})
export class RequestsPage implements OnInit {
  speakers: any[] = [];
  letters = '0123456789ABCDEF';
  request = [];
  user;
  constructor(
    public confData: ConferenceData,
    private router: Router,
    private route: ActivatedRoute,
    private loader: LoadingController,
    private alertController: AlertController,
    private reqS: RequestService,
    private authS: AuthService,
    private globalS: GlobalService
  ) {}

  ngOnInit(){
    console.log('entered');
  }

  async ionViewWillEnter() {
    const sub = this.authS.currentUser$.subscribe(
      (value) => (this.user = value)
    );
    sub.unsubscribe();
    const taxId = this.user.TaxEntityID;

    const queryParams = {
      startDate: new Date(new Date().getFullYear(), 0, 1).toLocaleDateString('en-gb'),
      endDate: new Date(new Date()).toLocaleDateString('en-gb'),
    };
    console.log(queryParams);
    console.log(new URLSearchParams(queryParams).toString());
    const url = this.globalS.getUrlString(
      baseEndpoints.requests + '/' + taxId,
      queryParams
    );
    console.log(url);
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
        console.log(res.data.ResponseObject.Requests);
        if (res.data.ResponseObject.Requests.length > 0) {
          this.request = res.data.ResponseObject.Requests.map((e) => ({
            ...e,
            bg: this.getRandomColor(),
          }));
        } else {
        }
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
  }
  getRandomColor() {
    let color = '#'; // <-----------
    for (let i = 0; i < 6; i++) {
      color += this.letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  gotoDetail(id): void {
    console.log(id);
    this.router.navigate(['./details', id], { relativeTo: this.route });
  }
  favorite() {}
  share() {}
  unread() {}
}
