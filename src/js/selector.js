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

  selectorClickListener(e) {
    const elem = e.target;

    const currentItem = elem.closest('.selector__item');

    for (let item of this.selectorItems) {
      item.classList.remove('active');
    }

    if (currentItem) {
      currentItem.classList.add('active');
      this.cb(currentItem.dataset.value);
    }
  }
}

export default Selector;
