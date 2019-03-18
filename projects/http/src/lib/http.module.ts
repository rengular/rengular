import { HttpClientModule, HttpHandler } from '@angular/common/http';
import { FactoryProvider, InjectionToken, NgModule, ValueProvider } from '@angular/core';
import httpServiceProvider, { HttpService } from './http.service';

@NgModule({
  imports: [
    HttpClientModule
  ]
})
export class RengHttpModule {
  static forRoot(targetLocation: string) {
    return {
      ngModule: RengHttpModule,
      providers: [
        ...httpServiceProvider(targetLocation)
      ]
    };
  }
}
