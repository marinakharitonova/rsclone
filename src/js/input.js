import DATA from './data';
import DICTIONARY from './dictionaryData';

class Input {
  constructor(input, lang) {
    this.input = input;
    this.lang = lang;

    this.init();
  }

  init() {
    this.dropDown = this.input.nextElementSibling;
    this.resultMaxLength = 10;
    this.result = [];
    this.setPlaceholder();
    this.input.addEventListener('input', this.inputEventListener.bind(this));
    this.input.addEventListener('focus', this.focusEventListener.bind(this));
    this.dropDown.addEventListener('click', this.dropdownEventListener.bind(this));
    this.setPlaceholder(this.lang);
  }

  setPlaceholder(lang) {
    const elem = DICTIONARY.find(item => item.key === this.input.dataset.placeholder);
    if (elem) {
      const placeholder = lang === 'RU' ? elem.langRu : elem.langUa;
      this.input.setAttribute('placeholder', placeholder);
    }
  }

  dropdownEventListener(e) {
    let elem = e.target;
    let currentItem = elem.closest('.list__item');

    if (currentItem) {
      let cityArr = currentItem.textContent.split(',');
      this.input.value = cityArr[0];
      this.input.setAttribute('data-code', currentItem.dataset.code);
      this.dropDown.classList.remove('active');
    }
  }

  inputEventListener() {
    let result = [];
    let value = this.input.value.toLowerCase().trim();
    if (!value) this.setData();
    for (let elem of DATA) {
      // eslint-disable-next-line max-len
      const setting = this.lang === 'RU' ? 'title' : 'titleUA';
      const canAddResultItem = value
        && elem[setting].toLowerCase().startsWith(value)
        && result.length < this.resultMaxLength;
      if (canAddResultItem) {
        result.push({ title: elem[setting], code: elem.code });
      }
    }
    this.result = result;
    this.renderDropdown(result);
  }

  focusEventListener() {
    this.input.classList.add('active');
    let value = this.input.value.trim();
    if (value) {
      this.renderDropdown(this.result);
    }
  }

  blurEventListener() {
    this.input.classList.remove('active');
    this.dropDown.classList.remove('active');
  }

  renderDropdown(data) {
    this.dropDown.innerHTML = '';
    this.dropDown.classList.add('active');

    for (let elem of data) {
      let template = `<li class="list__item" data-code="${elem.code}">${elem.title}</li>`;
      this.dropDown.insertAdjacentHTML('beforeend', template);
    }
  }

  getData() {
    return { value: this.input.value, code: this.input.dataset.code, result: this.result };
  }

  setData(options = {}) {
    let { value = '', result = [], code = '' } = options;
    this.result = result;
    this.input.value = value;
    this.input.setAttribute('data-code', code);
  }

  getValue() {
    return this.input.dataset.code;
  }

  getName() {
    return this.input.value;
  }
}

export default Input;
