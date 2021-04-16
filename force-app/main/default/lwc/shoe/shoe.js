import { LightningElement, api } from "lwc";

export default class shoe extends LightningElement {
  @api draggable;

  _product;

  @api
  get product() {
    return this._product;
  }
  set product(value) {
    this._product = value;
    this.pictureUrl = value.Picture_URL__c;
    this.name = value.Name;
    this.price = value.Price__c;
    this.brand = value.Brand__c;
    this.color = value.Color__c;
    this.gender = value.Gender__c;
    this.category = value.Category__c;
  }

  // Product__c field values to display
  pictureUrl;
  name;
  price;
  brand;
  color;
  gender;
  category;

  // dispatch selected shoe event to parent component shoeList
  handleClick() {
    const selectedEvent = new CustomEvent("selected", {
      detail: this.product
    });
    // console.log("handleClick : " + JSON.stringify(this.product));
    this.dispatchEvent(selectedEvent);
  }
}
