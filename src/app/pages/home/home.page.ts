import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ConferenceData } from 'src/app/providers/conference-data';
import { SearchComponent } from 'src/app/components/search/search.component';
import { Bank3dPaymentService } from 'Bank3d-Payment-Angular';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  speakers: any[] = [];
  searchTerm;
  slideOpts = {
    initialSlide: 0,
    speed: 400,
  };
  merchantKey = 'your-merchant-key';
  reference = 'REF-' + Math.random().toString(16).slice(2);
  amount = '5000';
  constructor(
    public confData: ConferenceData,
    private router: Router,
    private modalController: ModalController,
    private bank3d: Bank3dPaymentService
  ) {}

  ionViewDidEnter() {
    this.confData.getSpeakers().subscribe((speakers: any[]) => {
      console.log('speakers', speakers);
      this.speakers = speakers.slice(0, 3);
    });
  }

  ngOnInit() {}

  getBg(num) {
    return `url(assets/img/home/img${num + 1}.png)`;
  }
  submit() {
    this.router.navigate([`search/${this.searchTerm}`]);
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: SearchComponent,
      cssClass: 'fullscreen',
    });
    await modal.present();
  }
  paymentCallback(response): void {
    console.log('Pay', response);
  }
  closedPaymentModal(): void {
    console.log('payment is closed');
  }
}
