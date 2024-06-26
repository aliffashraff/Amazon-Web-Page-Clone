import {
  cart, removeFromCart, calculateCartQuantity, updateQuantity, updateDeliveryOption
} from "../../data/cart.js";
import {products, getProducts} from "../../data/products.js";
import {formatCurrency} from "../utils/money.js";
import {
  deliveryOptions, getDeliveryOption, calculateDeliveryDate
} from '../../data/deliveryOptions.js';
import {renderPaymentSummary} from "./paymentSummary.js";
import {renderCheckoutHeader} from "./checkoutHeader.js";

export function renderOrderSummary() {

  let cartSummaryHTML = '';

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    //normalizing the data to match the porductId from the cart with the id from the products
    const matchingProduct = getProducts(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const dateString = calculateDeliveryDate(deliveryOption);

    cartSummaryHTML += `
      <div class="cart-item-container js-cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name">
              ${matchingProduct.name}
            </div>
            <div class="product-price">
              ${matchingProduct.getPrice()}
            </div>
            <div class="product-quantity js-product-quantity-${matchingProduct.id}">
              <span>
                Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
              </span>
              <span class="update-quantity-link link-primary js-update-quantity-link" data-product-id="${matchingProduct.id}">
                Update
              </span>
              <input type="number" class="quantity-input js-quantity-input-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
              <span class="save-quantity-link link-primary js-save-quantity-link" data-product-id="${matchingProduct.id}">
                Save
              </span>
              <span class="delete-quantity-link link-primary js-delete-quantity-link js-delete-link-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>`;
  });

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = ''

    deliveryOptions.forEach((deliveryOption) => {
      const dateString = calculateDeliveryDate(deliveryOption);

      const priceString = deliveryOption.priceCents === 0
        ? 'FREE'
        : `$${formatCurrency(deliveryOption.priceCents)} -`;
      
      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += 
        `<div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
            <input type="radio"
              ${isChecked ? 'checked' : ''}
              class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                ${dateString}
              </div>
              <div class="delivery-option-price">
                ${priceString} - Shipping
              </div>
            </div>
          </div>`
    });
    return html;
  }

  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

  document.querySelectorAll('.js-delete-quantity-link').forEach((link) => {
    link.addEventListener('click', () => {
      const {productId} = link.dataset;
      
      removeFromCart(productId);
      
      renderCheckoutHeader();
      renderOrderSummary();
      renderPaymentSummary();
    });
  });

  renderCheckoutHeader();

  document.querySelectorAll('.js-update-quantity-link').forEach((link) => {
    link.addEventListener('click', () => {
      const {productId} = link.dataset;
      const cartItemContainer = document.querySelector(`.js-cart-item-container-${productId}`);
      
      cartItemContainer.classList.add('is-editing-quantity');

      //focus on the input quantity
      document.querySelector(`.js-quantity-input-${productId}`).focus();
    });
  });

  document.querySelectorAll('.js-save-quantity-link').forEach((link) => {
    link.addEventListener('click',() => {
      const {productId} = link.dataset;
      const cartItemContainer = document.querySelector(`.js-cart-item-container-${productId}`);

      cartItemContainer.classList.remove('is-editing-quantity');

      const quantityInput = document.querySelector(`.js-quantity-input-${productId}`).value;
      const newQuantity = Number(quantityInput);

      if (newQuantity <= 0 || newQuantity > 1000) {
        alert(`ERORR!\n\nQuantity CANNOT less than 1 and higher than 999`);
      }
      else updateQuantity(productId, newQuantity);

      renderCheckoutHeader();
      renderOrderSummary();
      renderPaymentSummary();
    });
  });

  //save using enter key
  document.querySelectorAll('.quantity-input').forEach((input) => {
    input.addEventListener('keydown',(event) => {
      if (event.key === 'Enter') {
        const {productId} = input.dataset;
        const cartItemContainer = document.querySelector(`.js-cart-item-container-${productId}`);

        cartItemContainer.classList.remove('is-editing-quantity');

        const quantityInput = document.querySelector(`.js-quantity-input-${productId}`).value;
        const newQuantity = Number(quantityInput);

        /*
        if (newQuantity > 0 && newQuantity < 1000) {
          updateQuantity(productId, newQuantity);

          document.querySelector(`.js-quantity-label-${productId}`).innerHTML = newQuantity;
        }
        else {
          alert(`ERORR!\n\nQuantity CANNOT less than 1 and higher than 999`);
        }*/ //replace with below code for MVC

        if (newQuantity <= 0 || newQuantity > 1000) {
          alert(`ERORR!\n\nQuantity CANNOT less than 1 and higher than 999`);
        }
        else updateQuantity(productId, newQuantity);

        renderCheckoutHeader();
        renderOrderSummary();
        renderPaymentSummary();
      }
    });
  });

  document.querySelectorAll('.js-delivery-option').forEach((element) => {
    element.addEventListener('click', () => {
      const {productId, deliveryOptionId} = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    })
  });
}