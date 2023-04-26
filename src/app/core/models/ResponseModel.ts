/* eslint-disable @typescript-eslint/naming-convention */
export interface ServiceResponse {
  Error: boolean;
  ErrorCode: null;
  ResponseObject: ResponseObject;
}

export interface ResponseObject {
  services: IService[];
}

export interface IService {
  Name: string;
  Id: number;
  ServiceType: number;
}
