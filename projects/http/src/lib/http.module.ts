import { HttpClientModule } from "@angular/common/http";
import { ModuleWithProviders, NgModule } from "@angular/core";
import httpServiceProvider from "./http.service";

@NgModule({
  imports: [HttpClientModule],
})
export class RengHttpModule {
  static forRoot(targetLocation: string): ModuleWithProviders<RengHttpModule> {
    return {
      ngModule: RengHttpModule,
      providers: [...httpServiceProvider(targetLocation)],
    };
  }
}
