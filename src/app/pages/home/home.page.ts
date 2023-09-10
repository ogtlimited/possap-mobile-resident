/* eslint-disable max-len */
import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ConferenceData } from 'src/app/providers/conference-data';
import { SearchComponent } from 'src/app/components/search/search.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  speakers: any[] = [];
  searchTerm;
  slideOpts = {
    initialSlide: 0,
    speed: 400,
  };
  merchantKey = 'PayzoneAPP';
  reference = 'REF-' + Math.random().toString(16).slice(2);
  amount = '500000';
  slides = [
    {
      title:
        'Welcome to the Police Specialized Automation Services (POSSAP) Portal',
      text: 'You can pay for services such as Special protection services, Guards service, Police extracts etc.',
    },
    {
      title: 'SPECIAL PROTECTION SERVICE',
      text: `This service is primarily detailed for the protection of PEPs (Politically Exposed Person's) as well as private citizens. The service is rendered by personnel of the Force's  Specialized Units, PMF, SPU and CTU.`,
    },
    {
      title: 'GUARDS SERVICE',
      text: ` Guards Services allows the public and corporations such as Banks to request for Police protection of residential property, commercial property, events, and escort. `,
    },
    {
      title: 'POLICE EXTRACT',
      text: 'A Police Extract is a document usually done for reports of lost or missing items or documents. This service allows the public as well as corporate bodies to request for a Police Extract Document.',
    },
    {
      title: 'POLICE CHARACTER CERTIFICATE',
      text: 'A Police Character Clearance is done to check whether an applicant has a criminal record. This service allows for the public to request for this document.',
    },
    {
      title: 'POLICE INVESTIGATION REPORT',
      text: `An investigation report is a document issued at the end of an investigation into a criminal case. This service allows for the public to request for this document.`,
    },
  ];
  constructor(
    public confData: ConferenceData,
    private router: Router,
    private modalController: ModalController
  ) {}

  ionViewDidEnter() {
    this.confData.getSpeakers().subscribe((speakers: any[]) => {
      console.log('speakers', speakers);
      this.speakers = speakers.slice(0, 3);
    });
  }

  ngOnInit() {}

  getBg(num) {
    return `url(assets/img/home/img${num + 1}.png)`;
  }
  submit() {
    this.router.navigate([`search/${this.searchTerm}`]);
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: SearchComponent,
      cssClass: 'fullscreen',
    });
    await modal.present();
  }
}
