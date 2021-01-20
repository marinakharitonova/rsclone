import Selector from './selector';
import InputContainer from './inputContainer';
import RequestHelper from './requestHelper';
import Template from './template';
import HomeContainer from './homeContainer';
import Routing from './routing';

import DATA from './data';

class App {
  constructor() {
    this.init();
  }

  init() {
    this.API_KEY = 'b5d371b3-5e8a-4121-bf07-b76f8f02df8c';
    this.mode = 'all';
    this.searchButton = document.querySelector('.cities__button');

    this.selector = new Selector(this.changeMode.bind(this));
    this.inputContainer = new InputContainer(document.querySelector('.cities__fields'));
    this.template = new Template(document.querySelector('.main__template'));
    this.homeContainer = new HomeContainer(document.querySelector('.main__home'));

    this.searchButton.addEventListener('click', this.searchButtonClickListener.bind(this));

    window.onpopstate = this.historyPopstateListener.bind(this);

    document.addEventListener('DOMContentLoaded', () => {
      let urlPieces = Routing.parseUrl(location.href);
      console.log(urlPieces);
      if (urlPieces.params.transport) {
        this.changeMode(urlPieces.params.transport);
        let pointFrom = App.binarySearch(DATA, urlPieces.params.from, 0, DATA.length - 1);
        let pointTo = App.binarySearch(DATA, urlPieces.params.to, 0, DATA.length - 1);
        const forInputData = { value: pointFrom.title, result: [], code: urlPieces.params.from };
        const toInputData = { value: pointTo.title, result: [], code: urlPieces.params.to };
        const dateInputData = { value: urlPieces.params.date, dataValue: urlPieces.params.date };
        this.inputContainer.setData(forInputData, toInputData, dateInputData);
        this.searchTrip(urlPieces.params, false);
      } else {
        this.template.hide();
        this.homeContainer.show();
        this.inputContainer.setData();
        this.changeMode('all');
      }
    });

    // this.getUserGeolocation();
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

  // eslint-disable-next-line class-methods-use-this
  getUserGeolocation() {
    // eslint-disable-next-line no-undef
    ymaps.ready(() => {
      // eslint-disable-next-line no-undef
      var location = ymaps.geolocation.get();

      location.then(
        (result) => {
          let userAddress = result.geoObjects.get(0).properties.get('description');
          let userCoodinates = result.geoObjects.get(0).geometry.getCoordinates();

          console.log(userAddress);
          console.log(userCoodinates);
        },
        (err) => {
          console.log('Ошибка: ' + err);
        }
      );
    });
  }

  historyPopstateListener(e) {
    const state = e.state;
    let urlPieces = Routing.parseUrl(location.href);
    if (urlPieces.pathname === '/search') {
      this.changeMode(urlPieces.params.transport);
      const forInputData = { value: state.from, result: [], code: urlPieces.params.from };
      const toInputData = { value: state.to, result: [], code: urlPieces.params.to };
      const dateInputData = { value: state.date, dataValue: urlPieces.params.date };
      this.inputContainer.setData(forInputData, toInputData, dateInputData);
      this.searchTrip(urlPieces.params, false);
    } else if (urlPieces.pathname === '/') {
      this.template.hide();
      this.homeContainer.show();
      this.inputContainer.setData();
    }
  }

  searchButtonClickListener() {
    const params = this.inputContainer.getParams();
    this.searchTrip(params);
  }

  changeMode(mode) {
    this.mode = mode;
    this.selector.setActiveTab(mode);
  }

  searchTrip(params, canSetHistory = true) {
    const {
      from, to, date
    } = params;
    const dateParam = date ? `&date=${date}` : '';
    const transportParm = this.mode !== 'all' ? `&transport_types=${this.mode}` : '';
    const url = `https://api.rasp.yandex.net/v3.0/search/?apikey=${this.API_KEY}&format=json&from=${from}&to=${to}&lang=ru_RU&page=1${dateParam}${transportParm}`;

    if (from && to) {
      this.homeContainer.hide();
      this.template.show();
      this.template.showPreloader();
      this.inputContainer.stayLight();
      RequestHelper.sendRequest(url, date,
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
        });
    }
  }
}

export default App;
