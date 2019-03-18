import { FactoryProvider, inject, Inject, Injectable, InjectionToken, ValueProvider } from '@angular/core';
import { HttpClient, HttpHandler, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TargetLocator } from 'selenium-webdriver';

export interface IRequestOptions {
  headers?: HttpHeaders;
  observe?: 'body';
  params?: HttpParams;
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
  body?: object | string | number | boolean;
}

@Injectable({
  providedIn: 'root',
})
export class HttpService extends HttpClient {

  constructor( private httpHandler: HttpHandler, @Inject('') private targetLocation: string ) {
    super(httpHandler);
  }

  /**
   * GET request
   * @param endPoint it doesn't need / in front of the end point
   * @param options options of the request like headers, body, etc.
   * @param api use if there is needed to send request to different back-end than the default one.
   */
  public Get<T>( endPoint: string, options?: IRequestOptions, api?: string ): Observable<T> {
    return super.get<T>(api || this.targetLocation + endPoint, options);
  }

  /**
   * POST request
   * @param endPoint end point of the api
   * @param params body of the request.
   * @param options options of the request like headers, body, etc.
   * @param api use if there is needed to send request to different back-end than the default one.
   */
  public Post<T>( endPoint: string, params: object | string, options?: IRequestOptions, api?: string ): Observable<T> {
    return super.post<T>(api || this.targetLocation + endPoint, params, options);
  }

  /**
   * PUT request
   * @param endPoint end point of the api
   * @param params body of the request.
   * @param options options of the request like headers, body, etc.
   * @param api use if there is needed to send request to different back-end than the default one.
   */
  public Put<T>( endPoint: string, params: object | string, options?: IRequestOptions, api?: string ): Observable<T> {
    return super.put<T>(api || this.targetLocation + endPoint, params, options);
  }

  /**
   * DELETE request
   * @param endPoint end point of the api
   * @param options options of the request like headers, body, etc.
   * @param api use if there is needed to send request to different back-end than the default one.
   */
  public Delete<T>( endPoint: string, options?: IRequestOptions, api?: string ): Observable<T> {
    return super.delete<T>(api || this.targetLocation + endPoint, options);
  }
}

export default function httpServiceProvider( targetLocation: string ) {
  const TargetLocation: InjectionToken<string> = new InjectionToken<string>('TargetLocation');
  return [
    {
      provide: TargetLocation,
      useValue: targetLocation
    } as ValueProvider,
    {
      provide: HttpService,
      useFactory: ( httpHandler: HttpHandler ) => {
        return new HttpService(httpHandler, inject(TargetLocation));
      },
      deps: [ HttpHandler, TargetLocation ]
    } as FactoryProvider ];
}
