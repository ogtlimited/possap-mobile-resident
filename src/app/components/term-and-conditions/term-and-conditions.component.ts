/* eslint-disable no-underscore-dangle */
import { ModalController } from '@ionic/angular';
/* eslint-disable max-len */
import { Location } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-term-and-conditions',
  templateUrl: './term-and-conditions.component.html',
  styleUrls: ['./term-and-conditions.component.scss'],
})
export class TermAndConditionsComponent implements OnInit {
  @ViewChild('slider', { read: IonSlides }) slides: IonSlides;
  @Input() title: string;
  slideOpts = {
    initialSlide: 0,
    speed: 400,
  };
  btnText = 'Next';
  slideList = [];
  pe = [
    {
      id: 1,
      text: 'The Nigeria Police Force reserves the right to approve or deny your request based on its guidelines or availability of resources. <br> <br> If approved, you will be required to pay a fee for this service (non-refundable application and processing).',
    },
    {
      id: 2,
      text: 'Approved request requires at least 24 hours for processing and issuance. <br> <br> Enquiries can be made through the following info@possap.gov.ng or call: 018884040.',
    },
  ];
  pcc = [
    {
      id: 1,
      text: 'The Nigeria Police Force reserves the right to approve or deny your request based on its guidelines or availability of resources. <br> <br> You will be required to pay a one-time non-refundable application fee and application processing fee.',
    },
    {
      id: 2,
      text: `Payments are to be made only on the POSSAP platform according to the payment invoice. No additional payment is required for biometric capturing or certificate issuance at any physical location. <br> <br>Approved request requires at least 24 hours for processing and issuance.
      Enquiries can be made through the following info@possap.gov.ng or call: 018884040.
      `,
    },
  ];
  egs = [
    {
      id: 1,
      text: `The Nigeria Police Force reserves the right to approve or deny your request based on its guidelines or availability of resources <br> <br> You will be required to pay a non-refundable application fee.
      `,
    },
    {
      id: 2,
      text: `If approved, you will be required to pay a fee for this service (application processing). Approved request requires at least 24 hours for processing and issuance. <br> <br>
       All Police Officers on Specialized Escort and Guard services are to be treated with utmost respect. Any complaint of mistreatment may attract appropriate penalties.`,
    },
    {
      id: 3,
      text: `The Nigeria Police reserves the right to recall any deployed officer without incurring any recourse. <br> <br>
      Enquiries can be made through the following info@possap.gov.ng or call: 018884040.`,
    },
  ];
  constructor(private _location: Location, private modal: ModalController) {}

  ngOnInit() {
    console.log(this.title);
    if(this.title.includes('extract')){
      this.slideList = this.pe;
    } else if(this.title.includes('character')){
      this.slideList = this.pcc;
    }
    else{
      this.slideList = this.egs;
    }
  }

  onEnd() {
    console.log('end');
    this.btnText = 'Accept';
  }

  next() {
    this.slides.slideNext();
  }
  accept() {
    this.modal.dismiss();
  }

  back() {
    this.modal.dismiss().then((e) => {
      this._location.back();
    });
  }
}
