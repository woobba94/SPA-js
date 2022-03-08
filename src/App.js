import CartPage from "./CartPage.js";
import ProductListPage from "./ProductListPage.js";

export default function App({ $target }) {
  const path = location.pathname;
  if (path === "/") {
    // 상품목록
    console.log("상품목록 페이지 랜더링");
    new ProductListPage({ $target }).render();
  } else if (path.includes("/product")) {
    const productId = path.split("/")[2];
    // 상품 디테일
  } else if (path === "/cart") {
    // 장바구니
    new CartPage({ $target }).render();
  }
}
