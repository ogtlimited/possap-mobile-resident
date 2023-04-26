import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { GlobalService } from 'src/app/core/services/global/global.service';
import { ConferenceData } from 'src/app/providers/conference-data';
import { baseEndpoints } from '../../../core/config/endpoints';
import { RequestService } from '../../../core/request/request.service';
import { Browser } from '@capacitor/browser';
@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.scss'],
})
export class RequestDetailsComponent implements OnInit {
  request: any = null;
  approvers = [];
  approvalWorkflow = [];
  statusLog = [];
  user: any;
  private routeSub: Subscription;
  constructor(
    private route: ActivatedRoute,
    public confData: ConferenceData,
    private reqS: RequestService,
    private authS: AuthService,
    private globalS: GlobalService
  ) {}

  ngOnInit() {
    const sub = this.authS.currentUser$.subscribe(
      (value) => (this.user = value)
    );
    sub.unsubscribe();
    const taxId = this.user.TaxEntityID;
    this.routeSub = this.route.params.subscribe((params) => {
      console.log(params);
      this.fetchData(params.id, taxId);
    });
    this.routeSub.unsubscribe();
  }

  fetchData(id, taxId) {
    const body = this.globalS.computeCBSBody(
      'get',
      baseEndpoints.singleRequests + '/' + id + '/' + taxId,
      {},
      '',
      '',
      null
    );
    this.reqS.postFormData(baseEndpoints.cbsRoutes, body).subscribe((res: any) => {
      console.log('testt', res.data);
      this.request = res.data.ResponseObject
      ;
      this.approvers = res.data?.service?.workflow[0]?.WorkFlowApprovalLevel;
      this.statusLog = res.data.ResponseObject.RequestStatusLog.reverse();
      console.log(this.statusLog);
      // this.approvalWorkflow = [
      //   ...res.data.service.approvalWorkFlow,
      //   'Completed',
      // ];
    });


  }
  compare( a, b, field ) {
    console.log(a.Position);
    if ( a.Position < b.Postion ){
      return -1;
    }
    if ( a.Position> b.Position ){
      return 1;
    }
    return 0;
  }

  async openCapacitorSite(url) {
    await Browser.open({ url });
  };
}
