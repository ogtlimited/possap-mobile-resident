import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConferenceData } from 'src/app/providers/conference-data';
import { baseEndpoints } from '../../../core/config/endpoints';
import { RequestService } from '../../../core/request/request.service';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.scss'],
})
export class RequestDetailsComponent implements OnInit {
  request: any = {};
  approvers = [];
  approvalWorkflow = [];
  user = null;
  private routeSub: Subscription;
  constructor(
    private route: ActivatedRoute,
    public confData: ConferenceData,
    private reqS: RequestService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params) => {
      console.log(params);
      this.fetchData(params.id);
    });

    this.authService.currentUser().subscribe((e) => {
      console.log(JSON.parse(e.value));
      if (e.value) {
        this.user = JSON.parse(e.value);
      }
    });
  }

  fetchData(id) {
    this.reqS.get(baseEndpoints.requests + '/' + id + '/' + this.user.id).subscribe((res: any) => {
      console.log('testt', res.data);
      this.request = res.data.RequestStatusLog;
      // this.approvers = res.data?.service?.workflow[0]?.WorkFlowApprovalLevel;
      // this.approvalWorkflow = [
      //   ...res.data.service.approvalWorkFlow,
      //   'Completed',
      // ];
    });
  }
}
