import datepicker from 'js-datepicker';

class DateInput {
  constructor(input) {
    this.input = input;
    this.init();
  }

  init() {
    this.optionsBlock = document.querySelector('.cities__date-text');

    this.optionsBlock.addEventListener('click', this.optionsBlockEventListener.bind(this));

    this.input.setAttribute('data-value', DateInput.getDateFromOption('today'));

    this.picker = datepicker('#datepicker', {
      startDay: 1,
      customDays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      customMonths: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
      minDate: new Date(),
      formatter: (input, date) => {
        const value = date.toLocaleDateString();
        // eslint-disable-next-line no-param-reassign
        input.value = value;
      },
      onSelect: instance => {
        this.input.setAttribute('data-value', DateInput.formatDate(instance.dateSelected));
      }
    });
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

    return DateInput.formatDate(currentDate);
  }

  static formatDate(date) {
    const month = DateInput.formatDateNumber(date.getMonth() + 1);
    const day = DateInput.formatDateNumber(date.getDate());
    return `${date.getFullYear()}-${month}-${day}`;
  }

  getValue() {
    return this.input.dataset.value;
  }

  getText() {
    return this.input.value;
  }

  setData(options) {
    let { value = 'сегодня', dataValue = DateInput.getDateFromOption('today') } = options;
    this.picker.setDate(new Date(Date.parse(dataValue)), true);
    this.input.value = value;
  }
}

export default DateInput;
