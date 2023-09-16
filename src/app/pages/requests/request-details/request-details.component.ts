import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { GlobalService } from 'src/app/core/services/global/global.service';
import { ConferenceData } from 'src/app/providers/conference-data';
import {
  DownloadUrl,
  baseEndpoints,
  serviceEndpoint,
} from '../../../core/config/endpoints';
import { RequestService } from '../../../core/request/request.service';
import { Browser } from '@capacitor/browser';
import { LoadingController, AlertController } from '@ionic/angular';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { PossapServicesService } from 'src/app/core/services/possap-services/possap-services.service';

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
  serviceName = '';
  private routeSub: Subscription;
  constructor(
    private route: ActivatedRoute,
    public confData: ConferenceData,
    private reqS: RequestService,
    private possapS: PossapServicesService,
    private authS: AuthService,
    private globalS: GlobalService,
    public loadingController: LoadingController,
    public alertController: AlertController
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
    this.reqS
      .postFormData(serviceEndpoint.fetchData, body)
      .subscribe((res: any) => {
        console.log('testt', res.data);
        this.request = res.data.ResponseObject;
        this.serviceName = this.request.ServiceName.toLowerCase();
        this.approvers = res.data?.service?.workflow[0]?.WorkFlowApprovalLevel;
        this.statusLog = res.data.ResponseObject.RequestStatusLog.reverse();
        console.log(this.statusLog);
        // this.approvalWorkflow = [
        //   ...res.data.service.approvalWorkFlow,
        //   'Completed',
        // ];
      });
  }
  compare(a, b, field) {
    console.log(a.Position);
    if (a.Position < b.Postion) {
      return -1;
    }
    if (a.Position > b.Position) {
      return 1;
    }
    return 0;
  }

  async openCapacitorSite(url) {
    await Browser.open({ url });
  }

  async downloadFile(path, fileName) {
    // const url =
    //   'https://file-examples.com/storage/fefb234bc0648a3e7a1a47d/2017/10/file-sample_150kB.pdf';
    const url = DownloadUrl + '/' + path;
    console.log(url);
    const loading = await this.loadingController.create();
    await loading.present();
    const obj = {
      url,
    };
    this.possapS.downloadApprovedRequest(obj).subscribe(
      async (res) => {
        console.log(res.data);
        //const val = this.base64ToPdf(res.data, fileName);
        await Filesystem.writeFile({
          path: fileName + '.pdf',
          data: res.data,
          directory: Directory.Documents,
        });
        this.showSuccess('Successfully download file', fileName + '.pdf');
        loading.dismiss();
      },
      (err) => {
        console.log(err);
        this.showSuccess('Error downloading file', err.message);
        loading.dismiss();
      }
    );
  }

  base64ToPdf(base64String, filename) {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    console.log(url);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
    return url;
  }

  async showSuccess(res, msg) {
    const alert = await this.alertController.create({
      header: msg,
      message: res,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
