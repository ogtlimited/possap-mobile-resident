import { Component, OnInit } from '@angular/core';
import { ConferenceData } from '../../../providers/conference-data';

@Component({
  selector: 'app-places-card',
  templateUrl: './places-card.component.html',
  styleUrls: ['./places-card.component.scss'],
})
export class PlacesCardComponent implements OnInit {
  speakers: any[] = [];
  searchTerm
  slideOpts = {
    initialSlide: 0,
    // slidesPerView: 3,
    speed: 400,
  };
  constructor(public confData: ConferenceData) {}

  ionViewDidEnter() {
  }
  
  ngOnInit() {
    this.confData.getSpeakers().subscribe((speakers: any[]) => {
      this.speakers = speakers.slice(0, 4);
      console.log(this.speakers)
    });
    console.log(this.speakers)
  }

}
