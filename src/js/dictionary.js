import DICTIONARY_DATA from './dictionaryData';

class Dictionary {
  constructor(lang) {
    this.lang = lang;

    this.init();
  }

  init() {
    for (let elem of document.querySelectorAll('[data-dictionary]')) {
      const key = elem.dataset.dictionary;
      const item = DICTIONARY_DATA.find(dictionaryElem => dictionaryElem.key === key);
      if (item) {
        elem.innerHTML = this.lang === 'RU' ? item.langRu : item.langUa;
      }
    }
  }
}

export default Dictionary;
