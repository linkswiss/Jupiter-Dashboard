import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { AppConfigService } from '../../services/app-config/app-config.service';
import { UserService } from '../../services/user/user.service';
import { Endpoint } from '../../services/app-config/user-settings.model';
import { FormGroupTyped } from '../../utility/form-group-typed';
import { TravelFusionFlightDetailPnrCustomData } from 'src/app/services/jupiter-api/jupiter-api-client';
import { FormControl, Validators } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'jupiter-app-preferencies',
  templateUrl: './app-preferencies.component.html',
  styleUrls: ['./app-preferencies.component.scss']
})
export class AppPreferenciesComponent implements OnInit {
  @ViewChild('defaultTpl', {static: true}) public defaultTpl: TemplateRef<any>;
  @ViewChild('deleteTpl', {static:true}) public deleteTpl: TemplateRef<any>;

  public endpoints: Endpoint[];
  public endpointForm: FormGroupTyped<Endpoint>;
  public endpointsColumns = [];

  constructor(private router: Router, public appConfigService: AppConfigService) { 
    this.endpoints = this.appConfigService.getEndpoints();

    //URL REGEX
    //const reg = 'http[s]?://(([^/:\.[:space:]]+(\.[^/:\.[:space:]]+)*)|([0-9](\.[0-9]{3})))(:[0-9]+)?((/[^?#[:space:]]+)(\?[^#[:space:]]+)?(\#.+)?)?';
    const reg = '(https?://.*)(:(\d*)\/?(.*))?';

    this.endpointForm = new FormGroupTyped<Endpoint>({
      Name: new FormControl('', [Validators.required]),
      Url: new FormControl('', [Validators.required, Validators.pattern(reg)]),
      Default: new FormControl(false)
    });
  }

  ngOnInit() {
    this.endpointsColumns = [
      {prop: 'Name', maxWidth: 120},
      {prop: 'Url', name: 'Endpoint Url'},
      {prop: 'Default', maxWidth: 100, cellTemplate: this.defaultTpl},
      {name: 'Action', maxWidth: 100, cellTemplate: this.deleteTpl}
    
      // {prop: 'Path'},
      
    ];
  }

  onSubmit(){
    console.log(this.endpointForm.value);

    let newEndpoint: Endpoint = this.endpointForm.value;

    this.appConfigService.setEndpoint(newEndpoint);

    this.endpointForm.reset();

    this.endpoints = this.appConfigService.getEndpoints();

  }

  deleteEndpoint(endpoint: Endpoint) {
    this.appConfigService.deleteEndpoint(endpoint);
    this.endpoints = this.appConfigService.getEndpoints();
  }

  setEndpointAsDefault(endpoint: Endpoint) {
    this.appConfigService.setEndpointAsDefault(endpoint);
    this.endpoints = this.appConfigService.getEndpoints();

    
  }

}
