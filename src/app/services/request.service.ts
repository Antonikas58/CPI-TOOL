import { Injectable } from '@angular/core';
import { HttpClient }    from '@angular/common/http';
import { HttpHeaders }    from '@angular/common/http';
import { HttpResponse }    from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class RequestService {

  constructor(private http: HttpClient) { }

  public configuration: any;

  public sendToCPI(endpoint:string, payload: string): Observable<HttpResponse<string>>{

  		let httpHeaders = new HttpHeaders({
             'Authorization' : 'Basic xxx='
        });  

		//return this.http.post("/cxf/ItalyReceiveInvoice", payload,
    //return this.http.get("http://localhost:3000/http/support_tool_test_endpoint", 
		return this.http.post(endpoint, payload,
		{
		//    headers: httpHeaders,
			observe: 'response',
			responseType: 'text'
		    }
		);

  }

public getConfiguration():any{
  return this.configuration;
}
  public loadConfiguration(){
    this.http.get("assets/config.js",
    {
      observe: 'body',
      responseType: 'json'
    }

    ).subscribe(
      body => {
        this.configuration = body;
      }
      )
  }

}
