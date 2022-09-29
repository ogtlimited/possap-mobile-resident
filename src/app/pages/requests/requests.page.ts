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
    private reqS: RequestService
  ) {}

  ionViewDidEnter() {
    this.confData.getSpeakers().subscribe((speakers: any[]) => {
      this.speakers = speakers.map((e) => ({
        ...e,
        bg: this.getRandomColor(),
      }));
    });
  }

  ngOnInit() {
    this.reqS.get(baseEndpoints.requests).subscribe((res: any) => {
      console.log(res.data);
      this.request = res.data.map((e) => ({
        ...e,
        bg: this.getRandomColor(),
      }));
    });
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
