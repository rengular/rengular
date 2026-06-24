import { ModuleWithProviders, NgModule } from "@angular/core";

import { provideRengHttp } from "./http.providers";

/**
 * Backward-compatible NgModule entry point. New, standalone applications should
 * prefer {@link provideRengHttp} directly; `RengHttpModule.forRoot` is kept so
 * existing v1 consumers keep working on Angular 22.
 */
@NgModule({})
export class RengHttpModule {
  static forRoot(
    targetLocation: string
  ): ModuleWithProviders<RengHttpModule> {
    return {
      ngModule: RengHttpModule,
      providers: [provideRengHttp(targetLocation)],
    };
  }
}
