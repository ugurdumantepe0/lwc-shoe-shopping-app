import { LightningElement, wire } from "lwc";
import { getPicklistValues } from "lightning/uiObjectInfoApi";

// Product schema
import CATEGORY_FIELD from "@salesforce/schema/Shoe_Product__c.Category__c";
import BRAND_FIELD from "@salesforce/schema/Shoe_Product__c.Brand__c";
import GENDER_FIELD from "@salesforce/schema/Shoe_Product__c.Gender__c";
import COLOR_FIELD from "@salesforce/schema/Shoe_Product__c.Color__c";
import WATERPROOF_FIELD from "@salesforce/schema/Shoe_Product__c.Water_Proof__c";

// Ligthning Message Service and a message channel
import { publish, MessageContext } from "lightning/messageService";
import PRODUCTS_FILTERED_MESSAGE from "@salesforce/messageChannel/ProductsFiltered__c";

// The delay used when debouncing event handlers before firing the event
const DELAY = 350;

// Displays a filter panel to search for Shoe_Product__c[].

export default class shoeFilter extends LightningElement {
  searchKey = "";
  maxPrice = 500;
  brandMaxRow = 6;

  filters = {
    searchKey: "",
    maxPrice: 500
  };

  @wire(MessageContext)
  messageContext;

  // get picklist values for the fields of Shoe_Product__c

  @wire(getPicklistValues, {
    recordTypeId: "012000000000000AAA",
    fieldApiName: CATEGORY_FIELD
  })
  categories;

  @wire(getPicklistValues, {
    recordTypeId: "012000000000000AAA",
    fieldApiName: BRAND_FIELD
  })
  brands;

  @wire(getPicklistValues, {
    recordTypeId: "012000000000000AAA",
    fieldApiName: GENDER_FIELD
  })
  genders;

  @wire(getPicklistValues, {
    recordTypeId: "012000000000000AAA",
    fieldApiName: COLOR_FIELD
  })
  colors;

  @wire(getPicklistValues, {
    recordTypeId: "012000000000000AAA",
    fieldApiName: COLOR_FIELD
  })
  colors;

  @wire(getPicklistValues, {
    recordTypeId: "012000000000000AAA",
    fieldApiName: WATERPROOF_FIELD
  })
  waterproofs;

  handleSearchKeyChange(event) {
    this.filters.searchKey = event.target.value;
    this.delayedFireFilterChangeEvent();
  }

  handleMaxPriceChange(event) {
    const maxPrice = event.target.value;
    this.filters.maxPrice = maxPrice;
    this.delayedFireFilterChangeEvent();
  }

  // change the filters according to the checkbox changes
  handleCheckboxChange(event) {
    if (!this.filters.categories) {
      // Lazy initialize filters with all values initially set
      this.filters.categories = this.categories.data.values.map(
        (item) => item.value
      );
      this.filters.brands = this.brands.data.values.map((item) => item.value);
      this.filters.colors = this.colors.data.values.map((item) => item.value);
      this.filters.genders = this.genders.data.values.map((item) => item.value);
      this.filters.waterproofs = this.waterproofs.data.values.map(
        (item) => item.value
      );
    }

    const value = event.target.dataset.value;
    const filterArray = this.filters[event.target.dataset.filter];
    if (event.target.checked) {
      if (!filterArray.includes(value)) {
        filterArray.push(value);
      }
    } else {
      this.filters[event.target.dataset.filter] = filterArray.filter(
        (item) => item !== value
      );
    }
    console.log("checkbox changed" + JSON.stringify(this.filters));
    // Published ProductsFiltered message
    publish(this.messageContext, PRODUCTS_FILTERED_MESSAGE, {
      filters: this.filters
    });
  }

  delayedFireFilterChangeEvent() {
    // Debouncing this method: Do not actually fire the event as long as this function is
    // being called within a delay of DELAY. This is to avoid a very large number of Apex
    // method calls in components listening to this event.
    window.clearTimeout(this.delayTimeout);
    this.delayTimeout = setTimeout(() => {
      // Published ProductsFiltered message
      publish(this.messageContext, PRODUCTS_FILTERED_MESSAGE, {
        filters: this.filters
      });
    }, DELAY);
  }
}
