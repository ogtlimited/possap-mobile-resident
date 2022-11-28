import { AlertController, LoadingController } from '@ionic/angular';
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConferenceData } from '../../providers/conference-data';
import { baseEndpoints } from './../../core/config/endpoints';
import { RequestService } from './../../core/request/request.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss'],
})
export class RequestsPage implements OnInit {
  speakers: any[] = [];
  letters = '0123456789ABCDEF';
  request = [];

  constructor(
    public confData: ConferenceData,
    private router: Router,
    private route: ActivatedRoute,
    private loader: LoadingController,
    private alertController: AlertController,
    private reqS: RequestService
  ) {}

  async ngOnInit() {
    const loading = await this.loader.create({
      message: 'Loading...',
      duration: 3000,
      cssClass: 'custom-loading',
    });

    loading.present();
    this.reqS.get(baseEndpoints.requests).subscribe(
      (res: any) => {
        console.log(res.data);
        if (res.data.length > 0) {
          this.request = res.data.map((e) => ({
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
