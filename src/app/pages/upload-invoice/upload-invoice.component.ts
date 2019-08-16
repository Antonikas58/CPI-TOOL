import { Component, OnInit } from '@angular/core';
import { ValidationService } from 'src/app/services/validation.service';
import { RequestService } from 'src/app/services/request.service';
import { ConversionService } from 'src/app/services/conversion.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-upload-invoice',
  templateUrl: './upload-invoice.component.html',
  styleUrls: ['./upload-invoice.component.css']
})
export class UploadInvoiceComponent implements OnInit {

  public errorMessage: string;

  public showUpload: any;
  public showConfirm: any;
  public showStatus: any;

  public uploadStatus: any;
  public uploadMplMessageId: any;

  public metadataFiles: any;
  public metadataFileName: string;
  public invoiceFiles: any;
  public invoiceFileName: string;
  public payload: string;

  constructor(private validateService: ValidationService,
    private requestService: RequestService,
    private conversionService: ConversionService) { }

  ngOnInit() {

    this.showUpload = true;
    this.showConfirm = false;
    this.showStatus = false;

    this.requestService.loadConfiguration();

  }

  validateInput() {
    let result = this.validateService.validateInvoice(this.metadataFiles, this.invoiceFiles);
    if (result != true) {
      this.errorMessage = <string>result;
    } else {

      this.errorMessage = null;
      this.payload = this.conversionService.convertInvoice(this.metadataFiles, this.metadataFileName, this.invoiceFiles, this.invoiceFileName);

//      this.showUpload = false;
//      this.showConfirm = true;
//      this.showStatus = false;
//
      this.upload();
    }
  }

  upload() {

    let endpoint = this.requestService.getConfiguration().receiveInvoiceEndpoint;
    console.log("endpoint:"+endpoint);

    let message = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:typ="http://www.fatturapa.gov.it/sdi/ws/ricezione/v1.0/types">
       <soapenv:Header/>
       <soapenv:Body>${this.payload}</soapenv:Body>
    </soapenv:Envelope>`;
    this.requestService.sendToCPI(endpoint, message).subscribe(

    resp => {
         console.log(resp.statusText)

 //         console.log("resp");
  //        console.log(resp);
 //         console.log(resp.headers)
 //         console.log(resp.headers.get('sap_messageprocessinglogid'));
 //         console.log(resp.ok)      
 //         console.log(resp.body)

          let sap_messageprocessinglogid = resp.headers.get('sap_messageprocessinglogid');
  //        console.log(sap_messageprocessinglogid);  


          this.uploadMplMessageId = sap_messageprocessinglogid;
          this.uploadStatus = resp.statusText;


          this.showUpload = false;
          this.showConfirm = false;
          this.showStatus = true;
             

        }, 
    error => {

          console.log(error);  

          this.errorMessage = error.message;
          let sap_messageprocessinglogid = error.headers.get('sap_messageprocessinglogid');

          this.uploadMplMessageId=sap_messageprocessinglogid;
          this.uploadStatus = error.message;
          
          this.showUpload = false;
          this.showConfirm = false;
          this.showStatus = true;
        })
      }



  startAgain() {
      this.showUpload = true;
      this.showConfirm = false;
      this.showStatus = false;

      this.metadataFiles = null;
      this.metadataFileName = null;
      this.invoiceFiles = null;
      this.invoiceFileName = null;
      this.payload = null;

      this.errorMessage = null;
      this.uploadStatus = null;

  }

  detectMetadataFiles(event) {
    let files: [] = event.target.files;
    if (files) {
      for (let file of files) {
        var reader = new FileReader();
        reader.readAsText(file); // read file as data url
        this.metadataFileName = file['name'];
        reader.onload = (e) => { // called once readAsDataURL is completed
          this.metadataFiles = e.target['result'];
        }
      }
    }
  }

  detectInvoiceFiles(event) {
    let files: [] = event.target.files;
    if (files) {
      for (let file of files) {
        var reader = new FileReader();
        reader.readAsText(file); // read file as data url
        this.invoiceFileName = file['name'];
        reader.onload = (e) => { // called once readAsDataURL is completed
          this.invoiceFiles = e.target['result'];
        }
      }
    }
  }

}
