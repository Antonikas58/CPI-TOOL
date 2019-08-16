import { Component, OnInit } from '@angular/core';
import { ValidationService } from 'src/app/services/validation.service';
import { RequestService } from 'src/app/services/request.service';
import { ConversionService } from 'src/app/services/conversion.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-upload-invoice-notification',
  templateUrl: './upload-invoice-notification.component.html',
  styleUrls: ['./upload-invoice-notification.component.css']
})
export class UploadInvoiceNotificationComponent implements OnInit {

  public errorMessage: string;

  public showUpload: any;
  public showConfirm: any;
  public showStatus: any;

  public invoiceNotificationFile: any;
  public invoiceNotificationFileName: string;
  public payload: string;

  public uploadStatus: any;
  public uploadMplMessageId: any;


  constructor(private validateService: ValidationService,
    private requestService: RequestService,
    private conversionService: ConversionService) { }


  ngOnInit() {

    this.showUpload = true;
    this.showStatus = false;
    this.showConfirm = false;
    this.requestService.loadConfiguration();

  }

  validateInput() {
    let result = this.validateService.validateInvoiceNotification(this.invoiceNotificationFileName, this.invoiceNotificationFile );
    if (result != true) {
      this.errorMessage = <string>result;
    } else {

      this.errorMessage = null;
      this.payload = this.conversionService.convertInvoiceNotification(this.invoiceNotificationFile, this.invoiceNotificationFileName);

     //this.showUpload = false;
     // this.showConfirm = true;
     // this.showStatus = false;

      this.upload();

    }
  }

  upload() {

    let endpoint = this.requestService.getConfiguration().receiveNotificationEndpoint;
    console.log("endpoint:"+endpoint);

    let message = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:typ="http://www.fatturapa.gov.it/sdi/ws/ricezione/v1.0/types">
       <soapenv:Header/>
       <soapenv:Body>${this.payload}</soapenv:Body>
    </soapenv:Envelope>`;
    this.requestService.sendToCPI(endpoint, message).subscribe(

    resp => {
         console.log(resp.statusText)

          let sap_messageprocessinglogid = resp.headers.get('sap_messageprocessinglogid');

          this.uploadMplMessageId=sap_messageprocessinglogid;
          this.uploadStatus = resp.statusText;

          this.showUpload = false;
          this.showConfirm = false;
          this.showStatus = true;

        }, 
    error => {
          this.errorMessage = error.message;
          console.log(error);

          let sap_messageprocessinglogid = error.headers.get('sap_messageprocessinglogid');
          
          this.uploadMplMessageId=sap_messageprocessinglogid;
          this.uploadStatus = error.message;

          this.payload = null;
          
          this.showUpload = false;
          this.showConfirm = false;
          this.showStatus = true;


        })
      }



  startAgain() {
      this.showUpload = true;
      this.showConfirm = false;
      this.showStatus = false;

      this.invoiceNotificationFile = null;
      this.invoiceNotificationFileName = null;

      this.errorMessage = null;
      this.uploadStatus = null;

  }




  detectInvoiceNotificationFiles(event) {
    let files: [] = event.target.files;
    if (files) {
      for (let file of files) {
        var reader = new FileReader();
        reader.readAsText(file); // read file as data url
        this.invoiceNotificationFileName = file['name'];
        reader.onload = (e) => { // called once readAsDataURL is completed
          this.invoiceNotificationFile = e.target['result'];
        }
      }
    }
  }  


}
