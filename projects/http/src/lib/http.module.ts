import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { Observable } from 'rxjs';
import httpServiceProvider from './http.service';

@NgModule({
  imports: [
    HttpClientModule
  ]
})
export class RengHttpModule {
  /**
   * Provides module with HttpService and server location Injection token.
   *
   * @param targetLocation is the API DNS/IP address
   * @param confirmModalGenerator a function which creates a modal window and shows it on the screen
   */
  static forRoot<T extends { afterClosed: Observable<boolean> }>(targetLocation: string,
                                                                 confirmModalGenerator: (entity: object  |
                                                                                                 number  |
                                                                                                 string  |
                                                                                                 boolean |
                                                                                                 undefined) => T ) {
    return {
      ngModule: RengHttpModule,
      providers: [
        ...httpServiceProvider(targetLocation)
      ]
    } as NgModule;
  }
}
