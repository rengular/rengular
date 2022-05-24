import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RengHttpModule } from "@rengular/http";

import { AppComponent } from "./app.component";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, RengHttpModule.forRoot("http://localhost:3000/")],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
