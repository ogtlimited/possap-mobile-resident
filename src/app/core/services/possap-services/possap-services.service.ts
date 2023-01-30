import { baseEndpoints, serviceEndpoint } from './../../config/endpoints';
import { Injectable } from '@angular/core';
import { RequestService } from '../../request/request.service';
import { GlobalService } from '../global/global.service';

@Injectable({
  providedIn: 'root'
})
export class PossapServicesService {

  constructor(private reqS: RequestService, private globalS: GlobalService) {

  }

  fetchServices(){
    return this.reqS.get(baseEndpoints.service);
  }
  fetchServicesbyId(id){
    return this.reqS.get(baseEndpoints.service + '/' + id);
  }
  postRequest(body){
    return this.reqS.post(baseEndpoints.requests, body);
  }
  getServiceCharge(id){
    return this.reqS.get(serviceEndpoint.serviceCharge + '/' + id);
  }
  postIncident(body){
    return this.reqS.post(baseEndpoints.incidentReport, body);
  }
}
