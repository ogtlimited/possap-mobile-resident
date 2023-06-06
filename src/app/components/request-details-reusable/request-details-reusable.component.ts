/* eslint-disable @typescript-eslint/naming-convention */
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-request-details-reusable',
  templateUrl: './request-details-reusable.component.html',
  styleUrls: ['./request-details-reusable.component.scss'],
})
export class RequestDetailsReusableComponent implements OnInit {
  @Input() request;
  @Input() statusLog;
  keys: string[];
  values: any[];
  constructor(private cdref: ChangeDetectorRef) { }

  ngOnInit() {
    console.log(this.request);
    if (this.request) {
      if (this.request.ServiceName === 'POLICE EXTRACT') {
        const extract = {
          'Was Incident Reported': this.request.ServiceVM.IsIncidentReported,
          'Court Affidavit Number': this.request.ServiceVM.AffidavitNumber,
          'Court Affidavit Date of Issuance':  new Date(this.request.ServiceVM.AffidavitDateOfIssuance).toLocaleDateString(),
          // 'Reason for Request': this.formatReason(this.request.SelectedCategories, this.request.ServiceVM),
        };
        console.log(extract, 'test');
        this.keys = Object.keys(extract);
        this.values = Object.values(extract);
        this.cdref.detectChanges();
      } else if (this.request.sServiceName === 'POLICE CHARACTER CERTIFICATE') {
        const form = {
          'Police Command':
            this.request.SelectedCommand + ', ' + this.request.SelectedState,
          'Request Type': this.request.RequestType,
          'Reason for inquiry': this.request.CharacterCertificateReasonForInquiry,
          'Country of Origin': this.request.SelectedCountryOfOrigin,
          'Place of Birth': this.request.PlaceOfBirth,
          'Date of Birth': this.request.DateOfBirth,
          'Country of Passport': this.request.SelectedCountryOfPassport,
          'Passport Number': this.request.PassportNumber,
          'Place of Issuance': this.request.PlaceOfIssuance,
          'Date of Issuance': this.request.DateOfIssuance,
        };
        console.log(form, 'test');
        this.keys = Object.keys(form);
        this.values = Object.values(form);
      }
    }
  }

  formatReason(reasons, obj) {
    return reasons
      .map((e, i) => e + ': ' + obj[i + 1].join(', '))
      .join(', ');
  }


  openCapacitorSite(url){

  }

}
