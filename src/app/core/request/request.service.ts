import { switchMap } from 'rxjs/operators';
import { from, of } from 'rxjs';
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { serviceEndpoint } from '../config/endpoints';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  constructor(private http: HttpClient, ) {}

  /**
   * GET wrapper.
   *
   * @param endpoint - Full path.
   */
  get<T>(endpoint: string, options = {}): Observable<any> {
    return this.http.get<T>(endpoint, {
      headers: options,
    });
  }
  downloadBlob(endpoint: string): Observable<any> {
    return this.http.get(endpoint, {
      responseType: 'blob',
    });
  }

  /**
   * DELETE wrapper.
   *
   * @param endpoint - Full path.
   */
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(endpoint);
  }

  /**
   * POST wrapper.
   *
   * @param endpoint - Full path.
   * @param data - Post data.
   */
  post<T>(endpoint: string, data: any): Observable<any> {
    return this.http.post<T>(endpoint, data);
    // const urlencoded = new URLSearchParams();
    // Object.keys(data).forEach((key) => {
    //   urlencoded.append(key, data[key]);
    // });
    // const requestOptions: any = {
    //   method: 'POST',
    //   body: urlencoded,
    // };
    // const response = fetch(endpoint, requestOptions)
    //   .then((res) => res.json())
    //   .then((res) => res);
    // return from(response);
  }
  postEncoded<T>(endpoint: string, data: any): Observable<any>  {
    const body = this.computeCBSBody(
      'post',
      endpoint,
      {},
      '',
      '',
      data
    );
    return this.http.post(serviceEndpoint.fetchData, body).pipe(switchMap((res: any) => of(res.data)));
  }

  /**
   * POST Form Data wrapper.
   *
   * @param endpoint - Full path.
   * @param data - Post data.
   */
  postFormData<T>(endpoint: string, data: any, options = {}): Observable<T> {
    //return data$;
    return this.http.post<T>(endpoint, data);
  }

  /**
   * PUT wrapper.
   *
   * @param endpoint - Full path.
   * @param data - Put data.
   */
  put<T>(endpoint: string, data: any): Observable<any> {
    const requestOptions: RequestInit = {
      method: 'PUT',
      body: data,
      redirect: 'follow',
    };
    const data$ = new Observable((observer) => {
      fetch(endpoint, requestOptions)
        .then((response) => response.json()) // or text() or blob() etc.
        .then((res) => {
          observer.next(res);
          observer.complete();
        })
        .catch((err) => observer.error(err));
    });
    return data$;
    //return this.http.put<T>(endpoint, data);
  }

  /**
   * PATCH wrapper.
   *
   * @param endpoint - Full path.
   * @param data - Patch data.
   */
  patch<T>(endpoint: string, data: any): Observable<T> {
    return this.http.patch<T>(endpoint, data);
  }

  computeCBSBody(
    method,
    url,
    headers,
    hashField = '',
    hashmessage = '',
    body = null
  ) {
    return {
      requestObject: {
        body,
        headers: {
          ...headers,
        },
        helpers: {
          method,
          url,
          hashField,
          hashmessage,
          clientSecret: environment.clientSecret,
        },
      },
    };
  }
}
