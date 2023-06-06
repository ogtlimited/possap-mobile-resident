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

export interface IInvoiceResponseObject {
  CustomerPrimaryContactId:    number;
  CustomerId:                  number;
  Recipient:                   string;
  PayerId:                     string;
  Email:                       string;
  PhoneNumber:                 string;
  TIN:                         null;
  InvoiceTitle:                string;
  InvoiceDescription:          string;
  ExternalRefNumber:           null;
  ShowRemitta:                 boolean;
  PaymentURL:                  null;
  Description:                 null;
  Message:                     null;
  InvoiceStatus:               number;
  IsDuplicateRequestReference: boolean;
  InvoiceItemsSummaries:       InvoiceItemsSummary[];
  InvoiceNumber:               string;
  InvoicePreviewUrl:           string;
  AmountDue:                   number;
}

export interface InvoiceItemsSummary {
  RevenueHeadId:   number;
  RevenueHeadName: string;
  MDAName:         string;
  UnitAmount:      number;
  Quantity:        number;
  Status:          number;
  Id:              number;
  TotalAmount:     number;
  MDAId:           number;
}

