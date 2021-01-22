import RequestHelper from './requestHelper';
import DATA from './data';

class Location {
  constructor() {
    this.init();
  }

  init() {
    this.buttonHome = document.querySelector('.link_home');
    this.homeLocation = document.querySelector('.home__location');
    this.homePlaces = document.querySelector('.home__places');
    this.homeInput = document.querySelector('.home__input');
    this.resultMaxLength = 10;

    this.getUserGeolocation();
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
          let userCoordinates = result.geoObjects.get(0).geometry.getCoordinates();

          let splitAddress = userAddress.split(',');

          this.setName(splitAddress[splitAddress.length - 1]);
          this.getNearestStations(userCoordinates);
        },
        (err) => {
          console.log('Ошибка: ' + err);
        }
      );
    });
  }

  getNearestStations(coords) {
    const dist = 50;
    const lat = 55.7522;
    const long = 37.6156;
    const urlTrain = `https://api.rasp.yandex.net/v3.0/nearest_stations/?apikey=${RequestHelper.API_KEY}&format=json&lat=${lat}&lng=${long}&distance=${dist}&lang=ru_RU&station_types=train_station`;
    const urlPlane = `https://api.rasp.yandex.net/v3.0/nearest_stations/?apikey=${RequestHelper.API_KEY}&format=json&lat=${lat}&lng=${long}&distance=${dist}&lang=ru_RU&station_types=airport`;
    const urlSuburban = `https://api.rasp.yandex.net/v3.0/nearest_stations/?apikey=${RequestHelper.API_KEY}&format=json&lat=${lat}&lng=${long}&distance=${dist}&lang=ru_RU&station_types=station`;
    const urlBus = `https://api.rasp.yandex.net/v3.0/nearest_stations/?apikey=${RequestHelper.API_KEY}&format=json&lat=${lat}&lng=${long}&distance=${dist}&lang=ru_RU&station_types=bus_station`;
    RequestHelper.sendManyRequests([urlBus, urlPlane, urlSuburban, urlTrain], (data) => {
      console.log(data);
      const localData = this.makeDataForRender(data);
      this.renderPlaces(localData);
      this.homeLocation.classList.remove('hide');
    });
  }

  setName(name) {
    this.buttonHome.textContent = name;
  }

  renderStations(stations, type, mode = 'block') {
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
      name: 'Расписание поездов',
      stations: trainStation,
      img: 'src/assets/img/train.svg',
      type: 'train'
    };
    const forBus = {
      name: 'Расписание автобусов',
      stations: busStation,
      img: 'src/assets/img/bus.png',
      type: 'bus'
    };
    const forPlane = {
      name: 'Табло аэропортов',
      stations: airport,
      img: 'src/assets/img/plane.png',
      type: 'plane'
    };
    const forSuburban = {
      name: 'Расписание электричек',
      stations: station,
      img: 'src/assets/img/el-train.svg',
      type: 'suburban'
    };

    return [forSuburban, forPlane, forTrain, forBus];
  }

  renderPlaces(places) {
    console.log(places);
    this.homePlaces.innerHTML = '';
    if (places.length === 0) return false;
    for (let elem of places) {
      if (elem.stations.length === 0) continue;
      const mode = elem.stations.length <= 16 ? 'block' : 'list';
      const stations = this.renderStations(elem.stations, elem.type, mode);
      let template = '';
      if (elem.stations.length <= 16) {
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

export default Location;
