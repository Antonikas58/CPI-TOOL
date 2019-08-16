import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule }    from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { UploadInvoiceComponent } from './pages/upload-invoice/upload-invoice.component';
import { UploadInvoiceNotificationComponent } from './pages/upload-invoice-notification/upload-invoice-notification.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    UploadInvoiceComponent,
    UploadInvoiceNotificationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
