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
  public invoiceNotificationFile: Array<{ name: string, content: string}> = [];
  public payload: string;
  public uploadStatus: any;
  public uploadStatusArray = [];
  public uploadMplMessageId: any;
  public selectedFiles: FileList;
  public files: [];

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
    


    if (this.files) {
      
     
       for (let file of this.invoiceNotificationFile) {  




         let result = this.validateService.validateInvoiceNotification(file.name, file.content);
         if (result != true) {
           this.errorMessage = <string>result;

           let status = {
             FileName: file.name,
             uploadStatus: this.errorMessage,
             uploadMplMessageId: null
           };

           this.uploadStatusArray.push(status);
           this.showUpload = false;
           this.showConfirm = false;
           this.showStatus = true;

         } else {

           this.errorMessage = null;
           this.payload = this.conversionService.convertInvoiceNotification(file.content, file.name);


           
           this.upload(file.name);

         }
 
      }

      

    }

    }

  upload(FileName:string) {

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

               
        
        let status = {
          FileName: FileName,
          uploadStatus: resp.statusText,
          uploadMplMessageId: sap_messageprocessinglogid 
        };



          this.uploadStatusArray.push(status);

          this.showUpload = false;
          this.showConfirm = false;
          this.showStatus = true;

        }, 
    error => {
          this.errorMessage = error.message;
          console.log(error);

          let sap_messageprocessinglogid = error.headers.get('sap_messageprocessinglogid');
          
                 

      let status = {
        FileName: FileName,
        uploadStatus: error.message,
        uploadMplMessageId: sap_messageprocessinglogid
      };


          this.uploadStatusArray.push(status);
          
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


      this.errorMessage = null;
      this.uploadStatus = null;
      this.selectedFiles = null;
      this.files = null;
      this.uploadStatusArray = [];

  }




detectInvoiceNotificationFiles(File: any) {
    
    if (File) {
 
        var reader = new FileReader();
        reader.readAsText(File); 
         let filename: any  = File['name'];
        reader.onload = (e) => { 
          let filecontent: any = e.target['result'];
          this.invoiceNotificationFile.push({name: filename, content: filecontent});
        }
      reader = null;
    }

  }  


  fileEvent(event) {
   

    this.selectedFiles = event.target.files;
    this.files = event.target.files;

    for (let file of this.files) {
      this.detectInvoiceNotificationFiles(file);
    }

  }






}
