import { createElement } from "lwc";
import logo from "c/logo";

describe("c-logo", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("sets img url to be bike_assets resource", () => {
    const element = createElement("c-logo", {
      is: logo
    });
    document.body.appendChild(element);
    const img = element.shadowRoot.querySelector("img");
    // By default @salesforce/sfdx-lwc-jest resolves the
    // @salesforce/resourceUrl/bike_assets import to "bike_assets"
    expect(img.src).toMatch(/\/lightningSteps\//);
  });

  it("is accessible", () => {
    const element = createElement("c-logo", {
      is: logo
    });

    document.body.appendChild(element);

    return Promise.resolve().then(() => expect(element).toBeAccessible());
  });
});
