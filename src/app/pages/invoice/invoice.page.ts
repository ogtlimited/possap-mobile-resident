/* eslint-disable @typescript-eslint/naming-convention */
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  CBSDomainUrl,
  serviceEndpoint,
  utilityEndpoint,
} from 'src/app/core/config/endpoints';
import { RequestService } from 'src/app/core/request/request.service';
import { GlobalService } from 'src/app/core/services/global/global.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.page.html',
  styleUrls: ['./invoice.page.scss'],
})
export class InvoicePage implements OnInit {
  details: any;
  title = 'Make Payment';
  owner: any;
  invoice;
  isSuccess: boolean;
  merchantKey = 'B3Du4wtqwiI6B8kNkNrF3O58';
  reference;
  amount = '0';
  paymentResponse;
  constructor(
    private route: ActivatedRoute,
    private globalS: GlobalService,
    private authS: AuthService,
    private reqS: RequestService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.authS.currentUser$.subscribe((user) => (this.owner = user));
    this.details = JSON.parse(
      this.route.snapshot.paramMap.get('details') || ''
    );
    if (this.details) {
      this.reference = this.details.InvoiceId;
      this.invoice = this.details;
      this.amount = (this.details.AmountDue * 100).toString();
    }
    console.log(this.details);
  }

  setSuccess(value: boolean) {
    this.isSuccess = value;
  }

  paymentCallback(response): void {
    console.log('Pay', response);
    this.isSuccess = true;
    this.paymentResponse = this.amount;
    this.fetchData(this.owner.CBSUserId, this.details.InvoiceId);
    this.cdRef.detectChanges();
    // setTimeout(() => {
    //   const path = CBSDomainUrl + '/p/notify/' + this.reference;
    //   window.open(path, '_blank');
    // }, 5000);
  }

  fetchData(id, ref) {
    const body = this.globalS.computeCBSBody(
      'get',
      utilityEndpoint.paymentNotify + '/' + ref + '/' + id,
      {},
      '',
      '',
      null
    );
    this.reqS
      .postFormData(serviceEndpoint.fetchData, body)
      .subscribe((res: any) => {
        console.log('testt', res.data);
      });
  }
  closedPaymentModal(): void {
    console.log('payment is closed');
  }
}
