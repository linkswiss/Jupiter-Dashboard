import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppConfigService } from '../../services/app-config/app-config.service';
import { DashboardApiService } from '../../services/dashboard-api/dashboard-api.service';
import { JupiterApiService } from '../../services/jupiter-api/jupiter-api.service';
import { UserService } from '../../services/user/user.service';
import * as _ from 'lodash';
import {PublishedRoute, SampleRequest} from "../../services/dashboard-api/dashboard-api-client";
import {ConnectorEnvironment, FlightFareGroupResult} from "../../services/jupiter-api/jupiter-api-client";

@Component({
  selector: 'jupiter-test-api',
  templateUrl: './test-api.component.html',
  styleUrls: ['./test-api.component.scss'],
})
export class TestApiComponent implements OnInit {
  requestJson: string;
  responseJson: string;
  response: any;
  responseStatus: string;

  jupiterApiRoutes: PublishedRoute[];
  jupiterApiRoutesGroup: any;
  jupiterApiRoutesGroupKeys: string[];

  showSplitted: false;
  flipped = false;

  connectorEnvironment: ConnectorEnvironment[] = [];

  selectedRoute: PublishedRoute = null;
  sampleRequest: SampleRequest = null;
  sampleRequestList = null;

  constructor(public appConfigService: AppConfigService, private userService: UserService, private jupiterApiService: JupiterApiService, private dashboardApiService: DashboardApiService) {
  }

  ngOnInit(): void {
    this.dashboardApiService.getJupiterApiRoutes().subscribe(response => {
      this.jupiterApiRoutes = response;

      this.jupiterApiRoutesGroup = _.groupBy(response, function (r: PublishedRoute) {
        return r.Controller;
      });

      this.jupiterApiRoutesGroupKeys = Object.keys(this.jupiterApiRoutesGroup)

    }, error => {
      console.error(error);
    });
  }

  getGroupRoutes(key: string): PublishedRoute[]{
    let groupRoutes = this.jupiterApiRoutesGroup[key];
    return groupRoutes;
  }

  getRouteName(route: PublishedRoute): string{
    return route.Method + ' ' + route.PathTemplate.replace('jupiter-api/{version:apiVersion}/', '');
  }

  selectRoute(route: PublishedRoute){
    this.selectedRoute = route;
    if (route.Method == 'GET') {
      // GET METHOD NO SAMPLE
    } else {
      this.sampleRequest = null;
      this.loadSamplesFromApi();
    }
  }

  routeHasParams(route: PublishedRoute): boolean{
    let routePath = route.PathTemplate.replace('jupiter-api/{version:apiVersion}/', '')
    return routePath.indexOf("{") >= 0;
  }

  processConnectorsEnvironment(){
    console.log("ChangeConnectors");
    let parsed = JSON.parse(this.requestJson);
    parsed.ConnectorsEnvironment = this.connectorEnvironment;
    this.requestJson = JSON.stringify(parsed, null, 2);
  }

  generateSampleRequest() {
    this.dashboardApiService.generateSampleRequests(this.selectedRoute.RequestType).subscribe(response => {
      this.sampleRequest = response;
      this.loadSingleSampleRequest(this.sampleRequest);
    }, error => {
      console.error(error);
    });
  }

  newSampleRequest() {
    this.sampleRequest = new SampleRequest({
      RequestJson: "",
      SampleType: this.selectedRoute.RequestType
    });
  }

  private loadSamplesFromApi() {
    this.sampleRequestList = null;

    this.dashboardApiService.getSampleRequests(this.selectedRoute.RequestType).subscribe(response => {
      this.sampleRequestList = response;
    }, error => {
      console.error(error);
    });
  }

  toggleFlipped() {
    this.flipped = !this.flipped;
  }

  saveSample() {
    try {
      // Try to format JSON
      let parsed = JSON.parse(this.requestJson);
      this.sampleRequest.RequestJson = JSON.stringify(parsed, null, 2);
    } catch (e) {
      console.warn('NOT VALID JSON - Unable to Format Save it anyway');
      this.sampleRequest.RequestJson = this.requestJson;
    }

    this.dashboardApiService.saveSampleRequest(this.sampleRequest).subscribe(response => {
      this.loadSingleSampleRequest(response);
      let self = this;
      setTimeout(function () {
        // load wait 200ms to get the new results
        self.loadSamplesFromApi();
      }, 200);
    }, error => {
      console.error(error);
    });
  }

  deleteSample() {
    this.dashboardApiService.deleteSampleRequest(this.sampleRequest).subscribe(response => {
      this.sampleRequest = null;
      let self = this;
      setTimeout(function () {
        // load wait 200ms to get the new results
        self.loadSamplesFromApi();
      }, 200);
    }, error => {
      console.error(error);
    });
  }

