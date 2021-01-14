class DateInput {
  constructor(input) {
    this.input = input;
    this.init();
  }

  init() {
    this.optionsBlock = document.querySelector('.cities__date-text');

    this.optionsBlock.addEventListener('click', this.optionsBlockEventListener.bind(this));

    this.input.setAttribute('data-value', DateInput.getDateFromOption('today'));
  }

  optionsBlockEventListener(e) {
    const elem = e.target;
    const currentItem = elem.closest('.link-date');
    if (currentItem) {
      this.input.value = currentItem.textContent;
      const option = currentItem.dataset.value;
      this.input.setAttribute('data-value', DateInput.getDateFromOption(option));
    }
  }

  static formatDateNumber(number) {
    if (number < 10) {
      return `0${number}`;
    }
    return number;
  }

  static getDateFromOption(optionName) {
    const today = new Date();
    const tomorrow = new Date(today.setDate(today.getDate() + 1));

    let currentDate = '';
    if (optionName === 'today') {
      currentDate = new Date();
    } else if (optionName === 'tomorrow') {
      currentDate = tomorrow;
    } else return '';

    const month = DateInput.formatDateNumber(currentDate.getMonth() + 1);
    const day = DateInput.formatDateNumber(currentDate.getDate());
    return `${currentDate.getFullYear()}-${month}-${day}`;
  }

  getValue() {
    return this.input.dataset.value;
  }
}

export default DateInput;
