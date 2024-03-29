import { AuthService } from 'src/app/core/services/auth/auth.service';
/* eslint-disable @typescript-eslint/naming-convention */
import {
  baseEndpoints,
  serviceEndpoint,
  utilityEndpoint,
} from './../../config/endpoints';
import { Injectable } from '@angular/core';
import { RequestService } from '../../request/request.service';
import { GlobalService } from '../global/global.service';
import { environment } from 'src/environments/environment.prod';
import { Observable, Subscription, from } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';
import { EgsService } from '../egs/egs.service';

const SERVICES = 'CBS-SERVICES';
@Injectable({
  providedIn: 'root',
})
export class PossapServicesService {
  user;
  subscription: Subscription;

  constructor(
    private reqS: RequestService,
    private globalS: GlobalService,
    private authS: AuthService,
    private egs: EgsService
  ) {
    this.subscription = this.authS.currentUser$.subscribe(
      (e) => (this.user = e)
    );
  }

  fetchServices() {
    return this.reqS.get('assets/data/services.json');
    // return this.reqS.get(baseEndpoints.service);
  }
  async fetchCoreServices() {
    const services = await Preferences.get({ key: 'CBS-CORE' });
    console.log(services);
    if (services.value && (services.value !== 'undefined')) {
      return JSON.parse(services.value);
    }else{

    }
  }
  fetchCBSServices() {
    const body = this.globalS.computeCBSBody(
      'get',
      utilityEndpoint.services,
      {},
      '',
      '',
      null
    );
    return this.reqS.postFormData(serviceEndpoint.fetchData, body);
  }
  downloadApprovedRequest(body) {
    return this.reqS.post(baseEndpoints.download, body);
  }
  postRequest(body) {
    return this.reqS.post(baseEndpoints.requests, body);
  }
  allCBS(body) {
    return this.reqS.post(baseEndpoints.cbsRoutes, body);
  }

  postIncident(body) {
    return this.reqS.post(baseEndpoints.incidentReport, body);
  }

  mapSchemaToCBSID(schema, services) {
    console.log(schema, services);
    const fullServices = [];
    schema.forEach((e) => {
      const index = services.findIndex(
        (s) => s.Name.toLowerCase() === e.name.toLowerCase()
      );
      fullServices.push({
        ...e,
        ServiceId: services[index].Id,
      });
    });
    console.log(fullServices);
    Preferences.set({ key: SERVICES, value: JSON.stringify(fullServices) });
    return fullServices;
  }

  PSSExtractProcessor(obj, id) {
    console.log(obj);
    const body: any = {
      SelectedSubCategories: [],
      SelectedCategoriesAndSubCategories: {},
      ServiceId: id,
    };
    Object.keys(obj).forEach((e) => {
      if (e === '1' || e === '2') {
        if (obj[e] !== null) {
          body.SelectedSubCategories.push(...obj[e]);
          body.SelectedCategoriesAndSubCategories[e] = obj[e];
        }
      } else {
        if (Array.isArray(obj[e])) {
          body[e] = obj[e].join(',');
        } else {
          body[e] = obj[e];
        }
      }
    });
    body.SelectedSubCategories = body.SelectedSubCategories.join(',');
    console.log(body, 'PURRE');
    const headerObj = {
      CLIENTID: environment.clientId,
      // PAYERID: 'BC-0001',
      PAYERID: this.user.PayerId,
    };
    const hashString = `${body.SelectedCommand}${body.ServiceId}${headerObj.PAYERID}${headerObj.CLIENTID}`;
    // const hashString = `${body.SelectedCommand}${body.ServiceId}${headerObj.PAYERID}${headerObj.CLIENTID}`;
    console.log(hashString);
    return this.globalS.computeCBSBody(
      'post',
      baseEndpoints.extractRequest,
      headerObj,
      'SIGNATURE',
      hashString,
      body
    );
  }
  PCCProcessor(obj, id, controls) {
    const options = controls.filter(
      (e) => e.name === 'CharacterCertificateReasonForInquiry'
    )[0].options;
    console.log(obj);
    const body: any = {
      ServiceId: id,
      ...obj,
    };

    body.ReasonForInquiryValue = options.filter(
      (o) => o.key === body.CharacterCertificateReasonForInquiry
    )[0].value;
    console.log(body, 'PURRE');
    const headerObj = {
      CLIENTID: environment.clientId,
      CBSUSERID: this.user.CBSUserId,
      PAYERID: this.user.PayerId,
    };
    const hashString = `${headerObj.PAYERID}${headerObj.CLIENTID}`;
    // const hashString = `${body.SelectedCommand}${body.ServiceId}${headerObj.PAYERID}${headerObj.CLIENTID}`;
    console.log(baseEndpoints);
    return this.globalS.computeCBSBody(
      'post',
      baseEndpoints.pccRequest,
      headerObj,
      'SIGNATURE',
      hashString,
      body
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
