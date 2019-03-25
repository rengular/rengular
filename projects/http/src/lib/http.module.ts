import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import httpServiceProvider from './http.service';

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
