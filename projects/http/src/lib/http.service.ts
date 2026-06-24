import { inject, Injectable, InjectionToken, Injector } from "@angular/core";
import {
  HttpClient,
  HttpHandler,
  HttpHeaders,
  HttpParams,
  httpResource,
  HttpResourceOptions,
  HttpResourceRef,
} from "@angular/common/http";
import { Observable } from "rxjs";

import { buildResourceUrlFactory, RengEndpoint } from "./url";

export interface IRequestOptions {
  headers?: HttpHeaders;
  observe?: "body";
  params?: HttpParams;
  reportProgress?: boolean;
  responseType?: "json";
  withCredentials?: boolean;
  body?: object | string | number | boolean;
}

export const SERVER_LOCATION = new InjectionToken<string>(
  "Rengular.http.SERVER_LOCATION"
);

@Injectable({
  providedIn: "root",
})
export class HttpService extends HttpClient {
  private readonly targetLocation = inject(SERVER_LOCATION);
  private readonly injector = inject(Injector);

  constructor() {
    super(inject(HttpHandler));
  }

  public Get<T>(
    endPoint: string,
    options?: IRequestOptions,
    api?: string
  ): Observable<T> {
    return super.get<T>(api || this.targetLocation + endPoint, options);
  }

  public Post<T>(
    endPoint: string,
    params: object | string,
    options?: IRequestOptions,
    api?: string
  ): Observable<T> {
    return super.post<T>(
      api || this.targetLocation + endPoint,
      params,
      options
    );
  }

  public Put<T>(
    endPoint: string,
    params: object | string,
    options?: IRequestOptions,
    api?: string
  ): Observable<T> {
    return super.put<T>(api || this.targetLocation + endPoint, params, options);
  }

  public Delete<T>(
    endPoint: string,
    options?: IRequestOptions,
    api?: string
  ): Observable<T> {
    return super.delete<T>(api || this.targetLocation + endPoint, options);
  }

  public Patch<T>(
    endPoint: string,
    params: object | string,
    options?: IRequestOptions,
    api?: string
  ): Observable<T> {
    return super.patch<T>(
      api || this.targetLocation + endPoint,
      params,
      options
    );
  }

  /**
   * Create a base-URL-aware `httpResource` bound to the configured server
   * location. Unlike the free `rengHttpResource`, this may be called outside an
   * injection context because it reuses the service's own injector.
   *
   * @param endPoint endpoint relative to the server location, or a reactive function returning one.
   * @param options the standard `httpResource` options (`parse`, `defaultValue`, …).
   */
  public resource<TResult = unknown>(
    endPoint: RengEndpoint,
    options?: HttpResourceOptions<TResult, unknown>
  ): HttpResourceRef<TResult | undefined> {
    const url = buildResourceUrlFactory(this.targetLocation, endPoint);
    return httpResource<TResult>(url, { injector: this.injector, ...options });
  }
}
