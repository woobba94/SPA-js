import { routeChange } from './router.js';
import { getItem, setItem } from './storage.js';

export default function SelectedOptions({ $target, initialState }) {
  const $component = document.createElement('div');
  $target.appendChild($component);
  this.state = initialState;
  // 총 상품가격 구하기
  this.getTotalPrice = () => {
    const { productData, selectedOptions } = this.state;
    const { price: productPrice } = productData;
    return selectedOptions.reduce((acc, option) => acc + (productPrice + option.optionPrice) * option.quantity, 0);
  };

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  this.render = () => {
    const { productData, selectedOptions = [] } = this.state;
    if (productData && selectedOptions) {
      $component.innerHTML = `
        <h3>선택된 상품</h3>
        <ul>
          ${selectedOptions
            .map(
              (selectedOption) => `
              <li>
                ${selectedOption.optionName} ${productData.price + selectedOption.optionPrice}원
                <input type="text" data-optionId='${selectedOption.optionId}' value="${selectedOption.quantity}">
              </li>
            `
            )
            .join('')}
        </ul>
        <div class="ProductDetail__totalPrice">${this.getTotalPrice()}원</div>
        <button class="OrderButton">주문하기</button>
      `;
    }
  };
  this.render();

  // 이벤트 위임을 이용하여 리스너 하나로 처리
  // 수량 변경
  $component.addEventListener('change', (e) => {
    // 이벤트가 INPUT 태그에서 발생할 경우만
    if (e.target.tagName === 'INPUT') {
      try {
        const nextQuantity = parseInt(e.target.value);
        const nextSelectedOptions = [...this.state.selectedOptions];
        // input 값이 숫자인경우만 처리
        if (typeof nextQuantity === 'number') {
          const { productData } = this.state;

          const optionId = parseInt(e.target.dataset.optionid);
          const option = productData.productOptions.find((option) => option.id === optionId);

          const selectedOptionIndex = nextSelectedOptions.findIndex((selectedOption) => selectedOption.optionId === optionId);
          // 입력값이 재고수량을 넘을 경우 입력값=재고수량
          // 3항연산자로도 가능
          if (option.stock >= nextQuantity) {
            nextSelectedOptions[selectedOptionIndex].quantity = nextQuantity;
          } else {
            nextSelectedOptions[selectedOptionIndex].quantity = option.stock;
          }

          this.setState({
            ...this.state,
            selectedOptions: nextSelectedOptions,
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  });

  // 장바구니(이벤트 위임)
  $component.addEventListener('click', (e) => {
    const { selectedOptions } = this.state;

    if (e.target.className === 'OrderButton') {
      // 기존 데이터가 있으면 사용, 없으면 defaultValue인 [] 사용
      const cartData = getItem('products_cart', []);

      // 장바구니 데이터 생성
      setItem(
        'products_cart',
        cartData.concat(
          selectedOptions.map((selectedOption) => ({
            productId: selectedOption.productId,
            optionId: selectedOption.optionId,
            quantity: selectedOption.quantity,
          }))
        )
      );
      routeChange('/cart');
    }
  });
}
