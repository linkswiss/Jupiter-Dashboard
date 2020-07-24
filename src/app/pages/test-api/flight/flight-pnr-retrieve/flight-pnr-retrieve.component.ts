import {Component, OnInit} from '@angular/core';
import {
  ConnectorEnvironment,
  EFlightCabin,
  EH2HConnectorCode, EH2HOperation, FlightFareGroupResult, JupiterFlightAvailabilityInput,
  JupiterFlightAvailabilityRQ,
  JupiterFlightAvailabilityRS, JupiterFlightDetailInput,
  JupiterFlightDetailRQ,
  JupiterFlightDetailRS, JupiterFlightPnrRetrieveInput,
  JupiterFlightPnrRetrieveRQ, JupiterFlightPnrRetrieveRS, SabreFlightPnrCustomData, SabreFlightRetrievePnrCustomData,
  SingleFlightAvailResult
} from '../../../../services/jupiter-api/jupiter-api-client';
import * as moment from 'moment';
import {JupiterApiService} from '../../../../services/jupiter-api/jupiter-api.service';
import {FlightStepRequestFormModel} from '../flight-search/flight-search.component';
import {AppConfigService} from '../../../../services/app-config/app-config.service';

@Component({
  selector: 'jupiter-flight-pnr-retrieve',
  templateUrl: './flight-pnr-retrieve.component.html',
  styleUrls: ['./flight-pnr-retrieve.component.scss']
})
export class FlightPnrRetrieveComponent implements OnInit {
  loading = false;

  jupiterFlightPnrRetrieveRq: JupiterFlightPnrRetrieveRQ = null;
  jupiterFlightPnrRetrieveRs: JupiterFlightPnrRetrieveRS = null;

  pnrNumber = '';

  selectedConnector: EH2HConnectorCode = EH2HConnectorCode.SABRE;
  selectedConnectorsDebug: EH2HConnectorCode[] = [];
  connectors: EH2HConnectorCode[] = null;
  connectorsEnvironment: ConnectorEnvironment[] = [];

  constructor(private jupiterApiService: JupiterApiService, public appConfigService: AppConfigService) {

  }

  ngOnInit() {
    // Get Connectors Enabled to operation
    this.connectors = this.appConfigService.getConnectorsEnabledToOperation(EH2HOperation.FLIGHT_PNR_RETRIEVE);

    this.jupiterFlightPnrRetrieveRq = new JupiterFlightPnrRetrieveRQ({
      ConnectorsEnvironment: this.connectorsEnvironment,
      Request: new JupiterFlightPnrRetrieveInput({
        ConnectorsDebug: [],
        ConnectorCode: null,
        ConnectorCustomData: null,
        PnrNumber: '',
      })
    });

    // Sample SABRE CERT
    // TRWXLH
    // CWHVAV
  }

  /**
   * Callback Changed the main Connector -> Add Custom data
   * @param connector
   */
  handleConnectorsChanged(connector: EH2HConnectorCode) {
    switch (connector) {
      case EH2HConnectorCode.SABRE:
        // this.jupiterFlightPnrRetrieveRq.Request.ConnectorCustomData = new SabreFlightRetrievePnrCustomData({
        //   PnrCustomData: new SabreFlightPnrCustomData({
        //     CustomerIdentifierDk: null,
        //     ReceivedFrom: null,
        //   }),
        // });
        break;
      case EH2HConnectorCode.AMADEUS:
        // this.jupiterFlightPnrRetrieveRq.Request.PnrNumber = '';
        break;
    }
  }

  retrievePnr() {
    this.loading = true;

    // this.jupiterFlightPnrRetrieveRq = new JupiterFlightPnrRetrieveRQ({
    //   ConnectorsEnvironment: this.connectorsEnvironment,
    //   Request: new JupiterFlightPnrRetrieveInput({
    //     PnrNumber: this.pnrNumber,
    //     ConnectorCode: this.selectedConnector,
    //     ConnectorsDebug: this.selectedConnectorsDebug
    //   })
    // });

    this.jupiterApiService.flightPnrRetrieve(this.jupiterFlightPnrRetrieveRq).subscribe(response => {
      this.jupiterFlightPnrRetrieveRs = response;

      // Prettify Debug Data
      if (response && response.ConnectorsResponseDetails && response.ConnectorsResponseDetails.length > 0) {
        for (let debug of response.ConnectorsResponseDetails) {
          if (debug.ConnectorDebugData) {
            // Format it
            debug.ConnectorDebugData.Request = this.prettifyXml(debug.ConnectorDebugData.Request);
            debug.ConnectorDebugData.Response = this.prettifyXml(debug.ConnectorDebugData.Response);
          }
        }
      }

      this.loading = false;
    }, error => {
      console.error(error);
      this.loading = false;
    });

  }

  getJson(object): string {
    return JSON.stringify(object, null, 2);
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
}
