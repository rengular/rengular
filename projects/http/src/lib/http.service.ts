import { FactoryProvider, inject, Injectable, InjectionToken, ValueProvider } from '@angular/core';
import { HttpClient, HttpHandler, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export interface IRequestOptions {
  headers?: HttpHeaders;
  observe?: 'body';
  params?: HttpParams;
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
  body?: object | string | number | boolean;
}

export const SERVER_LOCATION = new InjectionToken<string>('Rengular.http.SERVER_LOCATION');

@Injectable({
  providedIn: 'root',
})
export class HttpService extends HttpClient {

  constructor( private httpHandler: HttpHandler, private targetLocation: string ) {
    super(httpHandler);
  }

  /**
   * GET request
   * @param endPoint of the api
   * @param options of the request like headers, body, etc.
   * @param api use if there is needed to send request to different back-end than the default one.
   */
  public Get<T>( endPoint: string, options?: IRequestOptions, api?: string ): Observable<T> {
    return super.get<T>(api || this.targetLocation + endPoint, options);
  }

  /**
   * POST request
   * @param endPoint of the api
   * @param params body of the request.
   * @param options of the request like headers, body, etc.
   * @param api use if there is needed to send request to different back-end than the default one.
   */
  public Post<T>( endPoint: string, params: object | string, options?: IRequestOptions, api?: string ): Observable<T> {
    return super.post<T>(api || this.targetLocation + endPoint, params, options);
  }

  /**
   * PUT request
   * @param endPoint of the api
   * @param params body of the request.
   * @param options of the request like headers, body, etc.
   * @param api use if there is needed to send request to different back-end than the default one.
   */
  public Put<T>( endPoint: string, params: object | string, options?: IRequestOptions, api?: string ): Observable<T> {
    return super.put<T>(api || this.targetLocation + endPoint, params, options);
  }

  /**
   * DELETE request
   * @param endPoint end point of the api
   * @param options of the request like headers, body, etc.
   * @param api use if there is needed to send request to different back-end than the default one.
   */
  public Delete<T>( endPoint: string, options?: IRequestOptions, api?: string ): Observable<T> {
    return super.delete<T>(api || this.targetLocation + endPoint, options);
  }

  /**
   *
   * @param confirmation window(component) that returns boolean on close.
   * @param endPoint end point of the api for removing item.
   * @param options of the request like headers, body, etc.
   * @param api use if there is needed to send request to different back-end than the default one.
   *
   * @returns Delete<T>(endpoint, options?, api?) request if user approved the action OR empty Observable if user declined the action.
   */
  public ConfirmDelete<T, U extends { afterClosed: Observable<boolean> }>(confirmation: U,
                                                                          endPoint: string,
                                                                          options?: IRequestOptions,
                                                                          api?: string ): Observable<T> {

    return confirmation.afterClosed.pipe(switchMap((value: boolean): Observable<T> => {
     if (!value) {
       // Nothing happens if user clicked cancel.
       return new Observable<T>();
     }

     return this.Delete<T>(endPoint, options, api);
   }));
  }
}

export default function httpServiceProvider( targetLocation: string ) {
  return [
    {
      provide: SERVER_LOCATION,
      useValue: targetLocation
    } as ValueProvider,
    {
      provide: HttpService,
      useFactory: ( httpHandler: HttpHandler ) => {
        return new HttpService(httpHandler, inject(SERVER_LOCATION));
      },
      deps: [ HttpHandler, SERVER_LOCATION ]
    } as FactoryProvider ];
}
