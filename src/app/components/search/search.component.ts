import { LoadingController, ModalController } from '@ionic/angular';
import { AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestService } from 'src/app/core/request/request.service';
import { baseEndpoints, serviceEndpoint } from 'src/app/core/config/endpoints';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { GlobalService } from 'src/app/core/services/global/global.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements AfterViewChecked {
  @ViewChild('inputToFocus') inputToFocus;
  file = '';
  request: any;
  hasData: boolean;
  approvers: any;
  user: any;
  routeSub: any;
  statusLog: any;
  notFound = null;
  constructor(
    private modal: ModalController,
    private reqS: RequestService,
    private authS: AuthService,
    private globalS: GlobalService,
    private loader: LoadingController,
    private route: ActivatedRoute
  ) {}

  ngAfterViewChecked() {
    // console.log(this.inputToFocus);
    this.inputToFocus.setFocus();
    const sub = this.authS.currentUser$.subscribe(
      (value) => (this.user = value)
    );
    sub.unsubscribe();
  }

  dismiss() {
    this.modal.dismiss();
  }

  async fetchData() {
    const body = this.globalS.computeCBSBody(
      'get',
      baseEndpoints.singleRequests +
        '/' +
        this.file.trim() +
        '/' +
        this.user.TaxEntityID,
      {},
      '',
      '',
      null
    );
    const loading = await this.loader.create({
      message: 'Loading...',
      duration: 3000,
      cssClass: 'custom-loading',
    });

    loading.present();
    this.reqS
      .postFormData(serviceEndpoint.fetchData, body)
      .subscribe((res: any) => {
        console.log('testt', res.data);
        loading.dismiss();
        if(!res.data.Error){

          this.request = res.data.ResponseObject;
          this.approvers = res.data?.service?.workflow[0]?.WorkFlowApprovalLevel;
          this.statusLog = res.data.ResponseObject.RequestStatusLog.reverse();
        }else{
          this.notFound = true;
        }
        console.log(this.statusLog);
        // this.approvalWorkflow = [
        //   ...res.data.service.approvalWorkFlow,
        //   'Completed',
        // ];
      });
  }
  openCapacitorSite(url) {}
}
