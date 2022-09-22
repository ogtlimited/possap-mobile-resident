import { baseEndpoints } from './../../config/endpoints';
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
}
