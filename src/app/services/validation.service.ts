import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  isMetadataFile ( filecontent: any): boolean {
    
    var oParser = new DOMParser();
    let document = oParser.parseFromString(filecontent, "application/xml");

    let rootnode = document.getRootNode().firstChild.nodeName;
    rootnode = rootnode.substr( rootnode.indexOf(':')+1); 
    
   if ((rootnode == 'metadatiFattura' ) || (rootnode == 'FileMetadati')) {
      return true;
   }
   else {

    return false;
   }
  }


  validateInvoice(metadataFile: any, invoiceFile: any): string | boolean {
    if (!metadataFile || !invoiceFile) return ('Can not find equivalency for all files');
    return true;
  }


  validateInvoiceNotification(filename: any, file: any): string | boolean {
	  if (!file) return ('Choose a file before uploading!');
     
     let filename_result = this.validateInvoiceNotificationFilename(filename);
	  if (filename_result != true) {
	      return <string>filename_result;
	  }  

	  let action = this.checkAction(filename);
	  if (action != true) {
	      return <string>action;
	  } 

	return true;
  }


  isNotEmpty(str: any):  boolean {
	if(typeof str!='undefined' && str){
	   return true;
	}
	return false;
  }


  validateInvoiceNotificationFilename(filename: any): string | boolean {

	let result = filename.match( /(IT[0-9]{11})_(.*)_(\w{2})_(\d{3}).xml/ );
    //console.log("result "+result);

    if (result!=null) {

		
		if (this.isNotEmpty(result[1]) && this.isNotEmpty(result[2]) && this.isNotEmpty(result[3]) && this.isNotEmpty(result[4])) return true;
    } else {
    	console.log("wrong filename:"+filename);
    }
	
    return ('Unexpected filename of an invoice notification!');
  }


  checkAction(filename: any): string | boolean  {
       let code = this.getNotificationCode(filename);       
       let actionName = "unknown";
       switch (code) {
           case 'AT': { actionName = 'AttestazioneTrasmissioneFattura'; break; }
           case 'DT': { actionName = 'NotificaDecorrenzaTermini';  break; }
           case 'NE': { actionName = 'NotificaEsito';  break; }
           case 'MC': { actionName = 'NotificaMancataConsegna';  break; }
           case 'NS': { actionName = 'NotificaScarto';  break; }
           case 'RC': { actionName = 'RicevutaConsegna';  break; }
           default: { actionName = "unknown"; }
       }

       if (actionName == "unknown") return "Unexpected file name: "+filename;
       return true; 
   }

  getNotificationCode(filename: any): string {
    let result = filename.match( /(IT[0-9]{11})_(.*)_(\w{2})_(\d{3}).xml/ );
    let code = result[3];
    return code;
  }   




}
