/* eslint-disable @typescript-eslint/naming-convention */
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

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
  amount = '500000';
  paymentResponse;
  constructor(private route: ActivatedRoute, private authS: AuthService) {}

  ngOnInit() {
    this.reference = this.generateRef();
    this.authS.currentUser$.subscribe((user) => (this.owner = user));
    this.details = JSON.parse(
      this.route.snapshot.paramMap.get('details') || ''
    );
    this.invoice = this.details;
    console.log(this.details);
  }

  setSuccess(value: boolean) {
    this.isSuccess = value;
  }

  paymentCallback(response): void {
    console.log('Pay', response);
    this.isSuccess = true;
    this.paymentResponse = response;

  }
  closedPaymentModal(): void {
    console.log('payment is closed');
  }

  generateRef(){
    return 'REF-' + Math.random().toString(16).slice(2);
  }
}
