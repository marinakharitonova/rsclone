import Input from './input';
import DateInput from './dateInput';

class InputContainer {
  constructor(container, lang) {
    this.container = container;
    this.lang = lang;

    this.init();
  }

  init() {
    this.fromInput = new Input(this.container.querySelector('.cities__input_from'), this.lang);
    this.toInput = new Input(this.container.querySelector('.cities__input_to'), this.lang);
    this.dateInput = new DateInput(this.container.querySelector('.cities__input_date'), this.lang);
    this.changeDirectionBtn = this.container.querySelector('.cities__change');
    this.notification = this.container.querySelector('.cities__notification');

    document.addEventListener('click', this.documentClickListener.bind(this));
    this.changeDirectionBtn.addEventListener('click', this.changeDirectionBtnClickListener.bind(this));
  }

  documentClickListener(e) {
    let elem = e.target;

    const canInputFromBlur = !elem.closest('.list-from') && !elem.closest('.cities__input-wrapper_from');
    if (canInputFromBlur) {
      this.fromInput.blurEventListener();
    }

    const canInputToBlur = !elem.closest('.list-to') && !elem.closest('.cities__input-wrapper_to');
    if (canInputToBlur) {
      this.toInput.blurEventListener();
    }
  }

  changeDirectionBtnClickListener() {
    let fromInputData = this.fromInput.getData();
    let toInputData = this.toInput.getData();

    this.fromInput.setData(toInputData);
    this.toInput.setData(fromInputData);
  }

  getParams() {
    return {
      from: this.fromInput.getValue(),
      to: this.toInput.getValue(),
      date: this.dateInput.getValue()
    };
  }

  getState() {
    return {
      from: this.fromInput.getName(),
      to: this.toInput.getName(),
      date: this.dateInput.getText()
    };
  }

  stayLight() {
    this.container.classList.add('light');
  }

  removeLight() {
    this.container.classList.remove('light');
  }

  setData(dataInputFrom = {}, dataInputTo = {}, dataInputDate = {}) {
    this.fromInput.setData(dataInputFrom);
    this.toInput.setData(dataInputTo);
    this.dateInput.setData(dataInputDate);
  }

  showNotification() {
    this.notification.classList.add('active');
    setTimeout(()=> {
      this.notification.classList.remove('active');
    }, 1000);
  }
}

export default InputContainer;
