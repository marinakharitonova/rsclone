import Selector from './selector';
import InputContainer from './inputContainer';
import RequestHelper from './requestHelper';
import Template from './template';
import HomeContainer from './homeContainer';
import Routing from './routing';
import Location from './location';
import ModalWindow from './modalWindow';
import Header from './header';
import LangSelect from './langSelect';

import DATA from './data';
import Dictionary from './dictionary';

class App {
  constructor() {
    this.init();
  }

  init() {
    this.mode = 'all';
    this.lang = localStorage.getItem('lang') ? localStorage.getItem('lang') : 'RU';
    this.searchButton = document.querySelector('.cities__button');

    this.selector = new Selector(this.changeMode.bind(this));
    this.inputContainer = new InputContainer(document.querySelector('.cities__fields'), this.lang);
    this.template = new Template(document.querySelector('.main__template'), this.lang);
    this.homeContainer = new HomeContainer(document.querySelector('.main__home'));
    this.location = new Location(this.inputContainer.setData.bind(this.inputContainer), this.lang);
    this.modalWindow = new ModalWindow();
    this.dictionary = new Dictionary(this.lang);
    this.header = new Header(this.lang);
    this.langSelect = new LangSelect(document.querySelector('.header__select'), this.lang, this.changeLang.bind(this));

    this.searchButton.addEventListener('click', this.searchButtonClickListener.bind(this));

    window.onpopstate = this.historyPopstateListener.bind(this);

    document.addEventListener('DOMContentLoaded', this.domContentLoadedEventListener.bind(this));
  }

  changeLang(lang) {
    localStorage.setItem('lang', lang);
    this.location.changeLang();
    location.reload();
  }

  static binarySearch(data, target, start, end) {
    if (end < 1) return data[0];
    const middle = Math.floor((start + (end - start) / 2));

    if (target === data[middle].code) return data[middle];

    const startCode = Number(data[start].code.slice(1));
    const targetCode = Number(target.slice(1));
    const endCode = Number(data[end].code.slice(1));
    if (end - 1 === start) return Math.abs(startCode - targetCode) > Math.abs(endCode - targetCode) ? data[end] : data[start];

    const middleCode = Number(data[middle].code.slice(1));
    if (targetCode > middleCode) return this.binarySearch(data, target, middle, end);
    if (targetCode < middleCode) return this.binarySearch(data, target, start, middle);
  }

  renderSearch(params, from, to, date) {
    const forInputData = { value: from, result: [], code: params.from };
    const toInputData = { value: to, result: [], code: params.to };
    const dateInputData = { value: date, dataValue: params.date };
    this.inputContainer.setData(forInputData, toInputData, dateInputData);
    this.changeMode(params.transport);
    this.searchTrip(params, false);
  }

  domContentLoadedEventListener() {
    this.modalWindow.checkOpen();

    let urlParams = Routing.parseUrl(location.href);

    const paramName = this.lang === 'RU' ? 'title' : 'titleUA';

    if (urlParams.from) {
      const pointFrom = App.binarySearch(DATA, urlParams.from, 0, DATA.length - 1)[paramName];
      const titleFrom = pointFrom.split(',')[0];
      const pointTo = App.binarySearch(DATA, urlParams.to, 0, DATA.length - 1)[paramName];
      const titleTo = pointTo.split(',')[0];
      const date = new Date(Date.parse(urlParams.date)).toLocaleDateString();
      this.renderSearch(urlParams, titleFrom, titleTo, date);
    }
  }

  renderHomePage() {
    this.template.hide();
    this.homeContainer.show();
    this.inputContainer.setData();
  }

  historyPopstateListener(e) {
    const state = e.state;
    let urlParams = Routing.parseUrl(location.href);
    if (urlParams.from) {
      this.renderSearch(urlParams, state.from, state.to, state.date);
    } else {
      this.renderHomePage();
    }
  }

  searchButtonClickListener() {
    const params = this.inputContainer.getParams();
    this.searchTrip(params);

    let codeFrom = params.from;
    let codeTo = params.to;
    let nameFrom = this.inputContainer.getState().from;
    let nameTo = this.inputContainer.getState().to;

    this.location.makeLastCitiesData({
      nameFrom, nameTo, codeFrom, codeTo
    });
  }

  changeMode(mode) {
    this.mode = mode;
    this.selector.setActiveTab(mode);
  }

  searchTrip(params, canSetHistory = true) {
    this.template.setDefaultView();
    const {
      from, to, date
    } = params;
    const dateParam = date ? `&date=${date}` : '';
    const transportParm = this.mode !== 'all' ? `&transport_types=${this.mode}` : '';
    const langParam = this.lang === 'RU' ? 'ru_RU' : 'uk_UA';
    const url = `https://api.rasp.yandex.net/v3.0/search/?apikey=${RequestHelper.getKey()}&format=json&from=${from}&to=${to}&lang=${langParam}&page=1${dateParam}${transportParm}`;

    if (from && to) {
      this.homeContainer.hide();
      this.template.show();
      this.template.showPreloader();
      this.inputContainer.stayLight();
      RequestHelper.sendRequest(url,
        (...args) => {
          this.inputContainer.removeLight();
          this.template.render.call(this.template, ...args);
          if (canSetHistory) {
            Routing.setUrl('search', {
              from: from,
              to: to,
              date: date,
              transport: this.mode
            }, this.inputContainer.getState());
          }
        }, date);
    } else {
      this.inputContainer.showNotification();
    }
  }
}

export default App;
