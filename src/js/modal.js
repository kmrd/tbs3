

export class Modal {

  buttonEl;

  constructor(buttonEl) {
    this.buttonEl = buttonEl;

    this.initEvents();
  }

  initEvents() {
    this.buttonEl.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('okto');
    });
  }

}