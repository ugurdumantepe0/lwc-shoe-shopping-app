import { LightningElement, api, wire, track } from "lwc";

// Ligthning Message Service and message channels
import { publish, subscribe, MessageContext } from "lightning/messageService";
import PRODUCTS_FILTERED_MESSAGE from "@salesforce/messageChannel/ProductsFiltered__c";
import PRODUCT_SELECTED_MESSAGE from "@salesforce/messageChannel/ProductSelected__c";

// getShoes() method in ProductController Apex class
import getShoes from "@salesforce/apex/ShoeController.getShoes";

export default class shoeList extends LightningElement {
  // @api searchBarIsVisible = false;

  // @api tilesAreDraggable = false;

  // Current page in the product list
  pageNumber = 1;

  // The number of items on a page.
  pageSize;

  // The total number of items matching the selection.
  totalItemCount = 0;

  // JSON.stringified version of filters to pass to apex
  filters = {};

  // Load context for Ligthning Messaging Service
  @wire(MessageContext) messageContext;

  // Subscription for ProductsFiltered Ligthning message
  productFilterSubscription;

  // load the products in database to the page
  @wire(getShoes, { filters: "$filters", pageNumber: "$pageNumber" })
  products;

  connectedCallback() {
    // Subscribe to ProductsFiltered message
    this.productFilterSubscription = subscribe(
      this.messageContext,
      PRODUCTS_FILTERED_MESSAGE,
      (message) => this.handleFilterChange(message)
    );
  }

  // publish an event for the selected product. Subsribe to this in cart component to add it to the cart
  handleProductAdded(event) {
    // Published ProductSelected message
    publish(this.messageContext, PRODUCT_SELECTED_MESSAGE, {
      productId: event.detail.Id,
      productName: event.detail.Name,
      productPrice: event.detail.Price__c
    });
  }

  handleSearchKeyChange(event) {
    this.filters = {
      searchKey: event.target.value.toLowerCase()
    };
    this.pageNumber = 1;
  }

  handleFilterChange(message) {
    this.filters = { ...message.filters };
    this.pageNumber = 1;
  }

  handlePreviousPage() {
    this.pageNumber = this.pageNumber - 1;
  }

  handleNextPage() {
    this.pageNumber = this.pageNumber + 1;
  }
}
