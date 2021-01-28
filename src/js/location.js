import RequestHelper from './requestHelper';

class Location {
  constructor(cb, lang) {
    this.changeInputsCb = cb;
    this.lang = lang;
    this.init();
  }

  init() {
    this.buttonHome = document.querySelector('.link_home');
    this.homeLocation = document.querySelector('.home__location');
    this.homePlaces = document.querySelector('.home__places');
    this.stationsMaxCount = 10;
    this.sitiesLast = document.querySelector('.cities__last');
    this.maxLastCitiesLength = 15;

    this.findDataInSessionStorage();

    if (localStorage.getItem('lastCities')) {
      this.renderLastCities(JSON.parse(localStorage.getItem('lastCities')));
    }

    this.sitiesLast.addEventListener('click', this.citiesLastClickListener.bind(this));
  }

  citiesLastClickListener(e) {
    const elem = e.target;

    const currentItem = elem.closest('.city-btn');
    if (currentItem) {
      const dataInputFrom = {
        value: currentItem.dataset.nameFrom,
        code: currentItem.dataset.codeFrom,
        result: []
      };

      const dataInputTo = {
        value: currentItem.dataset.nameTo,
        code: currentItem.dataset.codeTo,
        result: []
      };

      this.changeInputsCb(dataInputFrom, dataInputTo, { notSet: true });
    }
  }

  makeLastCitiesData(data) {
    const {
      nameFrom, nameTo, codeFrom, codeTo
    } = data;
    let lastCities = [];
    if (localStorage.getItem('lastCities')) {
      lastCities = JSON.parse(localStorage.getItem('lastCities'));
      if (lastCities.length > this.maxLastCitiesLength) {
        localStorage.removeItem('lastCities');
        lastCities = [];
      }
    }
    if (lastCities.findIndex(elem => elem.codeTo === codeTo && elem.codeFrom === codeFrom) === -1) {
      lastCities = [{
        codeFrom,
        nameFrom,
        codeTo,
        nameTo
      }].concat(lastCities);
    }
    localStorage.setItem('lastCities', JSON.stringify(lastCities));
    this.renderLastCities(lastCities);
  }

  renderLastCities(data) {
    if (data.length === 0) return false;
    this.sitiesLast.innerHTML = '';

    let firstPart = data.length > 3 ? data.slice(0, 3) : data;
    let secondPart = data.length > 3 ? data.slice(3) : [];
    for (let elem of firstPart) {
      let template = `<button class="link city-btn" 
                        data-code-from="${elem.codeFrom}" 
                        data-code-to="${elem.codeTo}"
                        data-name-from="${elem.nameFrom}"
                        data-name-to="${elem.nameTo}"
                        >
                        ${elem.nameFrom}-${elem.nameTo}
                      </button>`;
      this.sitiesLast.insertAdjacentHTML('beforeend', template);
    }

    let list = '';
    for (let elem of secondPart) {
      let template = `<li class="list__item city-btn" 
                          data-code-from="${elem.codeFrom}" 
                          data-code-to="${elem.codeTo}"
                          data-name-from="${elem.nameFrom}"
                          data-name-to="${elem.nameTo}"
                          >
                       ${elem.nameFrom}-${elem.nameTo}
                      </li>`;
      list += template;
    }
    let secondTemplate = `<div class="link-wrapper">
                            <button class="link">● ● ●</button>
                            <ul class="list list_last">
                                ${list}
                            </ul>
                        </div>`;
    if (list.length > 0) this.sitiesLast.insertAdjacentHTML('beforeend', secondTemplate);
  }

  findDataInSessionStorage() {
    if (sessionStorage.getItem('locationName') && sessionStorage.getItem('nearestStations')) {
      const name = sessionStorage.getItem('locationName');
      const nearestStations = JSON.parse(sessionStorage.getItem('nearestStations'));
      this.setName(name);
      this.renderLocationBlock(nearestStations);
    } else {
      this.getUserGeolocation();
    }
  }

  static changeLang() {
    localStorage.removeItem('lastCities');
  }

  getUserGeolocation() {
    ymaps.ready(() => {
      var location = ymaps.geolocation.get();
      location.then(
        (result) => {
          let userAddress = result.geoObjects.get(0).properties.get('description');
          let userCoordinates = result.geoObjects.get(0).geometry.getCoordinates();
          if (userAddress.length > 1) {
            let splitAddress = userAddress.split(',');
            const name = splitAddress[splitAddress.length - 1];
            this.setName(name);
            sessionStorage.setItem('locationName', name);
            this.getNearestStations(userCoordinates);
          }
        }
      )
        .catch(() => {
          this.homeLocation.classList.add('hide');
          this.homePlaces.classList.add('hide');
        });
    });
  }

