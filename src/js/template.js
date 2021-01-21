import DateInput from './dateInput';

class Template {
  constructor(container) {
    this.container = container;

    this.init();
  }

  init() {
    this.itemsList = this.container.querySelector('.template__list');
    this.noTransportNotification = this.container.querySelector('.template__no-transport');
    this.preloader = this.container.querySelector('.template__preloader');
    this.departedBlock = this.container.querySelector('.template__departed');
    this.departedItemsList = this.container.querySelector('.template__list-departed');
    this.noRacesNotification = this.container.querySelector('.template__no-races');

    document.addEventListener('click', (e) => {
      const elem = e.target;

      const btn = elem.closest('.template__departed-btn');
      if (btn) {
        this.departedItemsList.classList.toggle('hide');
        let btnText = this.departedBlock.querySelector('.template__departed-btn-text');
        btnText.textContent = this.departedItemsList.classList.contains('hide') ? 'Показать ушедшие' : 'Скрыть ушедшие';
      }
    });
  }

  show() {
    this.container.classList.remove('hide');
  }

  hide() {
    this.container.classList.add('hide');
  }

  static getMonthName(number) {
    switch (number) {
      case 0:
        return 'янв';
      case 1:
        return 'фев';
      case 2:
        return 'март';
      case 3:
        return 'апр';
      case 4:
        return 'май';
      case 5:
        return 'июн';
      case 6:
        return 'июл';
      case 7:
        return 'авг';
      case 8:
        return 'сент';
      case 9:
        return 'окт';
      case 10:
        return 'нов';
      case 11:
        return 'дек';
      default:
        return false;
    }
  }

  static getDuration(number) {
    const count = number / 60;
    const hours = Math.trunc(count / 60);
    const min = count % 60;
    return `${hours}ч ${DateInput.formatDateNumber(min)}мин`;
  }

  static getImgFromTransportType(type) {
    switch (type) {
      case 'bus':
        return {
          src: 'src/assets/img/bus.png',
          name: 'Автобус'
        };
      case 'train':
        return {
          src: 'src/assets/img/train.svg',
          name: 'Поезд'
        };
      case 'suburban':
        return {
          src: 'src/assets/img/el-train.svg',
          name: 'Электричка'
        };
      case 'plane':
        return {
          src: 'src/assets/img/plane.png',
          name: 'Самолет'
        };
      default:
        return false;
    }
  }

  static formatPrice(price) {
    const floor = Math.floor(price);
    return floor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  drawTemplateElem(options, list) {
    const {
      imgInfo, name, carrier, vehicle, departure, duration, titleFrom, titleTo, arrival, tickets
    } = options;
    let template = `<li class="template__item">
                    <div class="template__block template__block_name">
                        <div class="template__name">
                            <img src="${imgInfo.src}" alt="${imgInfo.name}" class="template__img">
                            <a href="" class="link">${name}</a>
                        </div>
                        <p class="template__desc">
                            <span class="template__desc-carrier">${carrier}</span>
                            <span class="template__desc-model">${vehicle}</span>
                        </p>
                    </div>
                    <div class="template__block template__block_time">
                        <div class="template__time">
                            <p class="template__time-date">${departure.getDate()} ${Template.getMonthName(departure.getMonth())}</p>
                            <p class="template__time-from">${DateInput.formatDateNumber(departure.getHours())}:${DateInput.formatDateNumber(departure.getMinutes())}</p>
                            <p class="template__time-station">${titleFrom}</p>
                        </div>
                        <div class="template__time template__time_center">
                            <p class="template__time-duration">${duration}</p>
                        </div>
                        <div class="template__time template__time_right">
                            <p class="template__time-date">${arrival.getDate()} ${Template.getMonthName(arrival.getMonth())}</p>
                            <p class="template__time-to">${DateInput.formatDateNumber(arrival.getHours())}:${DateInput.formatDateNumber(arrival.getMinutes())}</p>
                            <p class="template__time-station">${titleTo}</p>
                        </div>
                    </div>
                    <div class="template__block template__block_price">
                        <ul class="template__price">${tickets}</ul>
                    </div>
                </li>`;

    list.insertAdjacentHTML('beforeend', template);
  }

  showNoTransport() {
    this.itemsList.classList.add('hide');
    this.noTransportNotification.classList.remove('hide');
  }

  setDefaultView() {
    this.preloader.classList.add('hide');
    this.itemsList.classList.remove('hide');
    this.noTransportNotification.classList.add('hide');
    this.departedBlock.classList.add('hide');
    this.noRacesNotification.classList.add('hide');
    this.itemsList.innerHTML = '';
    this.departedItemsList.innerHTML = '';
  }

  renderTickets(data) {
    if (!data || data.length === 0) return '';
    let result = '';
    for (let elem of data) {
      let template = `<li class="template__price-item">
                          <span class="template__price-name">${elem.name ? elem.name : ''}</span>
                          <span class="template__price-cost">${Template.formatPrice(Number(elem.price.whole))}&nbsp;${elem.currency}</span>
                      </li>`;
      result += template;
    }
    return result;
  }

  showPreloader() {
    this.preloader.classList.remove('hide');
  }

  showDeparted(col) {
    this.departedBlock.classList.remove('hide');
    this.departedBlock.querySelector('.template__departed-col').textContent = col;
  }

  showNoRaces() {
    this.itemsList.classList.add('hide');
    this.noRacesNotification.classList.remove('hide');
  }

  render(data, searchDate) {
    console.log(data);
    this.setDefaultView();
    if (data.segments.length === 0) {
      this.showNoTransport();
      return false;
    }
    let departedCount = 0;
    let availableRacesCount = 0;
    for (let elem of data.segments) {
      const tickets = elem.tickets_info && elem.tickets_info.places ? elem.tickets_info.places : null;
      const departure = new Date(elem.departure);
      // eslint-disable-next-line no-continue
      if (departure.getDate() !== new Date(searchDate).getDate()) continue;
      const options = {
        imgInfo: Template.getImgFromTransportType(elem.thread.transport_type),
        name: elem.thread.number ? `${elem.thread.number} ${elem.thread.title}` : `${elem.thread.title}`,
        carrier: elem.thread && elem.thread.carrier ? elem.thread.carrier.title : '',
        vehicle: elem.thread && elem.thread.vehicle ? elem.thread.vehicle : '',
        departure: departure,
        arrival: new Date(elem.arrival),
        duration: Template.getDuration(elem.duration),
        titleFrom: elem.from.popular_title ? elem.from.popular_title : elem.from.title,
        titleTo: elem.to.popular_title ? elem.to.popular_title : elem.to.title,
        tickets: this.renderTickets(tickets)
      };
      let offset = departure - new Date();
      if (offset <= 0) {
        departedCount += 1;
        this.drawTemplateElem(options, this.departedItemsList);
        // eslint-disable-next-line no-continue
        continue;
      } else {
        availableRacesCount += 1;
        this.drawTemplateElem(options, this.itemsList);
      }
    }
    if (departedCount) this.showDeparted(departedCount);
    if (availableRacesCount === 0) this.showNoRaces();
  }
}

export default Template;
