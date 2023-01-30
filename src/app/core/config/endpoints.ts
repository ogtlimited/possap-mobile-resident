/* eslint-disable @typescript-eslint/naming-convention */
// export const serverBaseUrl = 'https://possap-api.ogtlprojects.com/api/v1';
export const serverBaseUrl = 'http://localhost:3000/api/v1';
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
  activate: baseEndpoints.user + '/verifyOtp/',
  forgotPasswordInitiate: baseEndpoints.auth + '/forgot-password/initiate',
  forgotPasswordComplete: baseEndpoints.auth + '/forgot-password/complete',
  changePassword: baseEndpoints.auth + '/change-password',
  updateProfile: baseEndpoints.auth + '/update/profile',
  updateProfileImage: baseEndpoints.auth + '/update/profile/image',
  resetPasswordOtp: baseEndpoints.auth + '/sendResetPasswordOtp',
  validate: baseEndpoints.auth + '/validateResetOTP',
};

export const serviceEndpoint = {
  serviceCharge: baseEndpoints.service + '/service-charge',
};
export const miscEndpoint = {
  mediaUpload: baseEndpoints.helper + '/uploadMedia',
  policeData: baseEndpoints + '/police-data',
  tacticalPath: baseEndpoints + '/tactical-squad',
};