  getNearestStations(coords) {
    const dist = 50;
    const lat = coords[0];
    const long = coords[1];
    const key = RequestHelper.getKey();
    const langParam = this.lang === 'RU' ? 'ru_RU' : 'uk_UA';
    const urlTrain = `https://api.rasp.yandex.net/v3.0/nearest_stations/?apikey=${key}&format=json&lat=${lat}&lng=${long}&distance=${dist}&lang=${langParam}&station_types=train_station`;
    const urlPlane = `https://api.rasp.yandex.net/v3.0/nearest_stations/?apikey=${key}&format=json&lat=${lat}&lng=${long}&distance=${dist}&lang=${langParam}&station_types=airport`;
    const urlSuburban = `https://api.rasp.yandex.net/v3.0/nearest_stations/?apikey=${key}&format=json&lat=${lat}&lng=${long}&distance=${dist}&lang=${langParam}&station_types=station`;
    const urlBus = `https://api.rasp.yandex.net/v3.0/nearest_stations/?apikey=${key}&format=json&lat=${lat}&lng=${long}&distance=${dist}&lang=${langParam}&station_types=bus_station`;
    RequestHelper.sendManyRequests([urlBus, urlPlane, urlSuburban, urlTrain], (data) => {
      sessionStorage.setItem('nearestStations', JSON.stringify(data));
      this.renderLocationBlock(data);
    });
  }

  setName(name) {
    this.buttonHome.textContent = name;
  }

  renderLocationBlock(data) {
    const localData = this.makeDataForRender(data);
    this.renderPlaces(localData);
    this.homeLocation.classList.remove('hide');
  }

  static renderStations(stations, type, mode = 'block') {
    let res = '';
    let linkParam = '';
    if (type === 'suburban') {
      linkParam = 'suburban';
    } else if (type === 'bus') {
      linkParam = 'schedule';
    } else if (type === 'train' || type === 'plane') {
      linkParam = 'tablo';
    }

    const className = mode === 'block' ? 'station__item' : 'list__item';
    for (let elem of stations) {
      const title = elem.popular_title ? elem.popular_title : elem.title;
      const url = elem.type_choices[linkParam] && elem.type_choices[linkParam].desktop_url ? elem.type_choices[linkParam].desktop_url : '';
      let template = `<li class="${className}">
                       <a href="${url}" target="_blank" class="link">${title}</a>
                    </li>`;
      res += template;
    }
    return res;
  }

  makeDataForRender(data) {
    const trainStation = data[3].stations;
    const busStation = data[0].stations;
    const station = data[2].stations;
    const airport = data[1].stations;

    const forTrain = {
      name: this.lang === 'RU' ? 'Расписание поездов' : 'Розклад поїздів',
      stations: trainStation,
      img: 'src/assets/img/train.svg',
      type: 'train'
    };
    const forBus = {
      name: this.lang === 'RU' ? 'Расписание автобусов' : 'Розклад автобусів',
      stations: busStation,
      img: 'src/assets/img/bus.png',
      type: 'bus'
    };
    const forPlane = {
      name: this.lang === 'RU' ? 'Табло аэропортов' : 'Табло аеропортів',
      stations: airport,
      img: 'src/assets/img/plane.png',
      type: 'plane'
    };
    const forSuburban = {
      name: this.lang === 'RU' ? 'Расписание электричек' : 'Розклад електричок',
      stations: station,
      img: 'src/assets/img/el-train.svg',
      type: 'suburban'
    };

    return [forSuburban, forPlane, forTrain, forBus];
  }

  renderPlaces(places) {
    this.homePlaces.innerHTML = '';
    if (places.length === 0) return false;
    for (let elem of places) {
      if (elem.stations.length > 0) {
        const mode = elem.stations.length <= this.stationsMaxCount ? 'block' : 'list';
        const stations = Location.renderStations(elem.stations, elem.type, mode);
        let template = '';
        if (elem.stations.length <= 13) {
          template = `<div class="home__station station">
                        <div class="station__caption">
                            <img src="${elem.img}" alt="" class="station__img">
                            <h2 class="station__name">${elem.name}</h2>
                        </div>
                        <ul class="station__list">${stations}</ul>
                      </div>`;
        } else {
          template = `<div class="home__station home__station_list station">
                      <div class="station__caption  station__caption_link">
                          <img src="${elem.img}" alt="" class="station__img">
                          <h2 class="station__name">${elem.name}</h2>
                          <img src="src/assets/img/arrow-right.svg" alt="" class="station__img station__img_arrow">
                      </div>
                      <ul class="list list_station">
                         ${stations}
                      </ul>
                    </div>`;
        }

        this.homePlaces.insertAdjacentHTML('beforeend', template);
      }
    }
  }
}

export default Location;
