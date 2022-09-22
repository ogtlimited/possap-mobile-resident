import { PossapServicesService } from './../../core/services/possap-services/possap-services.service';
import { RequestService } from './../../core/request/request.service';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-general-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './general-form.page.html',
  styleUrls: ['./general-form.page.scss'],
})
export class GeneralFormPage implements OnInit {
  myParam: any;
  jsonFormData;
  title = '';
  constructor(
    private route: ActivatedRoute,
    private possapS: PossapServicesService,
    private reqS: RequestService,
    private cdref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      // console.log(params);

      this.myParam = params.service;
      this.title = params.title;
      if (params.type === 'restful') {
        this.possapS.fetchServicesbyId(this.myParam).subscribe((s: any) => {
          // console.log(s);
          this.jsonFormData = {
            controls: s.data.formSchema
          };
          this.cdref.detectChanges();
        });
      } else {
        this.reqS
          .get('assets/data/' + this.myParam + '.json')
          .subscribe((e: any) => {
            // console.log(e);
            this.jsonFormData = e;
            // console.log(this.jsonFormData);
            this.cdref.detectChanges();
          });
      }
      // console.log(this.myParam);
    });
  }

  submitForm(val) {
    console.log(val);
  }
}
