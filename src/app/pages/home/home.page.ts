import { Component, OnInit } from '@angular/core';
import { ConferenceData } from 'src/app/providers/conference-data';

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

  constructor(public confData: ConferenceData) {}

  ionViewDidEnter() {
    this.confData.getSpeakers().subscribe((speakers: any[]) => {
      console.log(speakers);
      this.speakers = speakers.slice(0, 3);
    });
  }

  ngOnInit() {}

  getBg(num){
    return `url(assets/img/home/img${num + 1}.png)`;
  }
  submit(){

  }

}
