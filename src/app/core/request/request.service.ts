import { from, of } from 'rxjs';
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  constructor(private http: HttpClient) {}

  /**
   * GET wrapper.
   *
   * @param endpoint - Full path.
   */
  get<T>(endpoint: string, options ={}): Observable<any> {

    return this.http.get<T>(endpoint, {
      headers: options
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
    const urlencoded = new URLSearchParams();
    Object.keys(data).forEach((key) => {
      urlencoded.append(key, data[key]);
    });
    const requestOptions: any = {
      method: 'POST',
      body: urlencoded,
    };
    const response = fetch(endpoint, requestOptions)
      .then((res) => res.json())
      .then((res) => res);
    return from(response);
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
}
