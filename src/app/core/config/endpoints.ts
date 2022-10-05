/* eslint-disable @typescript-eslint/naming-convention */
export const serverBaseUrl = 'http://15.188.50.178/api/api/v1';
// export const serverBaseUrl = 'https://52e9-197-210-53-235.eu.ngrok.io/api/v1';
export const GoogleMapUrl =
  'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=';
export const baseEndpoints = {
  auth: serverBaseUrl + '/auth',
  user: serverBaseUrl + '/users',
  upload: serverBaseUrl + '/upload',
  nin: serverBaseUrl + '/helper/verifyNIN',
  eag: serverBaseUrl + '/eag',
  service: serverBaseUrl + '/possap-services',
  helper: serverBaseUrl + '/helper',
  requests: serverBaseUrl + '/possap-service-fields',
};
export const authEndpoints = {
  login: baseEndpoints.auth + '/login',
  signup: baseEndpoints.auth + '/signup',
  activate: baseEndpoints.auth + '/register/activate',
  forgotPasswordInitiate: baseEndpoints.auth + '/forgot-password/initiate',
  forgotPasswordComplete: baseEndpoints.auth + '/forgot-password/complete',
  changePassword: baseEndpoints.auth + '/change-password',
  updateProfile: baseEndpoints.auth + '/update/profile',
  updateProfileImage: baseEndpoints.auth + '/update/profile/image',
};

export const miscEndpoint = {
  mediaUpload: baseEndpoints.upload + '/uploadMedia',
  policeData: baseEndpoints + '/police-data',
  tacticalPath: baseEndpoints + '/tactical-squad',
};
