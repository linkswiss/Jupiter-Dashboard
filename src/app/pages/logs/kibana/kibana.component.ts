import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AppConfigService } from '../../../services/app-config/app-config.service';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'jupiter-kibana',
  templateUrl: './kibana.component.html',
  styleUrls: ['./kibana.component.scss']
})
export class KibanaComponent implements OnInit {
  kibanaUrlIframe = undefined;

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer, public appConfigService: AppConfigService, private userService: UserService, private httpClient: HttpClient) {

  }

  ngOnInit() {

    let elasticSearchSettingsKey = this.route.snapshot.data.elasticSearchSettingsKey;

    let kibanaUrl = this.appConfigService.jupiterRemoteAppSettings.ElasticSearchSettings[elasticSearchSettingsKey];
    let sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(kibanaUrl);
    this.kibanaUrlIframe = sanitizedUrl;

    // let httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${this.userService.currentUser.ApiToken}`,
    //   }),
    // };

    // let request = {
    //   username: 'test',
    //   password: 'test123'
    // };
    //
    // this.userService.kibanaLogin().subscribe(result => {
    //   let kibanaUrl = 'https://0cea07f7490349edb133f73451e0e3ed.eu-west-1.aws.found.io:9243/app/kibana#/dashboard/8f2b1190-4b1d-11e9-b030-b1af578b8ca7?embed=true&_g=(refreshInterval%3A(pause%3A!t%2Cvalue%3A0)%2Ctime%3A(from%3Anow%2Fd%2Cmode%3Aquick%2Cto%3Anow%2Fd))';
    //   let sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(kibanaUrl);
    //   this.kibanaUrlIframe = sanitizedUrl;
    // });

    // let kibanaUrl = 'https://localhost:5001/kibana/KibanaMainDashboard';
    // let sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(kibanaUrl);
    // this.kibanaUrlIframe = sanitizedUrl;



    // this.httpClient.get<any>('https://0cea07f7490349edb133f73451e0e3ed.eu-west-1.aws.found.io:9243/_xpack/security/_authenticate').subscribe(result => {
    //     let kibanaUrl = 'https://0cea07f7490349edb133f73451e0e3ed.eu-west-1.aws.found.io:9243/app/kibana#/dashboard/8f2b1190-4b1d-11e9-b030-b1af578b8ca7?embed=true&_g=(refreshInterval%3A(pause%3A!t%2Cvalue%3A0)%2Ctime%3A(from%3Anow%2Fd%2Cmode%3Aquick%2Cto%3Anow%2Fd))';
    //     let sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(kibanaUrl);
    //     this.kibanaUrlIframe = sanitizedUrl;
    //   },
    //   error => {
    //     console.log(error);
    //   });
  }
}
