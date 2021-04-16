import { LightningElement, api } from "lwc";

export default class paging extends LightningElement {
  // current page number
  @api pageNumber;

  // The number of products on a page
  @api pageSize;

  // The total number of items in the product list.
  @api totalItemCount;

  // dipatch previous page event to parent component shoeList
  handlePrevious() {
    this.dispatchEvent(new CustomEvent("previous"));
  }

  // dipatch next page event to parent component shoeList
  handleNext() {
    this.dispatchEvent(new CustomEvent("next"));
  }

  get currentPageNumber() {
    return this.totalItemCount === 0 ? 0 : this.pageNumber;
  }

  get isFirstPage() {
    return this.pageNumber === 1;
  }

  get isLastPage() {
    return this.pageNumber >= this.totalPages;
  }

  get totalPages() {
    return Math.ceil(this.totalItemCount / this.pageSize);
  }
}
