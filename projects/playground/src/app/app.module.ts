import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RengHttpModule } from '@rengular/http';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RengHttpModule.forRoot('http://localhost:3000/'),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
