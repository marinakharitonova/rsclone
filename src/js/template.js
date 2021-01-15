import DateInput from './dateInput';

class Template {
  constructor(container) {
    this.container = container;

    this.init();
  }

  init() {
    this.itemsList = this.container.querySelector('.template__list');
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
    const count = number / 3600;
    const int = Math.trunc(count);
    const float = ((count % 1).toFixed(2)).toString().split('.')[1];
    return `${int}ч ${float}мин`;
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
          src: 'src/assets/img/plane.svg',
          name: 'Самолет'
        };
      default:
        return false;
    }
  }

  render(data, searchDate) {
    console.log(data);
    this.itemsList.innerHTML = '';
    if (data.segments.length === 0) return false;
    for (let elem of data.segments) {
      const name = elem.thread.number ? `${elem.thread.number} ${elem.thread.title}` : `${elem.thread.title}`;
      const departure = new Date(elem.departure);
      const arrival = new Date(elem.arrival);
      const vehicle = elem.thread && elem.thread.vehicle ? elem.thread.vehicle : '';
      const carrier = elem.thread && elem.thread.carrier ? elem.thread.carrier.title : '';
      const tickets = elem.tickets_info;
      const imgInfo = Template.getImgFromTransportType(elem.from.transport_type);
      // eslint-disable-next-line no-continue
      if (departure.getDate() !== new Date(searchDate).getDate()) continue;
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
                            <p class="template__time-station">${elem.from.popular_title ? elem.from.popular_title : elem.from.title}</p>
                        </div>
                        <div class="template__time template__time_center">
                            <p class="template__time-duration">${Template.getDuration(elem.duration)}</p>
                        </div>
                        <div class="template__time template__time_right">
                            <p class="template__time-date">${arrival.getDate()} ${Template.getMonthName(arrival.getMonth())}</p>
                            <p class="template__time-to">${DateInput.formatDateNumber(arrival.getHours())}:${DateInput.formatDateNumber(arrival.getMinutes())}</p>
                            <p class="template__time-station">${elem.to.popular_title ? elem.to.popular_title : elem.to.title}</p>
                        </div>
                    </div>
                    <div class="template__block template__block_price">
                        <ul class="template__price"></ul>
                    </div>
                </li>`;

      this.itemsList.insertAdjacentHTML('beforeend', template);
    }
  }
}

export default Template;
