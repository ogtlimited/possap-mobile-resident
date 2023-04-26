import { AuthService } from 'src/app/core/services/auth/auth.service';
/* eslint-disable @typescript-eslint/naming-convention */
import { baseEndpoints, utilityEndpoint } from './../../config/endpoints';
import { Injectable } from '@angular/core';
import { RequestService } from '../../request/request.service';
import { GlobalService } from '../global/global.service';
import { environment } from 'src/environments/environment.prod';
import { Subscription } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';

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
    private authS: AuthService
  ) {
    this.subscription = this.authS.currentUser$.subscribe(
      (e) => (this.user = e)
    );
  }

  fetchServices() {
    return this.reqS.get('assets/data/services.json');
    // return this.reqS.get(baseEndpoints.service);
  }
  fetchCBSServices() {
    return this.reqS.get(utilityEndpoint.services);
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
    const fullServices = [];
    schema.forEach((e) => {
      const index = services.findIndex((s) => s.Name === e.name);
      fullServices.push({
        ...e,
        ServiceId: services[index].Id,
      });
    });
    console.log(fullServices);
    Preferences.set({ key: SERVICES, value: JSON.stringify(fullServices) });
    return fullServices;
  }

  PSSExtractProcessor(obj) {
    console.log(obj);
    const formData = new FormData();
    const body: any = {
      SelectedSubCategories: [],
      SelectedCategoriesAndSubCategories: {},
      ServiceId: 1,
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
