import {TagModelClass} from 'ngx-chips/core/accessor';

export default class Utils {
  static getJson(object): string {
    return JSON.stringify(object, null, 2);
  }

  static prettifyXml(sourceXml): string {
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

  static prettifyJson(sourceJson): string{
    let formatted = sourceJson;
    try {
      let testParsed = JSON.parse(sourceJson);
    } catch (e) {
      console.warn('NOT VALID JSON - Try fix Execution', e);
      let regex = /X{3,}/g;
      formatted = formatted.replace(regex, '');
    }

    try {
      // Try to format JSON
      let parsed = JSON.parse(formatted);
      formatted = JSON.stringify(parsed, null, 2);
    } catch (e) {
      console.warn('NOT VALID JSON - Unable to Format Load it anyway', e);
    }

    return formatted;
  }

  static parseInt(value): number {
    return parseInt(value, null);
  }

  static addTagInputValue(value: TagModelClass, list: any[]) {
    list.splice(list.length - 1, 1);
    list.push(value.value);
  }
}
