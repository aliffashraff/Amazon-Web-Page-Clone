import {cart, addToCart, updateCartQuantity} from '../data/cart.js';
import {products, loadProductsFetch} from '../data/products.js';
import {searchProduct} from './search.js';

async function loadPage() {
  await loadProductsFetch();
  renderProductsGrid();
}
loadPage();


function renderProductsGrid() {

  const url = new URL(window.location.href);
  const search = url.searchParams.get('search');

  let productsHTML = ``;
  let filterdProducts = products;
  
  // If a search exists in the URL parameters,
  // filter the products that match the search.
  if (search) {
    filterdProducts = products.filter((product) => {
      let matchingKeywords = false;

      product.keywords.forEach((keyword) => {
        if (keyword.toLowerCase().includes(search.toLowerCase())) {
          matchingKeywords = true;
        }
      });

      //if matchingKeywords true or product name (insesnitive) return the product
      return  matchingKeywords || product.name.toLowerCase().includes(search.toLowerCase());
    });
  }

  filterdProducts.forEach((product) => {
    productsHTML += `
      <div class="product-container">
        <div class="product-image-container">
          <img class="product-image"
            src="${product.image}">
        </div>

        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars"
            src="${product.getStarsUrl()}">
          <div class="product-rating-count link-primary">
            ${product.rating.count}
          </div>
        </div>

        <div class="product-price">
          ${product.getPrice()}
        </div>

        <div class="product-quantity-container">
          <select class="js-quantity-selector-${product.id}">
            <option selected value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>

        ${product.extraInfoHTML()}
      
        <div class="product-spacer"></div>

        <div class="added-to-cart js-added-to-cart-${product.id}">
          <img src="images/icons/checkmark.png">
          Added
        </div>

        <button class="add-to-cart-button button-primary js-add-to-cart"
        data-product-id="${product.id}">
          Add to Cart
        </button>
      </div>
    `;
  });

  document.querySelector('.js-products-grid').innerHTML = productsHTML;

  searchProduct();

  updateCartQuantity();

  // Use an object to save the timeout ids
  const addedMessageTimeouts = {};

  document.querySelectorAll('.js-add-to-cart')
    .forEach((button) => {
      button.addEventListener('click', () => {
        const {productId} = button.dataset;
        
        addToCart(productId);
        
        updateCartQuantity();

        const addedMessage = document.querySelector(`.js-added-to-cart-${productId}`);

        addedMessage.classList.add('added-to-cart-visible');

        setTimeout(() => {
          // Check if there's a previous timeout for this
          // product. If there is, we should stop it.
          const previousTimeoutId = addedMessageTimeouts[productId];

          if (previousTimeoutId) {
            clearTimeout(previousTimeoutId);
          }

          const timeoutId = setTimeout(() => {
            addedMessage.classList.remove('added-to-cart-visible');
          },2000);

          // Save the timeoutId for this product
          // so we can stop it later if we need to.
          addedMessageTimeouts[productId] = timeoutId;
        });
      });
    });
}