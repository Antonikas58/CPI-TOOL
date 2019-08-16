import { Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class ConversionService {

  constructor() { }

  convertInvoice(metadataFile: any, metadatFileName: string, invoiceFile: any, invoiceFileName: string): string {
    let metadata_identificativosdi = this.getElementByXpath("//IdentificativoSdI", this.convertString2XML(metadataFile))//is.convertString2XML();//map.get("metadata-identificativosdi");
    let invoice_64 = btoa(invoiceFile);
    let metadata_64: string = btoa(metadataFile);

    let payload = `<typ:fileSdIConMetadati xmlns:typ="http://www.fatturapa.gov.it/sdi/ws/trasmissione/v1.1/types">
      <IdentificativoSdI>${metadata_identificativosdi}</IdentificativoSdI>
      <NomeFile>${invoiceFileName}</NomeFile>
      <File>${invoice_64}</File>
      <NomeFileMetadati>${metadatFileName}</NomeFileMetadati>
      <Metadati>${metadata_64}</Metadati>
      </typ:fileSdIConMetadati>`;
    return payload;
  }

convertInvoiceNotification(invoiceNotificationFile: any, invoiceNotificationFileName: string): string {

    let identificativosdi = this.getElementByXpath("//IdentificativoSdI", this.convertString2XML(invoiceNotificationFile));
    let invoice_notification_64 = btoa(invoiceNotificationFile);
    let action = this.soapRootTag(invoiceNotificationFileName);
    
    let payload = `<typ:${action} xmlns:typ="http://www.fatturapa.gov.it/sdi/ws/trasmissione/v1.1/types">
      <IdentificativoSdI>${identificativosdi}</IdentificativoSdI>
      <NomeFile>${invoiceNotificationFileName}</NomeFile>
      <File>${invoice_notification_64}</File>
      </typ:${action}>`;
    return payload;

    }
  /*  

            def String body = message.getBody(String.class);
            String file64 = new String(Base64.encodeBase64(body.getBytes('UTF-8')));
        
            def map = message.getProperties();
            
            def root = map.get("root");
            def file_identificativosdi = map.get("file-identificativosdi");
            def file_nomefile = map.get("file-nomefile");
            
        
            
          def payload = """<typ:${root} xmlns:typ="http://www.fatturapa.gov.it/sdi/ws/trasmissione/v1.1/types">
            <IdentificativoSdI>${file_identificativosdi}</IdentificativoSdI>
            <NomeFile>${file_nomefile}</NomeFile>
            <File>${file64}</File>
        </typ:${root}>""";




    //let metadata_identificativosdi = this.getElementByXpath("//IdentificativoSdI", this.convertString2XML(metadataFile))//is.convertString2XML();//map.get("metadata-identificativosdi");

    let identificativosdi = "?";
    let invoice_notification_64 = btoa(invoiceNotificationFile);
    
    let payload = `<typxxx:fileSdIConMetadati xmlns:typ="http://www.fatturapa.gov.it/sdi/ws/trasmissione/v1.1/types">
      <IdentificativoSdI>${identificativosdi}</IdentificativoSdI>
      <NomeFile>${invoiceNotificationFileName}</NomeFile>
      <File>${invoice_notification_64}</File>
      </typ:fileSdIConMetadati>`;
    return payload;
  }
*/

  convertString2XML(string: string): any {
    var oParser = new DOMParser();
    return oParser.parseFromString(string, "application/xml");
  }

  private getElementByXpath(path: string, document: Document): string {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent;
  }

  getNotificationCode(filename: any): string {
    let result = filename.match( /(IT[0-9]{11})_(.*)_(\w{2})_(\d{3}).xml/ );
    let code = result[3];
    return code;
  }

   soapRootTag(filename: any): string { 
      let code = this.getNotificationCode(filename);       
       let actionName = "unknown";
       switch (code) {
           case 'AT': { actionName = 'attestazioneTrasmissioneFattura'; break; }
           case 'DT': { actionName = 'notificaDecorrenzaTermini';  break; }
           case 'NE': { actionName = 'notificaEsito';  break; }
           case 'MC': { actionName = 'notificaMancataConsegna';  break; }
           case 'NS': { actionName = 'notificaScarto';  break; }
           case 'RC': { actionName = 'ricevutaConsegna';  break; }
           default: { actionName = "error"; }
       }
       return actionName; 
}





}
