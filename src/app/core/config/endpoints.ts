import { environment } from './../../../environments/environment.prod';
/* eslint-disable @typescript-eslint/naming-convention */
// export const serverBaseUrl = 'https://possap-api.ogtlprojects.com/api/v1';
export const serverBaseUrl = 'https://possapbackend-development.ogtlprojects.com/api/v1';
//  export const serverBaseUrl = 'http://localhost:5000/api/v1';

 // export const CBSDomainUrl = 'http://pss.cbs';
export const CBSDomainUrl = 'https://possap.gov.ng';
// export const CBSDomainUrl = 'https://test.possap.ng';

export const DownloadUrl = CBSDomainUrl + '/Admin/Police/Request/Details';
export const CBSBaseUrl = CBSDomainUrl + '/api/v1/pss';


  export const baseEndpoints = {
  auth: serverBaseUrl + '/auth',
  cbsRoutes: serverBaseUrl + '/cbs-routes',
  user: serverBaseUrl + '/users',
  upload: serverBaseUrl + '/upload',
  download: serverBaseUrl + '/helper/download',
  cbsUpload: serverBaseUrl + '/cbs-routes/upload',
  nin: serverBaseUrl + '/helper/verifyNIN',
  eag: serverBaseUrl + '/eag',
  utility: CBSBaseUrl + '/utility',
  helper: serverBaseUrl + '/helper',
  requests: CBSBaseUrl + '/user-request-list/all',
  singleRequests: CBSBaseUrl + '/user-request-list/request-details',
  incidentReport: serverBaseUrl + '/incident',
  extractRequest: CBSBaseUrl + '/PSSExtract/submit-formdata',
  extractFormdata: CBSBaseUrl + '/PSSExtract/formdata',
  pccRequest: CBSBaseUrl + '/charactercertificate/submit-pcc-formdata',
  pccDiasporaRequest: CBSBaseUrl + '/diasporacharactercertificate/submit-pcc-diaspora-formdata',
  pccFormdata: CBSBaseUrl + '/charactercertificate/pcc-formdata',
};
export const authEndpoints = {
  login: CBSBaseUrl +  '/proxyauthentication/signin',
  signup: CBSBaseUrl + '/user/create-user',
  activate: CBSBaseUrl + '/user/verify-account-api',
  forgotPasswordInitiate: CBSBaseUrl + '/user/forgot-password-api',
  forgotPasswordComplete: baseEndpoints.auth + '/forgot-password/complete',
  changePassword: baseEndpoints.auth + '/change-password',
  updateProfile: baseEndpoints.auth + '/update/profile',
  updateProfileImage: baseEndpoints.auth + '/update/profile/image',
  resetPasswordOtp: CBSBaseUrl + '/user/forgot-password-api',
  validate: baseEndpoints.auth + '/validateResetOTP',
};

export const utilityEndpoint = {
  services: baseEndpoints.utility + '/get-services',
  stateLga: baseEndpoints.utility + '/get-states-lgas',
  countries: baseEndpoints.utility + '/get-countries',
  paymentRef: baseEndpoints.utility + '/get-payment-reference',
  paymentNotify: baseEndpoints.utility + '/payment-notify',
};
export const serviceEndpoint = {
  saveExtract: baseEndpoints.cbsRoutes + '/extract',
  savePCC: baseEndpoints.cbsRoutes + '/pcc',
  saveEGS: baseEndpoints.cbsRoutes + '/egs',
  fetchData: baseEndpoints.cbsRoutes + '/fetch-data',

};
export const egsEndpoint = {
  getTacticalSquad: CBSBaseUrl + '/pssescort/tactical-squads',
  submitEscortFormData: CBSBaseUrl + '/pssescort/submit-escort-formdata',
  getNextLevelCommand: CBSBaseUrl + '/pssescort/next-level-commands',
  getStateFormation: CBSBaseUrl + '/pssescort/state-formations',
  getFromData: CBSBaseUrl + '/pssescort/get-form-data',
  getPSSSubCategories: CBSDomainUrl + '/p/x/get-pss-sub-categories',
  getPSSSubSubCategories: CBSDomainUrl + '/p/x/get-pss-sub-Sub-categories',
  getEstimate: CBSDomainUrl + '/p/get-estimate',
};
export const miscEndpoint = {
  mediaUpload: baseEndpoints.helper + '/uploadMedia',
  policeData: baseEndpoints + '/police-data',
  tacticalPath: baseEndpoints + '/tactical-squad',
};
