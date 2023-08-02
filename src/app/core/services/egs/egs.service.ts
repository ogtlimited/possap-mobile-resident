/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { RequestService } from '../../request/request.service';
import { egsEndpoint, serviceEndpoint } from '../../config/endpoints';
import { GlobalService } from '../global/global.service';
import { IGeneric } from '../../models/ResponseModel';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class EgsService {
  constructor(private reqS: RequestService, private globalS: GlobalService) {
    console.log('object');
    this.getPSSSubCategories();
  }

  getPSSSubCategories() {
    const subcat = this.globalS.computeCBSBody(
      'post',
      egsEndpoint.getPSSSubCategories,
      {},
      '',
      '',
      { categoryId: 1 }
    );
    const subsubcat = this.globalS.computeCBSBody(
      'post',
      egsEndpoint.getPSSSubSubCategories,
      {},
      '',
      '',
      { subCategoryId: 2 }
    );
    this.reqS
      .postFormData(serviceEndpoint.fetchData, subcat)
      .subscribe((e: IGeneric) =>
        this.globalS.setStorageObject('EGSSUBCATEGORY', e.data.ResponseObject)
      );
    this.reqS
      .postFormData(serviceEndpoint.fetchData, subsubcat)
      .subscribe((e: IGeneric) =>
        this.globalS.setStorageObject(
          'EGSSUBSUBCATEGORY',
          e.data.ResponseObject
        )
      );
  }
  getEstimates(obj) {
    const body = this.globalS.computeCBSBody(
      'post',
      egsEndpoint.getEstimate,
      {},
      '',
      '',
      obj
    );
    return this.reqS.postFormData(serviceEndpoint.fetchData, body);
  }
  getFormData(user) {
    const headerObj = {
      CLIENTID: environment.clientId,
      PAYERID: user.PayerId,
    };
    const hashString = `${headerObj.PAYERID}${headerObj.CLIENTID}`;
    const body = this.globalS.computeCBSBody(
      'get',
      egsEndpoint.getFromData,
      headerObj,
      'SIGNATURE',
      hashString,
      null
    );
    return this.reqS.postFormData(serviceEndpoint.fetchData, body);
  }
  getTacticalSquad(user, squadId) {
    const headerObj = {
      CLIENTID: environment.clientId,
      PAYERID: user.PayerId,
    };
    const hashString = `${squadId}${headerObj.PAYERID}${headerObj.CLIENTID}`;
    const body = this.globalS.computeCBSBody(
      'get',
      egsEndpoint.getTacticalSquad + '/' + squadId,
      headerObj,
      'SIGNATURE',
      hashString,
      null
    );
    return this.reqS.postFormData(serviceEndpoint.fetchData, body);
  }
  getNextLevelCommand(user, commandId) {
    const headerObj = {
      CLIENTID: environment.clientId,
      PAYERID: user.PayerId,
    };
    const hashString = `${commandId}${headerObj.PAYERID}${headerObj.CLIENTID}`;
    const body = this.globalS.computeCBSBody(
      'get',
      egsEndpoint.getNextLevelCommand + '/' + commandId,
      headerObj,
      'SIGNATURE',
      hashString,
      null
    );
    return this.reqS.postFormData(serviceEndpoint.fetchData, body);
  }
  getStateFormation(user, stateId, lgaId) {
    const headerObj = {
      CLIENTID: environment.clientId,
      PAYERID: user.PayerId,
    };
    const hashString = `${stateId}${lgaId}${headerObj.PAYERID}${headerObj.CLIENTID}`;
    const body = this.globalS.computeCBSBody(
      'get',
      egsEndpoint.getStateFormation + '/' + stateId + '/' + lgaId,
      headerObj,
      'SIGNATURE',
      hashString,
      null
    );
    return this.reqS.postFormData(serviceEndpoint.fetchData, body);
  }

  submitConventionalEscort(obj, user) {
    const headerObj = {
      CLIENTID: environment.clientId,
      PAYERID: user.PayerId,
      CBSUSERID: user.CBSUserId,
    };
    const hashString = `${obj.SelectedCommandType}${obj.ServiceId}${headerObj.PAYERID}${headerObj.CLIENTID}`;
    const body = this.globalS.computeCBSBody(
      'post',
      egsEndpoint.submitEscortFormData,
      headerObj,
      'SIGNATURE',
      hashString,
      obj
    );
    return this.reqS.postFormData(serviceEndpoint.saveEGS, body);
  }
}
