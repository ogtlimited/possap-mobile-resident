import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConferenceData } from 'src/app/providers/conference-data';

@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.scss'],
})
export class RequestDetailsComponent implements OnInit {
  request: any = {};
  private routeSub: Subscription;
  constructor(private route: ActivatedRoute, public confData: ConferenceData) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params) => {
      console.log(params);
      this.fetchData(params.id);
    });
  }

  fetchData(id) {
    this.confData.getSpeakers().subscribe((sp) => {
      console.log(sp);
      this.request = sp[0];
    });
  }
}
