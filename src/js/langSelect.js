class LangSelect {
  constructor(select, lang, cb) {
    this.select = select;
    this.lang = lang;
    this.cb = cb;

    this.init();
  }

  init() {
    this.setValue(this.lang);

    this.select.addEventListener('change', () => {
      this.cb(this.select.value);
    });
  }

  setValue(lang) {
    this.select.value = lang;
  }
}

export default LangSelect;
