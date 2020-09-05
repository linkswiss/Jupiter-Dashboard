import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SampleRequest } from '../../api/dashboard/model/sampleRequest';
import { AppConfigService } from '../../services/app-config/app-config.service';
import { DashboardApiService } from '../../services/dashboard-api/dashboard-api.service';
import { JupiterApiService } from '../../services/jupiter-api/jupiter-api.service';
import { UserService } from '../../services/user/user.service';
import * as _ from 'lodash';

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

  showSplitted: false;
  flipped = false;

  destinationApiMethods = [];
  hotelApiMethods = [];
  flightApiMethods = [];
  sessionAndCrypticApiMethods = [];
  trainApiMethods = [];
  utilityApiMethods = [];

  selectedMethod = null;
  getMethods = [];
  sampleRequest: SampleRequest = null;
  sampleRequestList = null;

  constructor(public appConfigService: AppConfigService, private userService: UserService, private jupiterApiService: JupiterApiService, private dashboardApiService: DashboardApiService) {

    // let methods = this.jupiterApiService.getTestMethods();

    this.getMethods = [
      this.appConfigService.config.jupiterApi.methods.utility.ping,
      this.appConfigService.config.jupiterApi.methods.utility.settings,
      this.appConfigService.config.jupiterApi.methods.utility.apiName,
    ];

    let self = this;

    _.forIn(this.appConfigService.config.jupiterApi.methods.destination, function (value, key) {
      self.destinationApiMethods.push({
        value: {
          name: 'destination-' + key,
          endpoint: value,
        },
        name: 'destination - ' + key,
      });
    });

    _.forIn(this.appConfigService.config.jupiterApi.methods.hotel, function (value, key) {
      self.hotelApiMethods.push({
        value: {
          name: 'hotel-' + key,
          endpoint: value,
        },
        name: 'hotel - ' + key,
      });
    });

    _.forIn(this.appConfigService.config.jupiterApi.methods.flight, function (value, key) {
      self.flightApiMethods.push({
        value: {
          name: 'flight-' + key,
          endpoint: value,
        },
        name: 'flight - ' + key,
      });
    });

    _.forIn(this.appConfigService.config.jupiterApi.methods.sessionAndCryptic, function (value, key) {
      self.sessionAndCrypticApiMethods.push({
        value: {
          name: 'sessionAndCryptic-' + key,
          endpoint: value,
        },
        name: 'sessionAndCryptic - ' + key,
      });
    });

    _.forIn(this.appConfigService.config.jupiterApi.methods.train, function (value, key) {
      self.trainApiMethods.push({
        value: {
          name: 'train-' + key,
          endpoint: value,
        },
        name: 'train - ' + key,
      });
    });

    _.forIn(this.appConfigService.config.jupiterApi.methods.utility, function (value, key) {
      self.utilityApiMethods.push({
        value: {
          name: 'utility-' + key,
          endpoint: value,
        },
        name: 'utility - ' + key,
      });
    });
  }

  ngOnInit(): void {
  }

  newSampleRequest(sampleType: string) {
    this.sampleRequest = {
      SampleType: sampleType,
      // Name: sampleType,
    };
  }

  private loadSamplesFromApi(sampleType: string) {
    this.sampleRequestList = null;

    this.dashboardApiService.getSampleRequests(sampleType).subscribe(response => {
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
        self.loadSamplesFromApi(self.selectedMethod.name);
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
        self.loadSamplesFromApi(self.selectedMethod.name);
      }, 200);
    }, error => {
      console.error(error);
    });
  }

  loadSamples($event) {
    this.sampleRequestList = null;

    let endpoint = $event.endpoint;
    if (_.indexOf(this.getMethods, endpoint) > -1) {
      // GET METHOD NO SAMPLE
    } else {

      let sampleType = $event.name;
      this.sampleRequest = null;
      this.loadSamplesFromApi(sampleType);
    }
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

    let endpoint = this.selectedMethod.endpoint;

    if (_.indexOf(this.getMethods, endpoint) > -1) {
      this.jupiterApiService.testApiGet(endpoint).subscribe(response => {
        console.log(response);
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
    } else {
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
