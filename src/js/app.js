import Selector from './selector';
import InputContainer from './inputContainer';
import RequestHelper from './requestHelper';
import Template from './template';
import HomeContainer from './homeContainer';

import DATA from './data';

class App {
  constructor() {
    this.init();
  }

  init() {
    this.API_KEY = 'b5d371b3-5e8a-4121-bf07-b76f8f02df8c';
    this.mode = '';
    this.searchButton = document.querySelector('.cities__button');

    this.selector = new Selector(this.changeMode.bind(this));
    this.inputContainer = new InputContainer(document.querySelector('.cities__fields'));
    this.template = new Template(document.querySelector('.main__template'));
    this.homeContainer = new HomeContainer(document.querySelector('.main__home'));

    this.searchButton.addEventListener('click', this.searchTrip.bind(this));

    // this.getUserGeolocation();

    /* const proxyurl = 'https://cors-anywhere.herokuapp.com/';
    const url = 'https://api.rasp.yandex.net/v3.0/stations_list/?apikey=b5d371b3-5e8a-4121-bf07-b76f8f02df8c&lang=uk_UA&format=json'; // site that doesn’t send Access-Control-*
    fetch(proxyurl + url) // https://cors-anywhere.herokuapp.com/https://example.com
      .then(response => response.text())
      .then(contents => this.cb(JSON.parse(contents).countries))
      .catch(() => console.log('Can’t access ' + url + ' response. Blocked by browser?')); */

    // console.log(DATA);

    // let closestPoint = this.binarySearch(DATA, 'Рязань, Рязанская область, Россия', 0, DATA.length - 1);
  }

  binarySearch(data, target, start, end) {
    if (end < 1) return data[0];
    const middle = Math.floor((start + (end - start) / 2));

    if (target === data[middle].title) return data[middle];

    if (end - 1 === start) return (data[start].title).localeCompare(target) > (data[end].title).localeCompare(target) ? data[end] : data[start];

    if (target.localeCompare(data[middle].title) > 0) return this.binarySearch(data, target, middle, end);
    if (target.localeCompare(data[middle].title) < 0) return this.binarySearch(data, target, start, middle);
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

  changeMode(mode) {
    this.mode = mode;
  }

  searchTrip() {
    const { from, to, date } = this.inputContainer.getParams();
    const dateParam = date ? `&date=${date}` : '';
    const transportParm = this.mode ? `&transport_types=${this.mode}` : '';
    const url = `https://api.rasp.yandex.net/v3.0/search/?apikey=${this.API_KEY}&format=json&from=${from}&to=${to}&lang=ru_RU&page=1${dateParam}${transportParm}`;

    if (from && to) {
      this.homeContainer.hide();
      this.template.show();
      RequestHelper.sendRequest(url, date, this.template.render.bind(this.template));
    }
  }
}

export default App;
