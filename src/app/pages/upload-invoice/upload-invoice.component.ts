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
  public showStatus: any;
  public showCorrelate: any;
  public uploadStatus: any;
  public uploadMplMessageId: any;
  public payload: string;
  public uploadStatusArray = [];
  public selectedFiles: Array<{ InvoiceFileName: string, InvoiceFileContent: string, MetadataFileName: string, MetadataFileContent: string, Correlation: string}> = [];
  public files: [];
  public invoiceFilesArray: Array<{ name: string, content: string}> = [];
  public metadataFilesArray: Array<{ name: string, content: string}> = [];

  constructor(private validateService: ValidationService,
    private requestService: RequestService,
    private conversionService: ConversionService) { }


  ngOnInit() {

    this.showUpload = true;
    this.showStatus = false;
    this.selectedFiles = null;
    this.invoiceFilesArray = null;
    this.metadataFilesArray = null;
    this.requestService.loadConfiguration();

  }

  validateInput() {

    if (this.selectedFiles) {
      
     
      for (let file of this.selectedFiles) {  

        let result = this.validateService.validateInvoice(file.MetadataFileContent, file.InvoiceFileContent);
        if (result != true) {
    
          let status = {
            FileName: file.InvoiceFileName,
            uploadStatus: this.errorMessage,
            uploadMplMessageId: null
          };
    
          this.uploadStatusArray.push(status);
          this.errorMessage = <string>result;
    
        } else {
          
          this.errorMessage = null;
          this.payload = this.conversionService.convertInvoice(file.MetadataFileContent, file.MetadataFileName, file.InvoiceFileContent, file.InvoiceFileName);
    
          this.upload(file.InvoiceFileName);
    
        }





      }
    }


  }

  upload(FileName:string) {

    let endpoint = this.requestService.getConfiguration().receiveInvoiceEndpoint;
    console.log("endpoint:"+endpoint);

    let message = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:typ="http://www.fatturapa.gov.it/sdi/ws/ricezione/v1.0/types">
       <soapenv:Header/>
       <soapenv:Body>${this.payload}</soapenv:Body>
    </soapenv:Envelope>`;
    this.requestService.sendToCPI(endpoint, message).subscribe(

    resp => {
         console.log(resp.statusText)

          let sap_messageprocessinglogid = resp.headers.get('sap_messageprocessinglogid');
  //        console.log(sap_messageprocessinglogid); 
        let status = {
          FileName: FileName,
          uploadStatus: resp.statusText,
          uploadMplMessageId: sap_messageprocessinglogid 
        };

          this.uploadStatusArray.push(status);
          this.uploadMplMessageId = sap_messageprocessinglogid;
          this.uploadStatus = resp.statusText;
          this.showUpload = false;
          this.showStatus = true;
             

        }, 
    error => {

          console.log(error);  

          let sap_messageprocessinglogid = error.headers.get('sap_messageprocessinglogid');
          let status = {
            FileName: FileName,
            uploadStatus: error.message,
            uploadMplMessageId: sap_messageprocessinglogid
          };
  
          this.uploadStatusArray.push(status);
          this.uploadMplMessageId=sap_messageprocessinglogid;
          this.uploadStatus = error.message;
          this.showUpload = false;
          this.showStatus = true;
        })
      }



  startAgain() {
      this.showUpload = true;
      this.showStatus = false;
      this.payload = null;
      this.errorMessage = null;
      this.uploadStatus = null;
      this.uploadStatusArray = [];
      this.selectedFiles = null;
      this.invoiceFilesArray = [];
      this.metadataFilesArray = [];
  }



  detectFile(File: any) {

    if (File) {
 
      var reader = new FileReader();
      reader.readAsText(File); 
       let filename: any  = File['name'];
    
      reader.onload = (e) => { 

        let filecontent: any = e.target['result'];

        let result = this.validateService.isMetadataFile(filecontent);
        if (result != true) {


          var Invoicereader = new FileReader();
          Invoicereader.readAsDataURL(File); 
           let Invfilename: any  = File['name'];
        
           Invoicereader.onload = (e) => {
            let Invfilecontent: any = e.target['result'];
            this.invoiceFilesArray.push({name: Invfilename, content: Invfilecontent});  
            this.showCorrelate = true;
           }
          
        }
        else {
          this.metadataFilesArray.push({name: filename, content: filecontent});
        }


      }
    reader = null;
    


  }

  }

  fileEvent(event) {
    this.invoiceFilesArray = [];
    this.metadataFilesArray = [];
    this.files = event.target.files;

    for (let file of this.files) {
      this.detectFile(file);
      
    }


  }

  connectFiles() {

   this.selectedFiles = []; 

   for(let invoiceInfo of this.invoiceFilesArray) {
  
    let metadataPossibleName = invoiceInfo.name + '_metaDato.xml';
    let MetadataInfo = this.metadataFilesArray.find(item => item.name === metadataPossibleName);
    if (MetadataInfo) {
       let content = {
        InvoiceFileName: invoiceInfo.name,
        InvoiceFileContent: invoiceInfo.content,
        MetadataFileName: MetadataInfo.name,
        MetadataFileContent: MetadataInfo.content,
        Correlation: 'OK'
      };
      this.selectedFiles.push(content);
    }
    
    else {
      let content = {
        InvoiceFileName: invoiceInfo.name,
        InvoiceFileContent: invoiceInfo.content,
        MetadataFileName: 'NOT FOUND',
        MetadataFileContent: 'NOT FOUND',
        Correlation: 'ERROR'
      };
      this.selectedFiles.push(content);
    }

  
   }
      this.showCorrelate = false;
 }







}
