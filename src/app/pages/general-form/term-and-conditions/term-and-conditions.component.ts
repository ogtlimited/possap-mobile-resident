/* eslint-disable no-underscore-dangle */
import { ModalController } from '@ionic/angular';
/* eslint-disable max-len */
import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-term-and-conditions',
  templateUrl: './term-and-conditions.component.html',
  styleUrls: ['./term-and-conditions.component.scss'],
})
export class TermAndConditionsComponent implements OnInit {
  @ViewChild('slider', { read: IonSlides }) slides: IonSlides;
  slideOpts = {
    initialSlide: 0,
    speed: 400,
  };
  btnText = 'Next';
  slideList = [
    {
      id: 1,
      text: 'That the information supplied to the Nigeria Police Force by the Applicant in the course of this application are voluntarily made and the Applicant undertakes that they are consciously true to the best of his/her knowledge;',
    },
    {
      id: 2,
      text: 'That the Applicant shall be of full age, sound mind and does not have any impediment that precludes him/her from giving the information voluntarily to the Police;',
    },
    {
      id: 3,
      text: 'That the information supplied to the Nigeria Police Force by the Applicant shall be permanently retained by the Nigeria Police and that the Nigeria Police Force reserves the right to, without prejudice, share/disseminate same to individual(s), Organisations, Authorities, Corporate Bodies, Government Agencies and Governments (both Foreign and Local), etc., either upon request or as the case may be without a recourse to the Applicant;',
    },
    {
      id: 4,
      text: 'That the Nigeria Police Force is not obligated to affirm/approve the application/request under any circumstances at all, as positive response to the application/request shall be predicated on factors including but not limited to urgency of the matter, availability of manpower, national security considerations and other factors as may, from time to time, be unilaterally determined by the Nigeria Police Force.',
    },
  ];
  constructor(private _location: Location, private modal: ModalController) {}

  ngOnInit() {}

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
