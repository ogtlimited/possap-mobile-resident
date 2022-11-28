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
  constructor(private route: ActivatedRoute, private authS: AuthService ) {}

  ngOnInit() {
    this.authS.currentUser$.subscribe(user => this.owner = user);
    this.details = JSON.parse(
      this.route.snapshot.paramMap.get('details') || ''
    );
    this.invoice = this.details.genInvoice;
    console.log(this.details);
  }
}
