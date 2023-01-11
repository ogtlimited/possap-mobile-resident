import { LoadingController } from '@ionic/angular';
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConferenceData } from 'src/app/providers/conference-data';
import { RequestService } from 'src/app/core/request/request.service';
import { baseEndpoints } from 'src/app/core/config/endpoints';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  loading = false;

  request: any = {};
  approvers = [];
  approvalWorkflow = [];
  hasData = false;
  private routeSub: Subscription;
  constructor(
    private route: ActivatedRoute,
    public confData: ConferenceData,
    private reqS: RequestService,
    private loader: LoadingController,
    private router: Router,
  ) {}

  async ngOnInit() {
    const loading = await this.loader.create({
      message: 'Loading...',
      duration: 3000,
      cssClass: 'custom-loading',
    });

    loading.present();

    this.routeSub = this.route.params.subscribe((params) => {
      console.log(params);
      this.fetchData(params.id);
    });
  }

  fetchData(id) {
    this.reqS.get(baseEndpoints.requests + '/' + id).subscribe((res: any) => {
      console.log('testt', res.data);
      this.request = res.data;
      this.hasData = true;
      this.approvers = res.data.service.workflow[0].WorkFlowApprovalLevel;
      // this.approvalWorkflow = [
      //   ...res.data.service.approvalWorkFlow,
      //   'Completed',
      // ];
    });
  }

  backToHome(){
    this.router.navigate(['/']);
  }
}