  loadAllSamples() {
    this.sampleRequestList = null;
    this.dashboardApiService.getAllSampleRequests().subscribe(response => {
      this.sampleRequestList = response;
    }, error => {
      console.error(error);
    });
  }

  loadSingleSampleRequest(sampleRequest: SampleRequest) {
    this.sampleRequest = sampleRequest;
    try {
      // Try to format JSON
      let parsed = JSON.parse(this.sampleRequest.RequestJson);

      if (!parsed.ConnectorsEnvironment) {
        parsed.ConnectorsEnvironment = [];
        this.connectorEnvironment = parsed.ConnectorsEnvironment;
      }

      this.requestJson = JSON.stringify(parsed, null, 2);
    } catch (e) {
      console.warn('NOT VALID JSON - Unable to Format Load it anyway');
      this.requestJson = this.sampleRequest.RequestJson;
    }
  }

  prettifyXml(sourceXml): string {
    let xmlDoc = new DOMParser().parseFromString(sourceXml, 'application/xml');
    let xsltDoc = new DOMParser().parseFromString([
      // describes how we want to modify the XML - indent everything
      '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
      '  <xsl:strip-space elements="*"/>',
      '  <xsl:template match="para[content-style][not(text())]">', // change to just text() to strip space in text nodes
      '    <xsl:value-of select="normalize-space(.)"/>',
      '  </xsl:template>',
      '  <xsl:template match="node()|@*">',
      '    <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
      '  </xsl:template>',
      '  <xsl:output indent="yes"/>',
      '</xsl:stylesheet>',
    ].join('\n'), 'application/xml');

    let xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(xsltDoc);
    let resultDoc = xsltProcessor.transformToDocument(xmlDoc);
    let resultXml = new XMLSerializer().serializeToString(resultDoc);
    return resultXml;
  }

  send() {
    this.responseJson = '';
    this.response = null;
    this.responseStatus = 'success';

    let endpoint = this.selectedRoute.PathTemplate.replace('jupiter-api/{version:apiVersion}', this.appConfigService.config.jupiterApi.defaultApiUrl);

    if(this.selectedRoute.Method === 'GET'){
      this.jupiterApiService.testApiGet(endpoint).subscribe(response => {
        console.log(response);
        if (response.Status && response.Status === 'ERROR') {
          this.responseStatus = 'danger';
        } else if (response.Status && response.Status === 'WARNING') {
          this.responseStatus = 'warning';
        }
        this.responseJson = JSON.stringify(response, null, 2);
        this.response = response;

        if (this.response && this.response.ConnectorsResponseDetails && this.response.ConnectorsResponseDetails.length > 0) {
          for (let debug of this.response.ConnectorsResponseDetails) {
            if (debug.ConnectorDebugData) {
              // Format it
              debug.ConnectorDebugData.Request = this.prettifyXml(debug.ConnectorDebugData.Request);
              debug.ConnectorDebugData.Response = this.prettifyXml(debug.ConnectorDebugData.Response);
            }
          }
        }

        this.toggleFlipped();
      }, error => {
        console.error(error);
        this.responseStatus = 'danger';
        if (error.error) {
          this.responseJson = JSON.stringify(error.error, null, 2);
        } else {
          this.responseJson = JSON.stringify(error, null, 2);
        }
        this.toggleFlipped();
      });
    }else{
      this.jupiterApiService.testApiPost(endpoint, this.requestJson).subscribe(response => {
        if (response.Status === 'ERROR') {
          this.responseStatus = 'danger';
        } else if (response.Status === 'WARNING') {
          this.responseStatus = 'warning';
        }
        this.responseJson = JSON.stringify(response, null, 2);
        this.response = response;

        if (this.response && this.response.ConnectorsResponseDetails && this.response.ConnectorsResponseDetails.length > 0) {
          for (let debug of this.response.ConnectorsResponseDetails) {
            if (debug.ConnectorDebugData) {
              // Format it
              debug.ConnectorDebugData.Request = this.prettifyXml(debug.ConnectorDebugData.Request);
              debug.ConnectorDebugData.Response = this.prettifyXml(debug.ConnectorDebugData.Response);
            }
          }
        }

        this.toggleFlipped();
      }, error => {
        console.error(error);
        this.responseStatus = 'danger';
        if (error.error) {
          this.responseJson = JSON.stringify(error.error, null, 2);
        } else {
          this.responseJson = JSON.stringify(error, null, 2);
        }
        this.toggleFlipped();
      });
    }

  }

}
