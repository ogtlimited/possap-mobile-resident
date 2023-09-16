/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { RequestService } from '../../request/request.service';

@Injectable({
  providedIn: 'root',
})
export class CmrService {
  constructor(private reqS: RequestService) {}

  getCarMake() {
    return this.reqS.get('https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json');
  }
  getCarModel(make, year) {
    return this.reqS.get(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${make}/modelyear/${year}?format=json`);
  }
}
