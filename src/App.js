import CartPage from './CartPage.js';
import ProductDetailPage from './ProductDetailPage.js';
import ProductListPage from './ProductListPage.js';
import { init } from './router.js';

export default function App({ $target }) {
  this.route = () => {
    const path = location.pathname;

    $target.innerHTML = '';
    if (path === '/') {
      // 상품목록
      new ProductListPage({ $target }).render();
    } else if (path.split('/')[1] != 'cart') {
      // 상품 디테일
      const productId = path.split('/')[1];
      new ProductDetailPage({
        $target,
        productId,
      }).render();
    } else if (path === '/cart') {
      // 장바구니
      new CartPage({ $target }).render();
    }
  };

  // 이벤트 바인딩
  // ROUTE_CHANGE 발생 시 App의 this.route 함수 호출
  init(this.route);
  this.route();

  // 뒤로가기/앞으로가기 처리
  window.addEventListener('popstate', this.route);
}
