class ModalWindow {
  constructor() {
    this.init();
  }

  init() {
    this.modalWindow = document.querySelector('.modal-window');
    this.modalOverlay = document.querySelector('.modal-overlay');

    document.addEventListener('click', this.documentClickListener.bind(this));
  }

  documentClickListener(e) {
    const elem = e.target;

    if (elem.closest('.modal-overlay') || elem.closest('.modal-window__close')) {
      this.close();
    }

    if (elem.closest('.modal-window__all')) {
      this.disableModalOpen();
      this.close();
    }
  }

  disableModalOpen() {
    localStorage.setItem('notShowModal', 'true');
  }

  checkOpen() {
    if (localStorage.getItem('notShowModal')) return false;
    this.open();
  }

  open() {
    setTimeout(() => {
      this.modalOverlay.classList.add('active');
      this.modalWindow.classList.add('active');
      document.body.classList.add('no-scroll');
    }, 500);
  }

  close() {
    this.modalOverlay.classList.remove('active');
    this.modalWindow.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }
}

export default ModalWindow;
