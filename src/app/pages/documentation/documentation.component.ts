import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AppConfigService } from '../../services/app-config/app-config.service';

@Component({
  selector: 'jupiter-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.scss'],
})
export class DocumentationComponent implements OnInit {
  // @ViewChild('iframe', {static: true}) iframe: ElementRef;
  // @ViewChild('redoc', {static: true}) redoc: ElementRef;

  urlIframeDoc = undefined;


  constructor(private route: ActivatedRoute, private http: HttpClient, private sanitizer: DomSanitizer, private appConfigService: AppConfigService) {
    // http.get<any>('jupiter-dashboard-api/users/create-api-token/3').subscribe(result => {
    //   // this.forecasts = result;
    //   console.log(result);
    //
    //   const httpOptions = {
    //     headers: new HttpHeaders({
    //       'Content-Type': 'application/json',
    //       'Authorization': 'Bearer ' + result.apiToken,
    //     }),
    //   };
    //
    //   http.get<WeatherForecast[]>('jupiter-dashboard-api/SampleData/WeatherForecasts', httpOptions).subscribe(result2 => {
    //     console.log(result2);
    //   }, error => console.error(error));
    //
    //
    //
    //
    // }, error => console.error(error));


    // PROVA OK MA ERRORE REDOC -> DA INDAGARE
    // setTimeout(() => {
    //   const headers = new HttpHeaders().set('Content-Type', 'text/html; charset=utf-8');
    //
    //   this.http
    //       // .get('https://localhost:5001/1.0/api_docs/index.html?url=/swagger/1.0/swagger.json', {responseType: 'blob', headers: headers})
    //       .get('https://localhost:5001/1.0/api_docs', {responseType: 'blob', headers: headers})
    //       .subscribe(resultDocs => {
    //         // this.redoc = resultDocs;
    //
    //         this.iframe.nativeElement.src = URL.createObjectURL(resultDocs);
    //         // this.redocContent = this.sanitizer.bypassSecurityTrustHtml(resultDocs);
    //         // this.iframe.nativeElement.srcObject = this.sanitizer.bypassSecurityTrustHtml(resultDocs);
    //
    //       }, error => {
    //         console.error(error)
    //       });
    //
    // }, 1 * 1000);
    // // }, 61 * 1000);

  }

  ngOnInit(): void {
    let apiDocUrl = this.route.snapshot.data.apiDocUrl;
    let sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(apiDocUrl);
    this.urlIframeDoc = sanitizedUrl;

  }

}

