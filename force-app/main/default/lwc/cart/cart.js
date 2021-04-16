import { LightningElement, api, wire, track } from "lwc";

// Ligthning Message Service and message channels
import { publish, subscribe, MessageContext } from "lightning/messageService";
import PRODUCT_SELECTED_MESSAGE from "@salesforce/messageChannel/ProductSelected__c";

import { updateRecord } from "lightning/uiRecordApi";
import createOrder from "@salesforce/apex/CreateOrder.createShoeOrder";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import UserPreferencesRecordHomeSectionCollapseWTShown from "@salesforce/schema/User.UserPreferencesRecordHomeSectionCollapseWTShown";
import { refreshApex } from "@salesforce/apex";

export default class shoeList extends LightningElement {
  @track lineItems = [];
  lineItem = {};

  @track totalPrice = 0;
  @track showCart = false;

  // columsn for data table
  get columns() {
    return [
      {
        label: "",
        fieldName: "deleteIcon",
        initialWidth: 40,
        type: "button-icon",
        typeAttributes: { iconName: "utility:delete" }
      },
      {
        label: "Quantity",
        fieldName: "quantity",
        initialWidth: 95,
        editable: true,
        // typeAttributes: { editable: "true" },
        cellAttributes: { alignment: "center" }
      },
      {
        label: "Name",
        fieldName: "name",
        initialWidth: 150
      },
      {
        label: "Price",
        fieldName: "priceInCart",
        initialWidth: 115,
        type: "currency",
        typeAttributes: {
          currencyCode: "EUR",
          currencyDisplayAs: "code"
        }
      }
    ];
  }
  priceInCart;
  recordId;

  @wire(MessageContext) messageContext;

  /** Subscription for ProductSelected Ligthning message */
  productSelectionSubscription;

  connectedCallback() {
    // Subscribe to ProductSelected message
    this.productSelectionSubscription = subscribe(
      this.messageContext,
      PRODUCT_SELECTED_MESSAGE,
      (message) =>
        this.handleProductSelected(
          message.productId,
          message.productName,
          message.productPrice,
          this.priceInCart
        )
    );
  }

  // call this method once a product is selected in the tile
  handleProductSelected(productId, productName, productPrice, priceInCart) {
    console.log(
      "incoming params are : " +
        productId +
        " " +
        productName +
        " " +
        productPrice +
        " "
    );

    // increase the quantity if products already exists in cart
    this.lineItems.forEach((element) => {
      if (element.id === productId) {
        this.totalPrice += element.price;
        element.quantity += 1;
        element.priceInCart += productPrice;
        this.lineItems = [...this.lineItems];

        console.log(
          "increased quantity if the product in basket : " +
            JSON.stringify(element)
        );
      }
    });

    // add new item to the cart
    if (
      this.lineItems.every((element, index, arr) => {
        if (element.id != productId) return true;
      })
    ) {
      this.createNewLineItem(productId, productName, productPrice, priceInCart);
    }

    this.showCart = true;
    console.log("lineItems are : " + JSON.stringify(this.lineItems));
  }

  // crate a new line item in data table with a product
  createNewLineItem(productId, productName, productPrice) {
    this.lineItem = {
      id: productId,
      quantity: 1,
      name: productName,
      price: productPrice,
      priceInCart: productPrice
    };
    this.totalPrice += this.lineItem.price;
    this.lineItems.push(this.lineItem);
    this.lineItems = [...this.lineItems];
    console.log("created new line item : " + JSON.stringify(this.lineItem));
  }
  /*
  handleQuantitySave(event) {
    this.saveDraftValues = event.detail.draftValues;
    const recordInputs = this.saveDraftValues.slice().map((draft) => {
      const fields = Object.assign({}, draft);
      return { fields };
    });

    // Updateing the records using the UiRecordAPi
    const promises = recordInputs.map((recordInput) =>
      updateRecord(recordInput)
    );
    Promise.all(promises)
      .then((res) => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Success",
            message: "Records Updated Successfully!!",
            variant: "success"
          })
        );
        this.saveDraftValues = [];
        return this.refresh();
      })
      .catch((error) => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error",
            message: "An Error Occured!!",
            variant: "error"
          })
        );
      })
      .finally(() => {
        this.saveDraftValues = [];
      });
  }
  async refresh() {
    await refreshApex(this.lineItems);
  }
*/

  // decrease quantity of item or delte it entirely with the delte button
  handleDeleteProduct(event) {
    debugger;
    console.log(JSON.stringify(event.detail.row));
    try {
      for (let i = 0; i < this.lineItems.length; i++) {
        if (this.lineItems[i].id == event.detail.row.id) {
          if (this.lineItems[i].quantity == 1) {
            console.log("only 1 item is in basket deleting it");
            this.totalPrice -= this.lineItems[i].price;
            this.lineItems.splice(i, 1);

            break;
          } else if (this.lineItems[i].quantity > 1) {
            console.log(
              "multiple ones in basket for this shoe removing only 1 of it"
            );
            this.totalPrice -= this.lineItems[i].price;
            this.lineItems[i].quantity--;
            this.lineItems[i].priceInCart -= this.lineItems[i].price;
          }
        }
        this.lineItems = [...this.lineItems];
      }

      if (this.lineItems.length < 1) this.showCart = false;
      console.log(
        "line items after removing product" + JSON.stringify(this.lineItems)
      );
    } catch (err) {
      console.log(err.message);
    }
  }

  // call apex code to create order in backend
  handleCreateOrder(event) {
    console.log(JSON.stringify(this.lineItems));
    try {
      createOrder({ lineItems: JSON.stringify(this.lineItems) })
        .then((result) => {
          console.log("got result from createorder");
          // create a pop up here to hsoew order is created
          if (result == true) {
            this.dispatchEvent(
              new ShowToastEvent({
                title: "Success",
                message: "Order Created!",
                variant: "success"
              })
            );
            this.emptyCart();
          } else if (result == false) {
            this.dispatchEvent(
              new ShowToastEvent({
                title: "Error",
                message: "Failed to Crate Order",
                variant: "error"
              })
            );
          }
        })

        .catch((error) => {
          console.log(error);
        });
    } catch (err) {
      this.dispatchEvent(
        new ShowToastEvent({
          title: "Error",
          message: "Failed to Crate Order",
          variant: "error"
        })
      );
      console.log(err);
    }
  }

  // empty the cart and hide cart component once the order is created
  emptyCart() {
    this.totalPrice = 0;
    this.lineItems = [];
    this.showCart = false;
  }
}
