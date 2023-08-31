/* eslint-disable @typescript-eslint/naming-convention */
export interface IGeneric {
  data: IGenericResponse;
}
export interface IGenericResponse {
  Error: boolean;
  ErrorCode: null;
  ResponseObject: any;
}
export interface AxiosResponse {
  data: ServiceResponse;
}
export interface ServiceResponse {
  Error: boolean;
  ErrorCode: null;
  ResponseObject: ResponseObject;
}

export interface ResponseObject {
  services: IService[];
}

export interface IService {
  ServiceNameModified: string;
  Name: string;
  Id: number;
  ServiceType: number;
}

export interface IInvoiceResponseObject {
  CustomerPrimaryContactId: number;
  CustomerId: number;
  Recipient: string;
  PayerId: string;
  Email: string;
  PhoneNumber: string;
  TIN: null;
  InvoiceTitle: string;
  InvoiceDescription: string;
  ExternalRefNumber: null;
  ShowRemitta: boolean;
  PaymentURL: null;
  Description: null;
  Message: null;
  InvoiceStatus: number;
  IsDuplicateRequestReference: boolean;
  InvoiceItemsSummaries: InvoiceItemsSummary[];
  InvoiceNumber: string;
  InvoicePreviewUrl: string;
  AmountDue: number;
}

export interface InvoiceItemsSummary {
  RevenueHeadId: number;
  RevenueHeadName: string;
  MDAName: string;
  UnitAmount: number;
  Quantity: number;
  Status: number;
  Id: number;
  TotalAmount: number;
  MDAId: number;
}

export interface IEGSFormData {
  StartDate: any;
  EndDate: any;
  NumberOfOfficers: number;
  PSBillingType: number;
  PSBillingTypeDurationNumber: number;
  Address: any;
  FileRefNumber: any;
  Status: number;
  ParsedStartDate: string;
  ParsedEndDate: string;
  FormErrorNumber: number;
  DurationNumber: number;
  DurationType: number;
  SelectedReason: number;
  Reasons: Reason[];
  OfficersHasBeenAssigned: boolean;
  ProposedOfficers: any;
  SubCategoryId: number;
  SubSubCategoryId: number;
  ApprovalNumber: any;
  EscortServiceCategories: EscortServiceCategory[];
  EscortCategoryTypes: any;
  SelectedEscortServiceCategories: any;
  SelectedOriginState: number;
  OriginStateName: any;
  SelectedOriginLGA: number;
  OriginLGAName: any;
  OriginLGAs: any;
  AddressOfOriginLocation: any;
  ShowExtraFieldsForServiceCategoryType: boolean;
  TaxEntitySubSubCategoryName: any;
  ServiceCategoryName: any;
  ServiceCategoryTypeName: any;
  CommandTypes: CommandType[];
  SelectedCommandType: number;
  SelectedCommandTypeName: any;
  TacticalSquads: any;
  SelectedTacticalSquad: number;
  Formations: any;
  SelectedFormationName: any;
  ViewedTermsAndConditionsModal: boolean;
  Caveat: any;
  ServiceId: number;
  HeaderObj: any;
  HasMessage: boolean;
  Reason: any;
  FlashObj: any;
  StateLGAs: any;
  ListLGAs: any;
  SelectedState: number;
  SelectedStateLGA: number;
  SelectedCommand: number;
  LGAName: any;
  StateName: any;
  CommandName: any;
  CommandAddress: any;
  CommandStateName: any;
  CommandLgaName: any;
  ExpectedHash: any;
  SiteName: any;
  InvoiceDescription: any;
  DontValidateFormControls: boolean;
  ServiceName: any;
  ServiceNote: any;
  AlternativeContactName: any;
  AlternativeContactPhoneNumber: any;
  AlternativeContactEmail: any;
  HasDifferentialWorkFlow: boolean;
}

export interface Reason {
  Id: number;
  Name: string;
}

export interface EscortServiceCategory {
  Id: number;
  ParentId: number;
  Name: string;
  ParentName: any;
  MinimumRequiredOfficers: number;
  ShowExtraFields: boolean;
}

export interface CommandType {
  Id: number;
  Name: string;
}
