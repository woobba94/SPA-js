import { request } from './api.js';
import Cart from './Cart.js';
import { routeChange } from './router.js';
import { getItem } from './storage.js';

export default function CartPage({ $target }) {
  const $page = document.createElement('div');
  $page.className = 'CartPage';
  $page.innerHTML = '<h1>장바구니</h1>';

  const cartData = getItem('products_cart', []);
  let cartComponent = null;
  this.state = {
    products: null,
  };

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  this.render = () => {
    // 비어있는 경우
    if (cartData.length) {
      $target.appendChild($page);
      if (this.state.products && !cartComponent) {
        cartComponent = new Cart({
          $target: $page,
          initialState: this.state.products,
        });
      }
    } else {
      alert('장바구니가 비었어요');
      routeChange('/');
    }
  };

  this.fetchProducts = async () => {
    const products = await Promise.all(
      cartData.map(async (cartItem) => {
        const productData = await request(`/${cartItem.productId}`);
        const selectedOption = productData.productOptions.find((option) => option.id === cartItem.optionId);

        return {
          imageUrl: productData.imageUrl,
          productName: productData.name,
          quantity: cartItem.quantity,
          productPrice: productData.price,
          optionName: selectedOption.name,
          optionPrice: selectedOption.price,
        };
      })
    );

    this.setState({ products });
  };
  this.fetchProducts();
}
