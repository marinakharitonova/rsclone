import Input from './input';
import DateInput from './dateInput';

class InputContainer {
  constructor(container) {
    this.container = container;

    this.init();
  }

  init() {
    this.fromInput = new Input(this.container.querySelector('.cities__input_from'));
    this.toInput = new Input(this.container.querySelector('.cities__input_to'));
    this.dateInput = new DateInput(this.container.querySelector('.cities__input_date'));
    this.changeDirectionBtn = this.container.querySelector('.cities__change');

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
}

export default InputContainer;
