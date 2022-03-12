import SelectedOptions from './SelectedOptions.js';

export default function ProductDetail({ $target, initialState }) {
  const $productDetail = document.createElement('div');
  $productDetail.className = 'ProductDetail';
  $target.appendChild($productDetail);
  this.state = initialState;
  let selectedOptions = null;
  let isInitialized = false;

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();

    if (SelectedOptions) {
      selectedOptions.setState({
        productData: this.state.productData,
        selectedOptions: this.state.selectedOptions,
      });
    }
  };

  this.render = () => {
    const { productData } = this.state;
    // 1회만 실행
    if (!isInitialized) {
      $productDetail.innerHTML = `
      <img src="${productData.imageUrl}" />
        <div class="ProductDetail__info">
          <h2>${productData.name}</h2>
          <div class="ProductDetail__price">
          ${productData.price}원~</div>
          <select>
            <option>선택하세요.</option>
            ${productData.productOptions
              .map(
                (option) => `
              <option value='${option.id}' ${option.stock ? '' : 'disabled'}>${option.stock ? '' : '(품절) '}${productData.name} ${option.name} ${option.price ? `(+${option.price}원)` : ''}</option>
            `
              )
              .join('')}
          </select >
          <div class="ProductDetail__selectedOptions"></div>
          </div>
          `;
      selectedOptions = new SelectedOptions({
        $target: $productDetail.querySelector('.ProductDetail__selectedOptions'),
        initialState: {
          productData: this.state.productData,
          selectedOptions: this.state.selectedOptions,
        },
      });

      isInitialized = true;
    }
  };

  this.render();

  // 이벤트 바인딩
  $productDetail.addEventListener('change', (e) => {
    if (e.target.tagName === 'SELECT') {
      const selectId = parseInt(e.target.value);
      const { productData, selectedOptions } = this.state;

      // 옵션데이터에서 선택한 optionId가 존재하는지 찾음
      const option = productData.productOptions.find((option) => option.id === selectId);
      const selectedOption = selectedOptions.find((selectedOption) => selectedOption.optionId === selectId);

      if (!selectedOption) {
        const nextSelectedOptions = [
          ...selectedOptions,
          {
            productId: productData.id,
            optionId: option.id,
            optionName: option.name,
            optionPrice: option.price,
            quantity: 1,
          },
        ];
        this.setState({
          ...this.state,
          selectedOptions: nextSelectedOptions,
        });
      }
    }
  });
}
