import { LoadingController, ModalController } from '@ionic/angular';
import { AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RequestService } from 'src/app/core/request/request.service';
import { baseEndpoints } from 'src/app/core/config/endpoints';

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
  constructor(
    private modal: ModalController,
    private reqS: RequestService,
    private loader: LoadingController,
    private router: Router
  ) {}

  ngAfterViewChecked() {
    console.log(this.inputToFocus);
    this.inputToFocus.setFocus();
  }

  dismiss() {
    this.modal.dismiss();
  }

  async fetchData() {
    const loading = await this.loader.create({
      message: 'Loading...',
      duration: 3000,
      cssClass: 'custom-loading',
    });

    loading.present();

    this.reqS
      .get(baseEndpoints.requests + '/' + this.file.trim())
      .subscribe((res: any) => {
        console.log('testt', res.data);
        this.request = res.data;
        this.hasData = true;
        loading.dismiss();
        this.approvers = res.data.service.workflow[0].WorkFlowApprovalLevel;
        // this.approvalWorkflow = [
        //   ...res.data.service.approvalWorkFlow,
        //   'Completed',
        // ];
      });
  }
}
