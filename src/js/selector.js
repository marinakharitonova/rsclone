class Selector {
  constructor(cb) {
    this.cb = cb;
    this.init();
  }

  init() {
    this.container = document.querySelector('.selector');
    this.selectorItems = document.querySelectorAll('.selector__item');

    this.container.addEventListener('click', this.selectorClickListener.bind(this));
  }

  setActiveTab(attr) {
    for (let item of this.selectorItems) {
      item.classList.remove('active');
    }
    let elem = this.container.querySelector(`.selector__item[data-value=${attr}]`);
    elem.classList.add('active');
  }

  selectorClickListener(e) {
    const elem = e.target;

    const currentItem = elem.closest('.selector__item');

    if (currentItem) {
      this.cb(currentItem.dataset.value);
    }
  }
}

export default Selector;
