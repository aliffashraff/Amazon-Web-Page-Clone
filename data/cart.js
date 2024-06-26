export let cart;

loadfromStorage();

export function loadfromStorage() {
  cart = JSON.parse(localStorage.getItem('cart')) || [];
}

export function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId) {
  let matchingItem;

    cart.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });

    const quantity = Number(document.querySelector(`.js-quantity-selector-${productId}`).value);

    if (matchingItem) {
      matchingItem.quantity += quantity;
    }

    else {
      cart.push({
        productId,
        quantity,
        deliveryOptionId: '1'
      });
    }

  saveToStorage();
}

export function removeFromCart(productId) {
  const newCart = [];

  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });

  cart = newCart;

  saveToStorage();
}

export function calculateCartQuantity() {
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });
  return cartQuantity;
}

export function updateQuantity(productId, newQuantity) {
  let matchingItem;
  
  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  matchingItem.quantity = newQuantity;

  saveToStorage();
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  matchingItem.deliveryOptionId = deliveryOptionId;

  saveToStorage();
}

/*
export function loadCart(fun) {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener('load', () => {
    console.log(xhr.response);

    fun();
  });

  xhr.open('GET', 'https://supersimplebackend.dev/cart');
  xhr.send();
}
*/

export async function loadCartFetch() {
  const response = await fetch('https://supersimplebackend.dev/cart');

  const text = await response.text();
  console.log(text);
}

export function buyAgain(productId) {
  let matchingItem;

    cart.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });

    if (matchingItem) {
      matchingItem.quantity += 1;
    }

    else {
      cart.push({
        productId,
        quantity: 1,
        deliveryOptionId: '1'
      });
    }

  saveToStorage();
}

//update cart on the header
export function updateCartQuantity() {
  document.querySelector('.js-cart-quantity').innerHTML = calculateCartQuantity();
}