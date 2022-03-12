import { request } from './api.js';
import ProductDetail from './ProductDetail.js';

export default function ProductDetailPage({ $target, productId }) {
  this.state = {
    productId,
    productData: null,
  };
  const $page = document.createElement('div');

  $page.className = 'ProductDetailPage';
  $page.innerHTML = '<h1>상품 정보</h1>';

  this.render = () => {
    $target.appendChild($page);
  };

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  this.render = () => {
    if (!this.state.productData) {
      $target.innerHTML = 'Loading...';
    } else {
      $target.innerHTML = '';
      $target.appendChild($page);
    }
  };

  this.fetchProducts = async () => {
    const { productId } = this.state;
    const productData = await request(`/${productId}`);
    this.setState({
      ...this.state,
      productData,
    });
    const productDetail = new ProductDetail({
      $target: $page,
      initialState: {
        productData: this.state.productData,
        selectedOptions: [],
      },
    });
  };
  this.fetchProducts();
}
