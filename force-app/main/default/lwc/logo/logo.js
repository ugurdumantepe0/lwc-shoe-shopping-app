import { LightningElement, api } from "lwc";

import COMPANYIMAGES from "@salesforce/resourceUrl/lightningSteps";

// instead of giving static url the image acan be called as a static resource here
export default class logo extends LightningElement {
  @api message;

  /** Url for bike logo. */
  logoUrl = `${COMPANYIMAGES}/logo.jpg`;
}
