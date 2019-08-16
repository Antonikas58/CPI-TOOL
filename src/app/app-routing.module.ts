import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from 'src/app/pages/home-page/home-page.component';
import { UploadInvoiceComponent } from 'src/app/pages/upload-invoice/upload-invoice.component';
import { UploadInvoiceNotificationComponent } from 'src/app/pages/upload-invoice-notification/upload-invoice-notification.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  { path: 'upload-invoice', component: UploadInvoiceComponent },
  { path: 'upload-invoice-notification', component: UploadInvoiceNotificationComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
