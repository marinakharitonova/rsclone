import DATA from './data';

class Input {
  constructor(input) {
    this.input = input;

    this.init();
  }

  init() {
    this.dropDown = this.input.nextElementSibling;
    this.resultMaxLength = 10;
    this.result = [];
    this.input.addEventListener('input', this.inputEventListener.bind(this));
    this.input.addEventListener('blur', this.blurEventListener.bind(this));
    this.input.addEventListener('focus', this.focusEventListener.bind(this));
  }

  inputEventListener() {
    this.result = this.result.length > 0 ? this.result : [];
    let value = this.input.value.toLowerCase().trim();
    for (let elem of DATA) {
      const canAddResultItem = value && elem.title.toLowerCase().startsWith(value) && result.length < this.resultMaxLength;
      if (canAddResultItem) {
        this.result.push(elem.title);
      }
    }

    this.renderDropdown(result);
  }

  focusEventListener() {

  }

  blurEventListener() {
    this.dropDown.classList.remove('active');
  }

  renderDropdown(data) {
    this.dropDown.innerHTML = '';
    this.dropDown.classList.add('active');

    for (let elem of data) {
      let template = `<li class="list__item">${elem}</li>`;
      this.dropDown.insertAdjacentHTML('beforeend', template);
    }
  }
}

export default Input;
