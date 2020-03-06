import { Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ConversionService {

  constructor() { }

  convertInvoice(metadataFile: any, metadatFileName: string, invoiceFile: any, invoiceFileName: string): string {

    let xml = this.convertString2XML(metadataFile);
    let metadata_identificativosdi = this.getElement("//IdentificativoSdI", xml)//is.convertString2XML();//map.get("metadata-identificativosdi");
    let invoice_64 = invoiceFile.substr( invoiceFile.indexOf(',')+1); ;
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
    let xml = this.convertString2XML(invoiceNotificationFile);
    let identificativosdi = this.getElement("//IdentificativoSdI", xml );
    let invoice_notification_64 = btoa(invoiceNotificationFile);
    let action = this.soapRootTag(invoiceNotificationFileName);
    
    let payload = `<typ:${action} xmlns:typ="http://www.fatturapa.gov.it/sdi/ws/trasmissione/v1.1/types">
      <IdentificativoSdI>${identificativosdi}</IdentificativoSdI>
      <NomeFile>${invoiceNotificationFileName}</NomeFile>
      <File>${invoice_notification_64}</File>
      </typ:${action}>`;
    return payload;

    }


  convertString2XML(string: string): any {
    var oParser = new DOMParser();
    return oParser.parseFromString(string, "application/xml");
  }



  private getElement(path: string,document: Document): string {

    let rootnode = document.getRootNode().firstChild.nodeName;
// special logic for new format
   if (rootnode == 'metadatiFattura') {
    let elements = document.getElementsByTagName('metadato');

    for (var i = 0; i < elements.length; i++) {   
   
      var valore = document.getElementsByTagName("metadato")[i].childNodes[1].textContent;
    
       if ( valore == 'idfile'){
    
        return  document.getElementsByTagName("metadato")[i].childNodes[2].nextSibling.textContent;
       }
     }   
   }
   else {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent;
   }

    
    
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
