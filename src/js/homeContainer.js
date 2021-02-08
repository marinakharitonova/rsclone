class HomeContainer {
  constructor(container) {
    this.container = container;
  }

  show() {
    this.container.classList.remove('hide');
  }

  hide() {
    this.container.classList.add('hide');
  }
}

export default HomeContainer;
