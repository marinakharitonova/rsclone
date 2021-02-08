import datepicker from 'js-datepicker';

class DateInput {
  constructor(input, lang) {
    this.input = input;
    this.lang = lang;
    this.init();
  }

  init() {
    this.optionsBlock = document.querySelector('.cities__date-text');

    this.optionsBlock.addEventListener('click', this.optionsBlockEventListener.bind(this));

    this.input.setAttribute('data-value', DateInput.getDateFromOption('today'));

    this.ruDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    this.uaDays = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    this.ruMonths = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    this.uaMonths = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'];

    this.picker = datepicker('#datepicker', {
      startDay: 1,
      customDays: this.lang === 'RU' ? this.ruDays : this.uaDays,
      customMonths: this.lang === 'RU' ? this.ruMonths : this.uaMonths,
      minDate: new Date(),
      formatter: (input, date) => {
        // eslint-disable-next-line no-param-reassign
        input.value = date.toLocaleDateString();
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
    let { value = 'сегодня', dataValue = DateInput.getDateFromOption('today'), notSet = false } = options;
    if (!notSet) {
      this.picker.setDate(new Date(Date.parse(dataValue)), true);
      this.input.value = value;
    }
  }
}

export default DateInput;
