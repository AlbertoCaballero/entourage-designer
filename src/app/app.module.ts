import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { ViewboxComponent } from './viewbox/viewbox.component';
import { PSD } from 'psd';

const appRoutes : Routes = [
  { path: 'editor', component: ViewboxComponent},
  { path: '', redirectTo: '/editor', pathMatch: 'full'},

]

@NgModule({
  declarations: [
    AppComponent,
    ViewboxComponent
  ],
  imports: [
    PSD,
    BrowserModule,
    RouterModule.forRoot(
      appRoutes//,
      //{ enableTracing: true } // <-------- Delete, debug only
    ),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
