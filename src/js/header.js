class Header {
  constructor(lang) {
    this.lang = lang;

    this.init();
  }

  init() {
    this.container = document.querySelector('.header');
    this.yaLink = this.container.querySelector('.header__logo-text');
    this.raspLogo = this.container.querySelector('.rasp-logo');

    this.setLang(this.lang);
  }

  setLang(lang) {
    const href = lang === 'RU' ? 'https://yandex.ru/' : 'https://yandex.ua/';
    this.yaLink.setAttribute('href', href);

    const src = lang === 'RU' ? 'src/assets/img/rasp-logo.png' : 'src/assets/img/logo-ua.png';
    this.raspLogo.setAttribute('src', src);
  }
}

export default Header;
