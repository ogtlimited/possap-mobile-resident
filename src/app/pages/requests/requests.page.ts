/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { ConferenceData } from '../../providers/conference-data';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss'],
})
export class RequestsPage implements OnInit {

  speakers: any[] = [];
  letters = '0123456789ABCDEF';

  constructor(public confData: ConferenceData) {}

  ionViewDidEnter() {
    this.confData.getSpeakers().subscribe((speakers: any[]) => {
      this.speakers = speakers.map(e => ({...e, bg: this.getRandomColor()}));
    });
  }

  ngOnInit() {
  }
  getRandomColor() {
    let color = '#'; // <-----------
    for (var i = 0; i < 6; i++) {
        color += this.letters[Math.floor(Math.random() * 16)];
    }
    return color
}
  favorite(){

  }
  share(){

  }
  unread(){

  }

}
